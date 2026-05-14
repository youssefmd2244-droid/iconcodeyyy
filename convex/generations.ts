import { v } from "convex/values";
import { mutation, query, internalMutation, internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

// ─── Shared validator ────────────────────────────────────────────
const genObject = v.object({
  _id: v.id("generations"),
  _creationTime: v.number(),
  prompt: v.string(),
  type: v.union(
    v.literal("text-to-image"),
    v.literal("text-to-video"),
    v.literal("image-upscale"),
    v.literal("style-transfer"),
  ),
  model: v.optional(v.string()),
  duration: v.optional(v.number()),
  style: v.optional(v.string()),
  aspectRatio: v.optional(v.string()),
  inputImageStorageId: v.optional(v.id("_storage")),
  inputImageUrl: v.optional(v.string()),
  status: v.union(
    v.literal("queued"),
    v.literal("generating"),
    v.literal("done"),
    v.literal("failed"),
  ),
  resultUrl: v.optional(v.string()),
  resultStorageId: v.optional(v.id("_storage")),
  error: v.optional(v.string()),
  createdAt: v.number(),
  completedAt: v.optional(v.number()),
  aiCaption: v.optional(v.string()),
  aiHashtags: v.optional(v.array(v.string())),
  aiTitle: v.optional(v.string()),
  niche: v.optional(v.string()),
  retryCount: v.optional(v.number()),
});

// ─── Queries ─────────────────────────────────────────────────────

export const list = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(genObject),
  handler: async (ctx, { limit }) => {
    return await ctx.db
      .query("generations")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit ?? 50);
  },
});

export const get = query({
  args: { id: v.id("generations") },
  returns: v.union(genObject, v.null()),
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const stats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    done: v.number(),
    generating: v.number(),
    queued: v.number(),
    failed: v.number(),
  }),
  handler: async (ctx) => {
    const all = await ctx.db.query("generations").collect();
    return {
      total: all.length,
      done: all.filter(g => g.status === "done").length,
      generating: all.filter(g => g.status === "generating").length,
      queued: all.filter(g => g.status === "queued").length,
      failed: all.filter(g => g.status === "failed").length,
    };
  },
});

export const listPending = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("generations"),
    prompt: v.string(),
    type: v.union(
      v.literal("text-to-image"),
      v.literal("text-to-video"),
      v.literal("image-upscale"),
      v.literal("style-transfer"),
    ),
    model: v.optional(v.string()),
    duration: v.optional(v.number()),
    style: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    inputImageUrl: v.optional(v.string()),
    status: v.union(
      v.literal("queued"),
      v.literal("generating"),
      v.literal("done"),
      v.literal("failed"),
    ),
    createdAt: v.number(),
  })),
  handler: async (ctx) => {
    const results = await ctx.db
      .query("generations")
      .withIndex("by_status", q => q.eq("status", "queued"))
      .order("asc")
      .take(10);
    return results.map(r => ({
      _id: r._id,
      prompt: r.prompt,
      type: r.type,
      model: r.model,
      duration: r.duration,
      style: r.style,
      aspectRatio: r.aspectRatio,
      inputImageUrl: r.inputImageUrl,
      status: r.status,
      createdAt: r.createdAt,
    }));
  },
});

// ─── Mutations ───────────────────────────────────────────────────

export const generateUploadUrl = mutation({
  args: { secret: v.optional(v.string()) },
  returns: v.string(),
  handler: async (ctx, { secret }) => {
    if (secret) {
      const expectedSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
      if (secret !== expectedSecret) throw new Error("Unauthorized");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
    type: v.union(
      v.literal("text-to-image"),
      v.literal("text-to-video"),
      v.literal("image-upscale"),
      v.literal("style-transfer"),
    ),
    model: v.optional(v.string()),
    duration: v.optional(v.number()),
    style: v.optional(v.string()),
    aspectRatio: v.optional(v.string()),
    inputImageStorageId: v.optional(v.id("_storage")),
  },
  returns: v.id("generations"),
  handler: async (ctx, args) => {
    let inputImageUrl: string | undefined;
    if (args.inputImageStorageId) {
      inputImageUrl = await ctx.storage.getUrl(args.inputImageStorageId) ?? undefined;
    }

    const id = await ctx.db.insert("generations", {
      prompt: args.prompt,
      type: args.type,
      model: args.model,
      duration: args.duration,
      style: args.style,
      aspectRatio: args.aspectRatio,
      inputImageStorageId: args.inputImageStorageId,
      inputImageUrl,
      status: "queued",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.generations.runGeneration, {
      generationId: id,
    });

    return id;
  },
});

export const updateStatus = internalMutation({
  args: {
    id: v.id("generations"),
    status: v.union(
      v.literal("queued"),
      v.literal("generating"),
      v.literal("done"),
      v.literal("failed"),
    ),
    resultUrl: v.optional(v.string()),
    resultStorageId: v.optional(v.id("_storage")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, resultUrl, resultStorageId, error }) => {
    const updates: Record<string, unknown> = { status };
    if (resultUrl !== undefined) updates.resultUrl = resultUrl;
    if (resultStorageId !== undefined) updates.resultStorageId = resultStorageId;
    if (error !== undefined) updates.error = error;
    if (status === "done" || status === "failed") updates.completedAt = Date.now();
    await ctx.db.patch(id, updates);
  },
});

export const markGenerating = mutation({
  args: {
    id: v.id("generations"),
    secret: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { id, secret }) => {
    const expectedSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
    if (secret !== expectedSecret) return false;
    const gen = await ctx.db.get(id);
    if (!gen || gen.status !== "queued") return false;
    await ctx.db.patch(id, { status: "generating" });
    return true;
  },
});

export const completeGeneration = mutation({
  args: {
    id: v.id("generations"),
    secret: v.string(),
    resultUrl: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { id, secret, resultUrl }) => {
    const expectedSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
    if (secret !== expectedSecret) return false;
    const gen = await ctx.db.get(id);
    if (!gen) return false;
    await ctx.db.patch(id, { status: "done", resultUrl, completedAt: Date.now() });
    return true;
  },
});

export const failGeneration = mutation({
  args: {
    id: v.id("generations"),
    secret: v.string(),
    error: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { id, secret, error }) => {
    const expectedSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
    if (secret !== expectedSecret) return false;
    const gen = await ctx.db.get(id);
    if (!gen) return false;
    await ctx.db.patch(id, { status: "failed", error, completedAt: Date.now() });
    return true;
  },
});

export const completeWithStorage = mutation({
  args: {
    id: v.id("generations"),
    secret: v.string(),
    storageId: v.id("_storage"),
  },
  returns: v.boolean(),
  handler: async (ctx, { id, secret, storageId }) => {
    const expectedSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
    if (secret !== expectedSecret) return false;
    const gen = await ctx.db.get(id);
    if (!gen) return false;
    const url = await ctx.storage.getUrl(storageId);
    await ctx.db.patch(id, {
      status: "done",
      resultStorageId: storageId,
      resultUrl: url ?? undefined,
      completedAt: Date.now(),
    });
    return true;
  },
});

export const resetStuck = mutation({
  args: {
    id: v.id("generations"),
    secret: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, { id, secret }) => {
    const expectedSecret = process.env.VIKTOR_SPACES_PROJECT_SECRET;
    if (secret !== expectedSecret) return false;
    const gen = await ctx.db.get(id);
    if (!gen || gen.status !== "generating") return false;
    await ctx.db.patch(id, { status: "queued" });
    return true;
  },
});

export const retryFailed = mutation({
  args: { id: v.id("generations") },
  returns: v.boolean(),
  handler: async (ctx, { id }) => {
    const gen = await ctx.db.get(id);
    if (!gen || gen.status !== "failed") return false;
    const retryCount = ((gen as any).retryCount ?? 0) + 1;
    await ctx.db.patch(id, { status: "queued", error: undefined, retryCount } as any);
    // Re-trigger generation
    await ctx.scheduler.runAfter(0, internal.generations.runGeneration, {
      generationId: id,
    });
    return true;
  },
});

export const deleteGeneration = mutation({
  args: { id: v.id("generations") },
  returns: v.boolean(),
  handler: async (ctx, { id }) => {
    const gen = await ctx.db.get(id);
    if (!gen) return false;
    await ctx.db.delete(id);
    return true;
  },
});

export const cancelGeneration = mutation({
  args: { id: v.id("generations") },
  returns: v.boolean(),
  handler: async (ctx, { id }) => {
    const gen = await ctx.db.get(id);
    if (!gen) return false;
    if (gen.status !== "queued" && gen.status !== "generating") return false;
    await ctx.db.patch(id, { status: "failed", error: "Cancelled by user", completedAt: Date.now() });
    return true;
  },
});

// ─── Actions ─────────────────────────────────────────────────────

declare const process: { env: Record<string, string | undefined> };

const VIKTOR_API_URL = process.env.VIKTOR_SPACES_API_URL!;
const PROJECT_NAME = process.env.VIKTOR_SPACES_PROJECT_NAME!;
const PROJECT_SECRET = process.env.VIKTOR_SPACES_PROJECT_SECRET!;

async function callViktorTool<T>(role: string, args: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`${VIKTOR_API_URL}/api/viktor-spaces/tools/call`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: PROJECT_NAME,
      project_secret: PROJECT_SECRET,
      role,
      arguments: args,
    }),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`);
  }
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error ?? "Tool call failed");
  }
  return json.result as T;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s,)]+/);
  return match ? match[0] : null;
}

export const runGeneration = internalAction({
  args: { generationId: v.id("generations") },
  handler: async (ctx, { generationId }) => {
    await ctx.runMutation(internal.generations.updateStatus, {
      id: generationId,
      status: "generating",
    });

    try {
      const gen = await ctx.runQuery(internal.generations.getInternal, {
        id: generationId,
      });
      if (!gen) throw new Error("Generation not found");

      if (gen.type === "text-to-image") {
        const fullPrompt = gen.style
          ? `${gen.prompt}, ${gen.style} style, high quality, detailed`
          : `${gen.prompt}, high quality, detailed`;

        const result = await callViktorTool<{ response_text: string }>("text2im", {
          prompt: fullPrompt,
          aspect_ratio: gen.aspectRatio ?? "1:1",
        });

        const imageUrl = extractUrl(result.response_text);
        if (!imageUrl) {
          throw new Error("No image URL found in response");
        }

        await ctx.runMutation(internal.generations.updateStatus, {
          id: generationId,
          status: "done",
          resultUrl: imageUrl,
        });
      } else if (gen.type === "text-to-video") {
        // Video generation handled by external pipeline processor.
        // Reset to queued so the pipeline picks it up.
        await ctx.runMutation(internal.generations.updateStatus, {
          id: generationId,
          status: "queued",
        });
      } else {
        throw new Error(`Generation type "${gen.type}" is not yet supported`);
      }
    } catch (err) {
      await ctx.runMutation(internal.generations.updateStatus, {
        id: generationId,
        status: "failed",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },
});

export const getInternal = internalQuery({
  args: { id: v.id("generations") },
  returns: v.union(genObject, v.null()),
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
