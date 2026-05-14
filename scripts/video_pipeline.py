"""
Video Generation Pipeline for Icon Code Y.

Polls Convex for queued video generation jobs, generates them using
Viktor's text_to_video SDK, uploads the result to Convex storage,
and updates the generation record.

Supports BOTH dev and production Convex deployments.
Runs in a loop, polling every 15 seconds.

Usage:
    cd /work && uv run python viktor-spaces/icon-code-y/scripts/video_pipeline.py
"""

import asyncio
import json
import os
import sys
import urllib.request
import urllib.error
import traceback
from pathlib import Path

# Load env from .env.local
env_path = Path(__file__).parent.parent / ".env.local"
if env_path.exists():
    for line in env_path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, val = line.split("=", 1)
            os.environ.setdefault(key, val)

DEV_CONVEX_URL = os.environ.get("VITE_CONVEX_URL", "https://proper-peccary-734.convex.cloud")
PROD_CONVEX_URL = os.environ.get("PROD_CONVEX_URL", "https://loyal-hornet-660.convex.cloud")
PROJECT_SECRET = os.environ["VIKTOR_SPACES_PROJECT_SECRET"]

sys.path.insert(0, "/work")

VALID_MODELS = {
    "seedance-2.0", "kling-video-v3-standard", "kling-video-v3-pro",
    "sora-2-pro", "veo-3.1-audio", "veo-3.1-fast-audio",
    "veo-3.1-audio-1080p", "veo-3.1-fast-audio-1080p",
    "grok-imagine-video-480p", "grok-imagine-video-720p",
}

MAX_RETRIES = 2
POLL_INTERVAL = 15  # seconds


def convex_query(url: str, function_name: str, args: dict = {}) -> any:
    data = json.dumps({"path": function_name, "args": args}).encode()
    req = urllib.request.Request(
        f"{url}/api/query",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    resp = urllib.request.urlopen(req, timeout=30)
    result = json.loads(resp.read())
    if result.get("status") == "error":
        raise Exception(f"Query error: {result}")
    return result.get("value")


def convex_mutation(url: str, function_name: str, args: dict = {}) -> any:
    data = json.dumps({"path": function_name, "args": args}).encode()
    req = urllib.request.Request(
        f"{url}/api/mutation",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    resp = urllib.request.urlopen(req, timeout=30)
    result = json.loads(resp.read())
    if result.get("status") == "error":
        raise Exception(f"Mutation error: {result}")
    return result.get("value")


async def download_image(url: str) -> str:
    import tempfile
    resp = urllib.request.urlopen(url, timeout=60)
    suffix = ".jpg"
    ct = resp.headers.get("Content-Type", "")
    if "png" in ct:
        suffix = ".png"
    elif "webp" in ct:
        suffix = ".webp"
    os.makedirs("/work/temp", exist_ok=True)
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix, dir="/work/temp")
    tmp.write(resp.read())
    tmp.close()
    print(f"  Downloaded input image: {tmp.name}")
    return tmp.name


async def generate_video(
    prompt: str,
    model: str = "seedance-2.0",
    aspect_ratio: str = "16:9",
    duration: int = 5,
    input_image_url: str | None = None,
) -> str:
    """Generate a video using Viktor SDK and return local path."""
    from sdk.tools.utils_tools import text_to_video

    if model not in VALID_MODELS:
        model = "seedance-2.0"

    kwargs: dict = {
        "prompt": prompt,
        "model": model,
        "aspect_ratio": aspect_ratio,
        "duration_seconds": duration,
    }

    if model == "sora-2-pro":
        kwargs["resolution"] = "1024p"

    if input_image_url:
        local_img = await download_image(input_image_url)
        kwargs["image_paths"] = [local_img]
        print(f"  Using reference image for image-to-video")

    print(f"  Calling text_to_video with model={model}, duration={duration}s...")
    result = await text_to_video(**kwargs)
    if result.local_path is None:
        raise Exception(f"Model {model} returned no video (local_path=None). Model may be unavailable.")
    latency = f"{result.latency_seconds:.0f}s" if result.latency_seconds else "?s"
    print(f"  Video generated: {result.local_path} ({latency})")
    return result.local_path


def upload_to_convex_storage(convex_url: str, file_path: str) -> str:
    upload_url = convex_mutation(convex_url, "generations:generateUploadUrl", {
        "secret": PROJECT_SECRET,
    })
    with open(file_path, "rb") as f:
        file_data = f.read()

    content_type = "video/mp4"
    if file_path.endswith(".webm"):
        content_type = "video/webm"

    req = urllib.request.Request(
        upload_url,
        data=file_data,
        headers={"Content-Type": content_type},
        method="POST",
    )
    resp = urllib.request.urlopen(req, timeout=120)
    result = json.loads(resp.read())
    storage_id = result.get("storageId")
    print(f"  Uploaded to storage: {storage_id}")
    return storage_id


async def process_jobs_for_db(convex_url: str, db_label: str) -> int:
    """Process pending video jobs for one Convex deployment."""
    try:
        pending = convex_query(convex_url, "generations:listPending")
    except Exception as e:
        print(f"  [{db_label}] Error querying pending: {e}")
        return 0

    video_jobs = [j for j in pending if j["type"] == "text-to-video"]

    if not video_jobs:
        return 0

    print(f"  [{db_label}] Found {len(video_jobs)} pending video job(s).")
    processed = 0

    for job in video_jobs:
        job_id = job["_id"]
        prompt = job["prompt"]
        model = job.get("model") or "seedance-2.0"
        duration = job.get("duration") or 5
        aspect_ratio = job.get("aspectRatio", "16:9")
        input_image_url = job.get("inputImageUrl")

        ar_map = {"16:9": "16:9", "9:16": "9:16", "1:1": "1:1", "4:3": "4:3", "3:4": "3:4", "21:9": "21:9"}
        ar = ar_map.get(aspect_ratio, "16:9")

        print(f"\n{'='*60}")
        print(f"[{db_label}] Processing: {prompt[:80]}...")
        print(f"  Model: {model}, Duration: {duration}s, Aspect: {ar}")
        if input_image_url:
            print(f"  Input image: {input_image_url[:80]}...")

        convex_mutation(convex_url, "generations:markGenerating", {
            "id": job_id,
            "secret": PROJECT_SECRET,
        })

        retries = 0
        while retries <= MAX_RETRIES:
            try:
                local_path = await generate_video(
                    prompt, model=model, aspect_ratio=ar,
                    duration=duration, input_image_url=input_image_url,
                )
                storage_id = upload_to_convex_storage(convex_url, local_path)
                convex_mutation(convex_url, "generations:completeWithStorage", {
                    "id": job_id,
                    "secret": PROJECT_SECRET,
                    "storageId": storage_id,
                })
                print(f"  ✅ Done!")
                processed += 1
                break

            except Exception as e:
                retries += 1
                print(f"  ❌ Attempt {retries}/{MAX_RETRIES + 1} failed: {e}")
                if retries > MAX_RETRIES:
                    convex_mutation(convex_url, "generations:failGeneration", {
                        "id": job_id,
                        "secret": PROJECT_SECRET,
                        "error": str(e)[:200],
                    })
                    print(f"  ❌ Permanently failed after {MAX_RETRIES + 1} attempts.")
                else:
                    print(f"  🔄 Retrying...")
                    await asyncio.sleep(3)

        # Clean up temp files
        try:
            if 'local_path' in dir() and os.path.exists(local_path):
                os.remove(local_path)
        except Exception:
            pass

    return processed


async def reset_stuck_generating(convex_url: str, db_label: str):
    """Reset jobs stuck in 'generating' status for too long back to 'queued'."""
    try:
        all_gens = convex_query(convex_url, "generations:list", {"limit": 50})
        stuck = [g for g in all_gens if g["status"] == "generating" and (
            # Stuck for more than 10 minutes
            g["createdAt"] < (int(asyncio.get_event_loop().time() * 1000) - 600000)
        )]
        # Use a simpler check - anything in "generating" that's been there a while
        for gen in all_gens:
            if gen["status"] == "generating":
                age_ms = (json.loads(urllib.request.urlopen(
                    urllib.request.Request("https://worldtimeapi.org/api/timezone/UTC", method="GET"),
                    timeout=5
                ).read()).get("unixtime", 0) * 1000) - gen["createdAt"]
                if age_ms > 600000:  # > 10 minutes
                    print(f"  [{db_label}] Resetting stuck job: {gen['prompt'][:40]}... (age: {age_ms/60000:.0f}min)")
                    convex_mutation(convex_url, "generations:resetStuck", {
                        "id": gen["_id"],
                        "secret": PROJECT_SECRET,
                    })
    except Exception as e:
        # Non-critical, don't crash
        pass


async def main_loop():
    print("🎬 Video Generation Pipeline v2.0 (Multi-DB)")
    print(f"  Dev:  {DEV_CONVEX_URL}")
    print(f"  Prod: {PROD_CONVEX_URL}")
    print(f"  Poll interval: {POLL_INTERVAL}s")
    print(f"  Max retries: {MAX_RETRIES}")
    print()

    cycle = 0
    while True:
        cycle += 1
        total = 0

        for convex_url, label in [(PROD_CONVEX_URL, "PROD"), (DEV_CONVEX_URL, "DEV")]:
            try:
                n = await process_jobs_for_db(convex_url, label)
                total += n
            except Exception as e:
                print(f"  [{label}] Pipeline error: {e}")
                traceback.print_exc()

        if total == 0 and cycle % 4 == 0:
            print(f"[Cycle {cycle}] No jobs. Waiting {POLL_INTERVAL}s...")

        await asyncio.sleep(POLL_INTERVAL)


async def main_once():
    """Run once (for initial catch-up), then exit."""
    print("🎬 Video Generation Pipeline v2.0 (Single Run)")
    print(f"  Dev:  {DEV_CONVEX_URL}")
    print(f"  Prod: {PROD_CONVEX_URL}")
    print()

    total = 0
    for convex_url, label in [(PROD_CONVEX_URL, "PROD"), (DEV_CONVEX_URL, "DEV")]:
        try:
            n = await process_jobs_for_db(convex_url, label)
            total += n
        except Exception as e:
            print(f"  [{label}] Pipeline error: {e}")
            traceback.print_exc()

    print(f"\nDone. Processed {total} video(s).")


if __name__ == "__main__":
    if "--loop" in sys.argv:
        asyncio.run(main_loop())
    else:
        asyncio.run(main_once())
