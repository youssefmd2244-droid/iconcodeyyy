import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Clock,
  Cpu,
  Image,
  Sparkles,
  Video,
  Wand2,
  Zap,
  RefreshCw,
  Download,
  X,
  Play,
  ChevronDown,
  Layers,
  Settings,
  FileArchive,
  AlertTriangle,
  Check,
  Timer,
  Rocket,
  Eye,
  Share2,
  Calendar,
  TrendingUp,
  Plus,
  Trash2,
  Link2,
  Globe,
  Send,
  BarChart3,
  Target,
  Bot,
  Lightbulb,
  Users,
  Shield,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */
type NeonColor = "neon-cyan" | "neon-magenta" | "neon-purple" | "neon-green" | "neon-orange" | "neon-yellow";

const BORDER_COLORS: Record<NeonColor, string> = {
  "neon-cyan": "border-neon-cyan/15 hover:border-neon-cyan/30",
  "neon-magenta": "border-neon-magenta/15 hover:border-neon-magenta/30",
  "neon-purple": "border-neon-purple/15 hover:border-neon-purple/30",
  "neon-green": "border-neon-green/15 hover:border-neon-green/30",
  "neon-orange": "border-neon-orange/15 hover:border-neon-orange/30",
  "neon-yellow": "border-neon-yellow/15 hover:border-neon-yellow/30",
};
const TEXT_COLORS: Record<NeonColor, string> = {
  "neon-cyan": "text-neon-cyan",
  "neon-magenta": "text-neon-magenta",
  "neon-purple": "text-neon-purple",
  "neon-green": "text-neon-green",
  "neon-orange": "text-neon-orange",
  "neon-yellow": "text-neon-yellow",
};

const VIDEO_MODELS = [
  { id: "seedance-2.0", name: "Seedance 2.0", speed: "~2 min", tag: "Default", color: "neon-cyan" as NeonColor, supports_img: true },
  { id: "kling-video-v3-pro", name: "Kling V3 Pro", speed: "~2 min", tag: "Pro", color: "neon-magenta" as NeonColor, supports_img: true },
  { id: "kling-video-v3-standard", name: "Kling V3 Standard", speed: "~1 min", tag: "Fast", color: "neon-green" as NeonColor, supports_img: true },
  { id: "sora-2-pro", name: "Sora 2 Pro", speed: "~3 min", tag: "OpenAI", color: "neon-purple" as NeonColor, supports_img: true },
  { id: "veo-3.1-audio", name: "Veo 3.1 Audio", speed: "~2 min", tag: "🔊 Audio", color: "neon-orange" as NeonColor, supports_img: false },
  { id: "veo-3.1-fast-audio", name: "Veo 3.1 Fast", speed: "~1 min", tag: "🔊 Fast", color: "neon-yellow" as NeonColor, supports_img: false },
  { id: "veo-3.1-audio-1080p", name: "Veo 3.1 1080p", speed: "~3 min", tag: "🔊 HD", color: "neon-cyan" as NeonColor, supports_img: false },
  { id: "veo-3.1-fast-audio-1080p", name: "Veo 3.1 Fast 1080p", speed: "~2 min", tag: "🔊 Fast HD", color: "neon-green" as NeonColor, supports_img: false },
  { id: "grok-imagine-video-720p", name: "Grok Video 720p", speed: "~1 min", tag: "xAI", color: "neon-magenta" as NeonColor, supports_img: false },
  { id: "grok-imagine-video-480p", name: "Grok Video 480p", speed: "~30s", tag: "xAI Fast", color: "neon-yellow" as NeonColor, supports_img: false },
];

const IMAGE_MODELS = [
  { id: "gpt-image-2", name: "GPT Image 2", speed: "~10s", tag: "⭐ Best", color: "neon-magenta" as NeonColor },
  { id: "gpt-image-2-hd", name: "GPT Image 2 HD", speed: "~15s", tag: "HD", color: "neon-cyan" as NeonColor },
  { id: "flux-pro", name: "Flux Pro", speed: "~8s", tag: "Fast", color: "neon-green" as NeonColor },
  { id: "flux-schnell", name: "Flux Schnell", speed: "~3s", tag: "⚡ Fastest", color: "neon-yellow" as NeonColor },
  { id: "stable-diffusion-xl", name: "Stable Diffusion XL", speed: "~10s", tag: "SDXL", color: "neon-orange" as NeonColor },
  { id: "ideogram-v2", name: "Ideogram V2", speed: "~12s", tag: "Text+Art", color: "neon-purple" as NeonColor },
];

const SOCIAL_PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: "📘", color: "#1877F2" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "#E4405F" },
  { id: "youtube", name: "YouTube", icon: "▶️", color: "#FF0000" },
  { id: "youtube-shorts", name: "YouTube Shorts", icon: "🎬", color: "#FF0000" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "#000000" },
  { id: "kwai", name: "Kwai", icon: "🟠", color: "#FF6600" },
  { id: "x", name: "X (Twitter)", icon: "𝕏", color: "#000000" },
  { id: "snapchat", name: "Snapchat", icon: "👻", color: "#FFFC00" },
  { id: "whatsapp", name: "WhatsApp Channel", icon: "💬", color: "#25D366" },
  { id: "telegram", name: "Telegram Channel", icon: "✈️", color: "#0088CC" },
];

const OPTIMAL_TIMES: Record<string, string[]> = {
  facebook: ["09:00", "13:00", "16:00"],
  instagram: ["07:00", "12:00", "17:00", "21:00"],
  youtube: ["14:00", "17:00", "20:00"],
  "youtube-shorts": ["12:00", "17:00", "21:00"],
  tiktok: ["10:00", "14:00", "19:00", "22:00"],
  kwai: ["12:00", "18:00", "21:00"],
  x: ["08:00", "12:00", "17:00"],
  snapchat: ["10:00", "13:00", "20:00"],
  whatsapp: ["09:00", "14:00", "19:00"],
  telegram: ["10:00", "15:00", "20:00"],
};

const NICHES = [
  "🤣 Comedy / Funny", "👻 Horror", "🎮 Gaming", "💰 Finance", "📚 Education",
  "🍳 Cooking", "💪 Fitness", "🎨 Art & Design", "🐱 Animals / Pets", "🧠 AI & Tech",
  "✈️ Travel", "🎵 Music", "💄 Beauty", "📱 Tech Reviews", "🏠 Home & DIY",
  "🚗 Cars", "⚽ Sports", "🌟 Motivation", "👶 Parenting", "🎥 Cinema",
];

const TEMPLATES = [
  { name: "🎬 Cinematic Landscape", prompt: "Cinematic aerial drone shot of a stunning mountain landscape at golden hour, volumetric fog, lens flare, 4K", type: "text-to-video" as const, style: "Cinematic" },
  { name: "🌊 Ocean Waves", prompt: "Slow motion waves crashing on volcanic black sand beach, crystal clear turquoise water, cinematic lighting", type: "text-to-video" as const, style: "Cinematic" },
  { name: "🏙️ Cyberpunk City", prompt: "Neon-lit cyberpunk city street at night with rain reflections, flying cars, holographic billboards, blade runner style", type: "text-to-video" as const, style: "Cinematic" },
  { name: "🎨 Digital Portrait", prompt: "Beautiful portrait of a young woman with flowing hair, digital art style, vibrant colors, detailed eyes, studio lighting", type: "text-to-image" as const, style: "Digital Art" },
  { name: "🌌 Space Nebula", prompt: "Deep space nebula with swirling cosmic clouds in purple and blue, stars twinkling, James Webb telescope style", type: "text-to-image" as const, style: "Photorealistic" },
  { name: "🐱 Cute Cat", prompt: "Adorable fluffy kitten playing with a ball of yarn, soft studio lighting, bokeh background, photorealistic", type: "text-to-image" as const, style: "Photorealistic" },
  { name: "🏛️ Ancient Temple", prompt: "Ancient temple ruins in a mystical jungle, sunlight filtering through leaves, moss-covered stones, cinematic", type: "text-to-video" as const, style: "Cinematic" },
  { name: "🤖 Robot Sci-Fi", prompt: "Futuristic humanoid robot in a high-tech laboratory, LED lights, holographic screens, sci-fi atmosphere", type: "text-to-image" as const, style: "Digital Art" },
  { name: "🌸 Cherry Blossom", prompt: "Cherry blossom petals falling in slow motion over a peaceful Japanese garden with a koi pond, spring morning light", type: "text-to-video" as const, style: "Cinematic" },
  { name: "🔥 Fire Phoenix", prompt: "Majestic fire phoenix rising from flames with wings spread wide, ember particles floating, dark background, epic", type: "text-to-image" as const, style: "Digital Art" },
];

/* ═══════════════════════════════════════════════════════════════════
   WIDGET WRAPPER
   ═══════════════════════════════════════════════════════════════════ */
function HexWidget({
  title,
  icon: Icon,
  color = "neon-cyan",
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  color?: NeonColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-holographic rounded-2xl border ${BORDER_COLORS[color]} transition-colors duration-300 ${className}`}>
      <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
        <Icon className={`size-4 ${TEXT_COLORS[color]}`} />
        <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">{title}</span>
        <div className="flex-1" />
        <div className={`w-1.5 h-1.5 rounded-full ${TEXT_COLORS[color]}`} style={{ boxShadow: "0 0 6px currentColor" }} />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MEDIA PREVIEW MODAL
   ═══════════════════════════════════════════════════════════════════ */
function MediaModal({
  url,
  type,
  prompt,
  onClose,
}: {
  url: string;
  type: string;
  prompt: string;
  onClose: () => void;
}) {
  const handleDownload = useCallback(async () => {
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const ext = type === "text-to-video" ? "mp4" : "png";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `generation_${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(url, "_blank");
    }
  }, [url, type]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10">
          <X className="size-5" />
        </button>
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
          {type === "text-to-video" ? (
            <video src={url} controls autoPlay className="w-full max-h-[70vh] object-contain" />
          ) : (
            <img src={url} alt={prompt} className="w-full max-h-[70vh] object-contain" />
          )}
        </div>
        <div className="w-full mt-3 flex items-center gap-3 justify-between">
          <p className="text-sm text-white/70 truncate flex-1">{prompt}</p>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => window.open(url, "_blank")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-colors">
              <Eye className="size-4" /> View Full
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan text-sm font-medium transition-colors">
              <Download className="size-4" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SIDEBAR NAV
   ═══════════════════════════════════════════════════════════════════ */
type TabKey = "generate" | "auto-content" | "social" | "publish" | "gallery" | "templates" | "analytics" | "settings";

const TABS: { key: TabKey; label: string; labelAr: string; icon: React.ElementType; color: NeonColor }[] = [
  { key: "generate", label: "Generate", labelAr: "توليد", icon: Sparkles, color: "neon-cyan" },
  { key: "auto-content", label: "Auto Content", labelAr: "محتوى تلقائي", icon: Bot, color: "neon-magenta" },
  { key: "social", label: "Social Accounts", labelAr: "حسابات", icon: Share2, color: "neon-purple" },
  { key: "publish", label: "Auto Publish", labelAr: "نشر تلقائي", icon: Send, color: "neon-green" },
  { key: "gallery", label: "Gallery", labelAr: "المعرض", icon: Image, color: "neon-orange" },
  { key: "templates", label: "Templates", labelAr: "قوالب", icon: Layers, color: "neon-yellow" },
  { key: "analytics", label: "Analytics", labelAr: "تحليلات", icon: BarChart3, color: "neon-cyan" },
  { key: "settings", label: "Settings", labelAr: "إعدادات", icon: Settings, color: "neon-purple" },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("generate");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Generation state
  const [genPrompt, setGenPrompt] = useState("");
  const [genType, setGenType] = useState<"text-to-image" | "text-to-video" | "image-upscale" | "style-transfer">("text-to-image");
  const [genModel, setGenModel] = useState("seedance-2.0");
  const [genDuration, setGenDuration] = useState(5);
  const [genStyle, setGenStyle] = useState<string | null>(null);
  const [genAspect, setGenAspect] = useState("16:9");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ file: File; preview: string } | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [genImageModel, setGenImageModel] = useState("gpt-image-2");
  const [showImageModelPicker, setShowImageModelPicker] = useState(false);

  // Media preview
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: string; prompt: string } | null>(null);

  // Success notification
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Social accounts
  const [addPlatform, setAddPlatform] = useState<string | null>(null);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountUrl, setNewAccountUrl] = useState("");

  // Auto content
  const [selectedNiche, setSelectedNiche] = useState("");
  const [contentStyle, setContentStyle] = useState("Cinematic");
  const [videosPerDay, setVideosPerDay] = useState(10);

  // Convex queries
  const createGeneration = useMutation(api.generations.create);
  const generateUploadUrl = useMutation(api.generations.generateUploadUrl);
  const retryFailedGen = useMutation(api.generations.retryFailed);
  const deleteGen = useMutation(api.generations.deleteGeneration);
  const cancelGen = useMutation(api.generations.cancelGeneration);
  const generations = useQuery(api.generations.list, { limit: 50 });
  const genStats = useQuery(api.generations.stats);

  const socialAccounts = useQuery(api.social.listAccounts);
  const addSocialAccount = useMutation(api.social.addAccount);
  const updateSocialAccount = useMutation(api.social.updateAccount);
  const deleteSocialAccount = useMutation(api.social.deleteAccount);

  const scheduledPosts = useQuery(api.social.listScheduled, { limit: 30 });
  const schedStats = useQuery(api.social.scheduledStats);
  const createScheduledPost = useMutation(api.social.createScheduledPost);
  const deleteScheduledPost = useMutation(api.social.deleteScheduledPost);

  const contentPlans = useQuery(api.social.listPlans);
  const createPlan = useMutation(api.social.createPlan);
  const updatePlan = useMutation(api.social.updatePlan);
  const deletePlan = useMutation(api.social.deletePlan);

  // Auto-clear success
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedImage({ file, preview: URL.createObjectURL(file) });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!genPrompt.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      let inputImageStorageId: string | undefined;
      if (uploadedImage) {
        setUploadingImage(true);
        const uploadUrl = await generateUploadUrl({});
        const resp = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": uploadedImage.file.type },
          body: uploadedImage.file,
        });
        const { storageId } = await resp.json();
        inputImageStorageId = storageId;
        setUploadingImage(false);
      }
      await createGeneration({
        prompt: genPrompt.trim(),
        type: genType,
        model: genType === "text-to-video" ? genModel : genImageModel,
        duration: genType === "text-to-video" ? genDuration : undefined,
        style: genStyle ?? undefined,
        aspectRatio: genAspect,
        inputImageStorageId: inputImageStorageId as any,
      });
      setSuccessMsg(genType === "text-to-video" ? "🎬 Video queued!" : "🖼️ Image queued!");
      setGenPrompt("");
      setUploadedImage(null);
    } catch (err) {
      console.error("Generation failed:", err);
      setSuccessMsg("❌ Failed — try again");
    } finally {
      setIsSubmitting(false);
      setUploadingImage(false);
    }
  }, [genPrompt, isSubmitting, uploadedImage, genType, genModel, genImageModel, genDuration, genStyle, genAspect, createGeneration, generateUploadUrl]);

  const handleAddSocialAccount = useCallback(async () => {
    if (!addPlatform || !newAccountName.trim()) return;
    await addSocialAccount({
      platform: addPlatform,
      accountName: newAccountName.trim(),
      profileUrl: newAccountUrl.trim() || undefined,
      postsPerDay: 10,
    });
    setAddPlatform(null);
    setNewAccountName("");
    setNewAccountUrl("");
    setSuccessMsg("✅ Account connected!");
  }, [addPlatform, newAccountName, newAccountUrl, addSocialAccount]);

  const handleCreatePlan = useCallback(async () => {
    if (!selectedNiche) return;
    const platforms = socialAccounts?.filter(a => a.isConnected).map(a => a.platform) ?? [];
    await createPlan({
      niche: selectedNiche,
      style: contentStyle,
      platforms: platforms.length > 0 ? platforms : ["tiktok", "youtube-shorts", "instagram"],
      videosPerDay,
    });
    setSuccessMsg("🚀 Content plan created!");
  }, [selectedNiche, contentStyle, videosPerDay, socialAccounts, createPlan]);

  // Derived
  const completedGenerations = generations?.filter(g => g.status === "done" && g.resultUrl) ?? [];
  void (generations?.filter(g => g.status === "generating" || g.status === "queued").length ?? 0);
  const selectedVideoModel = VIDEO_MODELS.find(m => m.id === genModel) ?? VIDEO_MODELS[0];
  const selectedImageModel = IMAGE_MODELS.find(m => m.id === genImageModel) ?? IMAGE_MODELS[0];
  const connectedAccounts = socialAccounts?.filter(a => a.isConnected) ?? [];

  return (
    <div className="flex h-screen overflow-hidden" translate="no">
      {/* Preview Modal */}
      {previewMedia && (
        <MediaModal url={previewMedia.url} type={previewMedia.type} prompt={previewMedia.prompt} onClose={() => setPreviewMedia(null)} />
      )}

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-4 right-4 z-[9998] px-4 py-3 rounded-xl bg-neon-green/15 border border-neon-green/30 text-neon-green text-sm font-medium backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
          {successMsg}
        </div>
      )}

      {/* ═══ SIDEBAR ═══ */}
      <div className={`${sidebarOpen ? "w-56" : "w-16"} shrink-0 border-r border-white/5 bg-[#060610] flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Logo */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-magenta flex items-center justify-center shrink-0">
              <Zap className="size-4 text-white" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-sm font-bold gradient-text whitespace-nowrap">Icon Code Y</div>
                <div className="text-[10px] text-muted-foreground whitespace-nowrap">AI Content Factory</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {TABS.map(({ key, label, labelAr, icon: Ic, color }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === key
                  ? `bg-white/[0.06] ${TEXT_COLORS[color]} border border-white/10`
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent"
              }`}
            >
              <Ic className="size-4 shrink-0" />
              {sidebarOpen && (
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="whitespace-nowrap">{label}</span>
                  <span className="text-[9px] opacity-50 whitespace-nowrap">{labelAr}</span>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Status */}
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green shrink-0" />
            {sidebarOpen && <span className="text-[10px] text-neon-green/70 whitespace-nowrap">AI Engine Online</span>}
          </div>
          {sidebarOpen && (
            <div className="text-[10px] text-muted-foreground mt-1 whitespace-nowrap">{VIDEO_MODELS.length + IMAGE_MODELS.length} Models Active</div>
          )}
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {TABS.find(t => t.key === activeTab)?.label}
                <span className="text-muted-foreground ml-2 text-sm font-normal">{TABS.find(t => t.key === activeTab)?.labelAr}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5">
                <Wifi className="size-3 text-neon-green" />
                <span>{connectedAccounts.length} accounts</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5">
                <Sparkles className="size-3 text-neon-cyan" />
                <span>{genStats?.total ?? 0} generations</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Total Generated", value: genStats?.total ?? 0, color: "text-neon-cyan", icon: Sparkles },
              { label: "Complete", value: genStats?.done ?? 0, color: "text-neon-green", icon: Check },
              { label: "In Progress", value: (genStats?.generating ?? 0) + (genStats?.queued ?? 0), color: "text-neon-magenta", icon: RefreshCw },
              { label: "Accounts", value: connectedAccounts.length, color: "text-neon-purple", icon: Users },
              { label: "Scheduled", value: schedStats?.scheduled ?? 0, color: "text-neon-orange", icon: Calendar },
            ].map(({ label, value, color, icon: Ic }) => (
              <div key={label} className="card-holographic rounded-xl p-3 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Ic className={`size-3.5 ${color}`} />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
              </div>
            ))}
          </div>

          {/* ═══════════════ GENERATE TAB ═══════════════ */}
          {activeTab === "generate" && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <HexWidget title="Create Content" icon={Wand2} color="neon-cyan">
                  <div className="space-y-4">
                    {/* Content Type */}
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { label: "Text → Image", value: "text-to-image" as const, icon: Image, color: "neon-magenta" as NeonColor },
                        { label: "Text → Video", value: "text-to-video" as const, icon: Video, color: "neon-cyan" as NeonColor },
                      ]).map(({ label, value, icon: Ic, color }) => (
                        <button
                          key={value}
                          onClick={() => { setGenType(value); if (value === "text-to-image") setGenAspect("1:1"); else setGenAspect("16:9"); }}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-colors text-sm ${genType === value ? `${BORDER_COLORS[color]} bg-white/[0.06]` : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"}`}
                        >
                          <Ic className={`size-4 ${genType === value ? TEXT_COLORS[color] : "text-muted-foreground"}`} />
                          <span className={`text-xs font-medium ${genType === value ? TEXT_COLORS[color] : ""}`}>{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Model Selector (video) */}
                    {genType === "text-to-video" && (
                      <div className="relative">
                        <label className="text-xs text-muted-foreground mb-1.5 block">Video Model</label>
                        <button onClick={() => setShowModelPicker(!showModelPicker)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors text-left">
                          <Cpu className={`size-4 ${TEXT_COLORS[selectedVideoModel.color]}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{selectedVideoModel.name}</div>
                            <div className="text-[10px] text-muted-foreground">{selectedVideoModel.speed}</div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${TEXT_COLORS[selectedVideoModel.color]}`}>{selectedVideoModel.tag}</span>
                          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
                        </button>
                        {showModelPicker && (
                          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#0a0a12] border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                            {VIDEO_MODELS.map((m) => (
                              <button key={m.id} onClick={() => { setGenModel(m.id); setShowModelPicker(false); }} className={`w-full flex items-center gap-3 p-3 hover:bg-white/[0.05] transition-colors text-left ${genModel === m.id ? "bg-white/[0.04]" : ""}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${genModel === m.id ? "bg-neon-green" : "bg-white/20"}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">{m.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{m.speed} {m.supports_img ? "· 📷 Image-to-Video" : ""}</div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${TEXT_COLORS[m.color]}`}>{m.tag}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Model Selector (image) */}
                    {genType === "text-to-image" && (
                      <div className="relative">
                        <label className="text-xs text-muted-foreground mb-1.5 block">🎨 Image Model</label>
                        <button onClick={() => setShowImageModelPicker(!showImageModelPicker)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors text-left">
                          <Cpu className={`size-4 ${TEXT_COLORS[selectedImageModel.color]}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">{selectedImageModel.name}</div>
                            <div className="text-[10px] text-muted-foreground">{selectedImageModel.speed}</div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${TEXT_COLORS[selectedImageModel.color]}`}>{selectedImageModel.tag}</span>
                          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showImageModelPicker ? "rotate-180" : ""}`} />
                        </button>
                        {showImageModelPicker && (
                          <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-[#0a0a12] border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                            {IMAGE_MODELS.map((m) => (
                              <button key={m.id} onClick={() => { setGenImageModel(m.id); setShowImageModelPicker(false); }} className={`w-full flex items-center gap-3 p-3 hover:bg-white/[0.05] transition-colors text-left ${genImageModel === m.id ? "bg-white/[0.04]" : ""}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${genImageModel === m.id ? "bg-neon-green" : "bg-white/20"}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">{m.name}</div>
                                  <div className="text-[10px] text-muted-foreground">{m.speed}</div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${TEXT_COLORS[m.color]}`}>{m.tag}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Duration (video) */}
                    {genType === "text-to-video" && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2">
                          <Timer className="size-3" /> Duration: <span className="text-neon-cyan font-bold">{genDuration}s</span>
                        </label>
                        <input type="range" min={5} max={60} step={5} value={genDuration} onChange={(e) => setGenDuration(Number(e.target.value))} className="w-full accent-neon-cyan h-2 rounded-full appearance-none bg-white/10 cursor-pointer" />
                        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                          <span>5s</span><span>15s</span><span>30s</span><span>45s</span><span>60s</span>
                        </div>
                      </div>
                    )}

                    {/* Style */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Style</label>
                      <div className="flex flex-wrap gap-1.5">
                        {["Photorealistic", "Cinematic", "Anime", "Horror", "Oil Painting", "Digital Art", "Sketch", "3D Render", "Watercolor"].map((s) => (
                          <button key={s} onClick={() => setGenStyle(genStyle === s ? null : s)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${genStyle === s ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Image upload from device */}
                    {(genType === "text-to-video" || genType === "text-to-image") && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">📷 Upload Image / Photo from Device (optional — for Image-to-Video)</label>
                        <div className="flex items-center gap-3">
                          <label className="flex-1 cursor-pointer">
                            <div className={`flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed transition-colors ${uploadedImage ? "border-neon-green/40 bg-neon-green/5" : "border-white/15 bg-white/[0.02] hover:border-neon-cyan/30"}`}>
                              {uploadedImage ? (
                                <div className="flex items-center gap-2">
                                  <img src={uploadedImage.preview} alt="" className="size-10 object-cover rounded-lg" />
                                  <span className="text-xs text-neon-green truncate max-w-[150px]">{uploadedImage.file.name}</span>
                                </div>
                              ) : (
                                <>
                                  <Image className="size-4 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Upload image</span>
                                </>
                              )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          </label>
                          {uploadedImage && (
                            <button onClick={() => setUploadedImage(null)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1">✕</button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Prompt */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Prompt</label>
                      <textarea
                        value={genPrompt}
                        onChange={(e) => setGenPrompt(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                        className="w-full h-24 bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-neon-cyan/40 transition-colors"
                        placeholder={genType === "text-to-video" ? "Describe the video..." : "Describe the image..."}
                      />
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Aspect Ratio</label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {[{ label: "1:1", desc: "Square" }, { label: "16:9", desc: "Landscape" }, { label: "9:16", desc: "Portrait" }, { label: "4:3", desc: "Classic" }].map(({ label, desc }) => (
                          <button key={label} onClick={() => setGenAspect(label)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${genAspect === label ? "border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta" : "border-white/10 bg-white/[0.02] hover:bg-neon-magenta/10"}`}>
                            {label} <span className="text-muted-foreground ml-1">{desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate button */}
                    <Button onClick={handleGenerate} disabled={!genPrompt.trim() || isSubmitting} className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta text-background hover:opacity-90 font-bold h-12 disabled:opacity-50 text-sm">
                      {isSubmitting ? (
                        <><RefreshCw className="size-4 mr-2 animate-spin" /> {uploadingImage ? "Uploading…" : "Submitting…"}</>
                      ) : (
                        <><Rocket className="size-4 mr-2" /> Generate {genType === "text-to-video" ? "Video" : "Image"}</>
                      )}
                    </Button>
                  </div>
                </HexWidget>
              </div>

              {/* Queue */}
              <HexWidget title="Queue" icon={Clock} color="neon-purple">
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {(!generations || generations.length === 0) ? (
                    <div className="text-center py-8">
                      <Sparkles className="size-8 text-neon-cyan/30 mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">No generations yet</div>
                    </div>
                  ) : (
                    generations.slice(0, 15).map((gen) => {
                      const timeAgo = Math.round((Date.now() - gen.createdAt) / 60000);
                      const timeLabel = timeAgo < 1 ? "now" : timeAgo < 60 ? `${timeAgo}m` : `${Math.round(timeAgo / 60)}h`;
                      const isFailed = gen.status === "failed";
                      const isDone = gen.status === "done";
                      const isProcessing = gen.status === "generating" || gen.status === "queued";
                      const hasResult = isDone && gen.resultUrl;
                      return (
                        <div key={gen._id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${isFailed ? "bg-red-500/5 border border-red-500/15" : isProcessing ? "bg-neon-cyan/5 border border-neon-cyan/10" : hasResult ? "hover:bg-white/[0.04] cursor-pointer border border-transparent" : "border border-white/5"}`}
                          onClick={() => hasResult && setPreviewMedia({ url: gen.resultUrl!, type: gen.type, prompt: gen.prompt })}>
                          <div className="size-9 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center shrink-0 overflow-hidden">
                            {hasResult ? (
                              gen.type === "text-to-video" ? <Play className="size-4 text-neon-green" /> : <img src={gen.resultUrl!} alt="" className="size-9 object-cover rounded-lg" loading="lazy" />
                            ) : isProcessing ? (
                              <RefreshCw className="size-4 text-neon-cyan animate-spin" />
                            ) : isFailed ? (
                              <AlertTriangle className="size-4 text-red-400" />
                            ) : (
                              <Sparkles className="size-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-medium truncate">{gen.prompt}</div>
                            <div className="text-[10px] text-muted-foreground">{gen.model ?? gen.type} · {timeLabel}</div>
                            {isFailed && gen.error && (
                              <div className="text-[10px] text-red-400 truncate mt-0.5">❌ {gen.error}</div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {isProcessing && (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); cancelGen({ id: gen._id }); setSuccessMsg("⏹ Cancelled"); }} className="text-[10px] px-2 py-1 rounded-full bg-neon-orange/10 text-neon-orange hover:bg-neon-orange/20 transition-colors" title="Stop/Cancel">
                                  ⏹ Stop
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteGen({ id: gen._id }); }} className="text-[10px] px-1.5 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Delete">
                                  <Trash2 className="size-3" />
                                </button>
                              </>
                            )}
                            {isFailed && (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); retryFailedGen({ id: gen._id }); setSuccessMsg("🔄 Retrying..."); }} className="text-[10px] px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 transition-colors">
                                  🔄 Retry
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); deleteGen({ id: gen._id }); }} className="text-[10px] px-1.5 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                  <Trash2 className="size-3" />
                                </button>
                              </>
                            )}
                            {isDone && !gen.resultUrl && (
                              <button onClick={(e) => { e.stopPropagation(); deleteGen({ id: gen._id }); }} className="text-[10px] px-1.5 py-1 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Remove broken entry">
                                <Trash2 className="size-3" />
                              </button>
                            )}
                            {isDone && gen.resultUrl && (
                              <button onClick={(e) => { e.stopPropagation(); deleteGen({ id: gen._id }); }} className="text-[10px] px-1.5 py-1 rounded-full bg-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 transition-colors" title="Delete">
                                <Trash2 className="size-3" />
                              </button>
                            )}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDone && gen.resultUrl ? "bg-neon-green/10 text-neon-green" : isProcessing ? "bg-neon-cyan/10 text-neon-cyan" : isFailed ? "bg-red-500/10 text-red-400" : "bg-white/5 text-muted-foreground"}`}>
                              {isDone && gen.resultUrl ? "✓" : gen.status === "generating" ? "⚡" : gen.status === "queued" ? "⏳" : isFailed ? "✗" : "?"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </HexWidget>

              {/* Recent Results */}
              {completedGenerations.length > 0 && (
                <div className="md:col-span-3">
                  <HexWidget title="Recent Results — Click to Preview & Download" icon={Image} color="neon-green">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {completedGenerations.filter(g => !!g.resultUrl).slice(0, 10).map((gen) => (
                        <div key={gen._id} onClick={() => gen.resultUrl && setPreviewMedia({ url: gen.resultUrl, type: gen.type, prompt: gen.prompt })} className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-neon-cyan/30 transition-colors cursor-pointer">
                          {gen.type === "text-to-video" ? (
                            <div className="w-full aspect-video bg-black/50 relative">
                              <video src={gen.resultUrl!} preload="metadata" className="w-full aspect-video object-cover" muted />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                <Play className="size-8 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                              </div>
                            </div>
                          ) : (
                            <img src={gen.resultUrl!} alt={gen.prompt} className="w-full aspect-square object-cover" loading="lazy" />
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-white line-clamp-2">{gen.prompt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </HexWidget>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════ AUTO CONTENT TAB ═══════════════ */}
          {activeTab === "auto-content" && (
            <div className="grid md:grid-cols-2 gap-4">
              <HexWidget title="Create Content Plan" icon={Lightbulb} color="neon-magenta">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block font-semibold">Choose Your Niche</label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                      {NICHES.map(n => (
                        <button key={n} onClick={() => setSelectedNiche(n)} className={`text-xs px-3 py-2 rounded-lg border transition-colors text-left ${selectedNiche === n ? "border-neon-magenta/40 bg-neon-magenta/10 text-neon-magenta" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block">Content Style</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Cinematic", "Funny", "Horror", "Educational", "Motivational", "Aesthetic"].map(s => (
                        <button key={s} onClick={() => setContentStyle(s)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${contentStyle === s ? "border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan" : "border-white/10 bg-white/[0.02]"}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2">
                      <Video className="size-3" /> Videos Per Day: <span className="text-neon-cyan font-bold">{videosPerDay}</span>
                    </label>
                    <input type="range" min={1} max={20} value={videosPerDay} onChange={e => setVideosPerDay(Number(e.target.value))} className="w-full accent-neon-cyan h-2 rounded-full appearance-none bg-white/10 cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>1/day</span><span>5/day</span><span>10/day</span><span>15/day</span><span>20/day</span>
                    </div>
                  </div>

                  <Button onClick={handleCreatePlan} disabled={!selectedNiche} className="w-full bg-gradient-to-r from-neon-magenta to-neon-purple text-white hover:opacity-90 font-bold h-11 disabled:opacity-50">
                    <Bot className="size-4 mr-2" /> Create AI Content Plan
                  </Button>

                  <div className="text-xs text-neon-cyan/70 bg-neon-cyan/5 border border-neon-cyan/10 rounded-lg p-3">
                    <strong>🤖 How it works:</strong><br />
                    AI generates video ideas, prompts, captions, hashtags, and optimal posting times for your niche. Content is auto-generated and queued for publishing.
                  </div>
                </div>
              </HexWidget>

              <HexWidget title="Active Content Plans" icon={Target} color="neon-green">
                <div className="space-y-3">
                  {(!contentPlans || contentPlans.length === 0) ? (
                    <div className="text-center py-8">
                      <Bot className="size-10 text-muted-foreground/30 mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">No content plans yet.<br />Create one to start auto-generating!</div>
                    </div>
                  ) : (
                    contentPlans.map(plan => (
                      <div key={plan._id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-bold">{plan.niche}</div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${plan.isActive ? "bg-neon-green/10 text-neon-green" : "bg-white/5 text-muted-foreground"}`}>
                              {plan.isActive ? "● Active" : "○ Paused"}
                            </span>
                            <button onClick={() => updatePlan({ id: plan._id, isActive: !plan.isActive })} className="text-xs text-muted-foreground hover:text-white">
                              {plan.isActive ? "Pause" : "Resume"}
                            </button>
                            <button onClick={() => deletePlan({ id: plan._id })} className="text-xs text-red-400 hover:text-red-300">
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span>📹 {plan.videosPerDay}/day</span>
                          <span>🎨 {plan.style}</span>
                          <span>📱 {plan.platforms.length} platforms</span>
                          <span>🎯 {plan.totalGenerated} generated</span>
                        </div>
                        {plan.ideas && plan.ideas.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {plan.ideas.slice(0, 3).map((idea, i) => (
                              <div key={i} className="text-[11px] p-2 rounded-lg bg-white/[0.03] border border-white/5">
                                <div className="font-medium">{idea.title}</div>
                                <div className="text-muted-foreground truncate">{idea.prompt}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </HexWidget>

              {/* Auto Content Features */}
              <div className="md:col-span-2">
                <HexWidget title="AI Content Factory Features" icon={Zap} color="neon-cyan">
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { icon: "🧠", title: "AI Idea Generation", desc: "Generates unique video ideas based on your niche, trending topics, and viral patterns. No repetition." },
                      { icon: "🎬", title: "Auto Video Creation", desc: "Turns ideas into professional videos using 10+ AI models. Cinematic, funny, horror — any style." },
                      { icon: "✍️", title: "Smart Captions", desc: "AI writes engaging captions with hooks that grab attention in the first second." },
                      { icon: "#️⃣", title: "Viral Hashtags", desc: "Auto-generates trending hashtags optimized for maximum reach on each platform." },
                      { icon: "📊", title: "Trend Analysis", desc: "Studies current trends and viral patterns to make your content more discoverable." },
                      { icon: "📤", title: "Auto Publishing", desc: "Publishes to all connected accounts at optimal times. 10+ videos daily on autopilot." },
                    ].map(f => (
                      <div key={f.title} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div className="text-2xl mb-2">{f.icon}</div>
                        <div className="text-sm font-bold mb-1">{f.title}</div>
                        <div className="text-[11px] text-muted-foreground">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                </HexWidget>
              </div>
            </div>
          )}

          {/* ═══════════════ SOCIAL ACCOUNTS TAB ═══════════════ */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <HexWidget title="Connected Accounts" icon={Share2} color="neon-purple">
                <div className="space-y-3">
                  {(!socialAccounts || socialAccounts.length === 0) ? (
                    <div className="text-center py-6">
                      <Share2 className="size-10 text-muted-foreground/30 mx-auto mb-2" />
                      <div className="text-xs text-muted-foreground">No accounts connected yet.<br />Add your social media accounts below.</div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-3">
                      {socialAccounts.map(acc => {
                        const plat = SOCIAL_PLATFORMS.find(p => p.id === acc.platform);
                        return (
                          <div key={acc._id} className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                            <div className="text-2xl">{plat?.icon ?? "📱"}</div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold">{acc.accountName}</div>
                              <div className="text-[10px] text-muted-foreground">{plat?.name ?? acc.platform} · {acc.postsPerDay} posts/day</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => updateSocialAccount({ id: acc._id, autoPost: !acc.autoPost })}
                                className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${acc.autoPost ? "border-neon-green/30 bg-neon-green/10 text-neon-green" : "border-white/10 bg-white/5 text-muted-foreground"}`}
                              >
                                {acc.autoPost ? "● Auto" : "○ Manual"}
                              </button>
                              <button onClick={() => deleteSocialAccount({ id: acc._id })} className="text-red-400/60 hover:text-red-400 p-1">
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </HexWidget>

              <HexWidget title="Add Social Account" icon={Plus} color="neon-green">
                {addPlatform ? (
                  <div className="space-y-3 max-w-md">
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <span className="text-xl">{SOCIAL_PLATFORMS.find(p => p.id === addPlatform)?.icon}</span>
                      <span className="text-sm font-bold">{SOCIAL_PLATFORMS.find(p => p.id === addPlatform)?.name}</span>
                      <button onClick={() => setAddPlatform(null)} className="ml-auto text-xs text-muted-foreground hover:text-white">Change</button>
                    </div>
                    <input
                      value={newAccountName}
                      onChange={e => setNewAccountName(e.target.value)}
                      placeholder="Account name / username"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40"
                    />
                    <input
                      value={newAccountUrl}
                      onChange={e => setNewAccountUrl(e.target.value)}
                      placeholder="Profile URL (optional)"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddSocialAccount} disabled={!newAccountName.trim()} className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 font-bold flex-1">
                        <Link2 className="size-4 mr-2" /> Connect Account
                      </Button>
                      <Button onClick={() => setAddPlatform(null)} className="bg-white/5 text-muted-foreground hover:bg-white/10">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {SOCIAL_PLATFORMS.map(p => (
                      <button key={p.id} onClick={() => setAddPlatform(p.id)} className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-neon-cyan/20 transition-colors">
                        <span className="text-2xl">{p.icon}</span>
                        <span className="text-[10px] text-muted-foreground text-center">{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </HexWidget>

              {/* Optimal Posting Times */}
              <HexWidget title="📊 Optimal Posting Times (AI Analysis)" icon={Clock} color="neon-orange">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {SOCIAL_PLATFORMS.slice(0, 6).map(p => (
                    <div key={p.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="flex items-center gap-2 mb-2">
                        <span>{p.icon}</span>
                        <span className="text-xs font-bold">{p.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(OPTIMAL_TIMES[p.id] ?? ["12:00", "18:00"]).map(t => (
                          <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                            🕐 {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-[10px] text-muted-foreground bg-white/[0.02] rounded-lg p-2">
                  💡 Times are based on AI analysis of peak engagement hours for Arabic-speaking audiences. The system automatically schedules posts at these times.
                </div>
              </HexWidget>
            </div>
          )}

          {/* ═══════════════ AUTO PUBLISH TAB ═══════════════ */}
          {activeTab === "publish" && (
            <div className="space-y-4">
              {/* Publish Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Scheduled", value: schedStats?.scheduled ?? 0, color: "text-neon-cyan", icon: Calendar },
                  { label: "Posted", value: schedStats?.posted ?? 0, color: "text-neon-green", icon: Check },
                  { label: "Failed", value: schedStats?.failed ?? 0, color: "text-red-400", icon: AlertTriangle },
                  { label: "Total", value: schedStats?.total ?? 0, color: "text-neon-purple", icon: BarChart3 },
                ].map(({ label, value, color, icon: Ic }) => (
                  <div key={label} className="card-holographic rounded-xl p-3 border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Ic className={`size-3.5 ${color}`} />
                      <span className="text-[10px] text-muted-foreground">{label}</span>
                    </div>
                    <div className={`text-2xl font-bold ${color}`}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <HexWidget title="Quick Schedule Post" icon={Send} color="neon-green">
                  <div className="space-y-3">
                    {connectedAccounts.length === 0 ? (
                      <div className="text-center py-6">
                        <Share2 className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground mb-3">Connect social accounts first</div>
                        <Button onClick={() => setActiveTab("social")} className="bg-neon-purple/15 text-neon-purple hover:bg-neon-purple/25 text-xs">
                          <Plus className="size-3 mr-1" /> Add Accounts
                        </Button>
                      </div>
                    ) : completedGenerations.length === 0 ? (
                      <div className="text-center py-6">
                        <Sparkles className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground mb-3">Generate content first</div>
                        <Button onClick={() => setActiveTab("generate")} className="bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25 text-xs">
                          <Sparkles className="size-3 mr-1" /> Generate
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-muted-foreground">Select generated content and schedule it for auto-posting to your connected accounts.</div>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {completedGenerations.slice(0, 5).map(gen => (
                            <button
                              key={gen._id}
                              onClick={async () => {
                                for (const acc of connectedAccounts) {
                                  const optTimes = OPTIMAL_TIMES[acc.platform] ?? ["12:00"];
                                  const nextTime = optTimes[Math.floor(Math.random() * optTimes.length)];
                                  const [h, m] = nextTime.split(":").map(Number);
                                  const schedDate = new Date();
                                  schedDate.setHours(h, m, 0, 0);
                                  if (schedDate.getTime() < Date.now()) schedDate.setDate(schedDate.getDate() + 1);
                                  await createScheduledPost({
                                    generationId: gen._id,
                                    socialAccountId: acc._id,
                                    platform: acc.platform,
                                    caption: gen.prompt,
                                    hashtags: ["#AI", "#viral", "#trending", "#content", "#fyp"],
                                    mediaUrl: gen.resultUrl ?? undefined,
                                    mediaType: gen.type === "text-to-video" ? "video" : "image",
                                    scheduledAt: schedDate.getTime(),
                                  });
                                }
                                setSuccessMsg(`📤 Scheduled to ${connectedAccounts.length} accounts!`);
                              }}
                              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-neon-green/20 transition-colors text-left"
                            >
                              <div className="size-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center shrink-0 overflow-hidden">
                                {gen.type === "text-to-video" ? <Play className="size-4 text-neon-green" /> : <img src={gen.resultUrl!} alt="" className="size-10 object-cover rounded-lg" loading="lazy" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs truncate">{gen.prompt}</div>
                                <div className="text-[10px] text-muted-foreground">{gen.model ?? gen.type}</div>
                              </div>
                              <span className="text-[10px] text-neon-green shrink-0">📤 Schedule</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </HexWidget>

                <HexWidget title="Scheduled Queue" icon={Calendar} color="neon-purple">
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {(!scheduledPosts || scheduledPosts.length === 0) ? (
                      <div className="text-center py-8">
                        <Calendar className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                        <div className="text-xs text-muted-foreground">No scheduled posts yet</div>
                      </div>
                    ) : (
                      scheduledPosts.map(post => {
                        const plat = SOCIAL_PLATFORMS.find(p => p.id === post.platform);
                        return (
                          <div key={post._id} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                            <span className="text-lg">{plat?.icon ?? "📱"}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs truncate">{post.caption}</div>
                              <div className="text-[10px] text-muted-foreground">
                                {plat?.name} · {new Date(post.scheduledAt).toLocaleString()}
                              </div>
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${post.status === "posted" ? "bg-neon-green/10 text-neon-green" : post.status === "scheduled" ? "bg-neon-cyan/10 text-neon-cyan" : "bg-red-500/10 text-red-400"}`}>
                              {post.status}
                            </span>
                            {post.status === "scheduled" && (
                              <button onClick={() => deleteScheduledPost({ id: post._id })} className="text-red-400/50 hover:text-red-400">
                                <Trash2 className="size-3" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </HexWidget>
              </div>

              {/* Auto-publish features */}
              <HexWidget title="Auto-Publish System" icon={Rocket} color="neon-cyan">
                <div className="grid md:grid-cols-4 gap-3">
                  {[
                    { icon: "🕐", title: "Smart Scheduling", desc: "AI analyzes peak hours for each platform and schedules posts at optimal times" },
                    { icon: "#️⃣", title: "Auto Hashtags", desc: "Trending hashtags generated per platform for maximum reach" },
                    { icon: "📝", title: "AI Captions", desc: "Engaging captions with hooks written automatically for each post" },
                    { icon: "📤", title: "Multi-Platform", desc: "One click publishes to all connected accounts simultaneously" },
                  ].map(f => (
                    <div key={f.title} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="text-xl mb-2">{f.icon}</div>
                      <div className="text-xs font-bold mb-1">{f.title}</div>
                      <div className="text-[10px] text-muted-foreground">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </HexWidget>
            </div>
          )}

          {/* ═══════════════ GALLERY TAB ═══════════════ */}
          {activeTab === "gallery" && (
            <HexWidget title={`All Generated Content (${completedGenerations.length})`} icon={Image} color="neon-green">
              {completedGenerations.length === 0 ? (
                <div className="text-center py-12">
                  <Image className="size-12 text-muted-foreground/30 mx-auto mb-3" />
                  <div className="text-sm text-muted-foreground">No generated content yet.</div>
                  <Button onClick={() => setActiveTab("generate")} className="mt-3 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20 text-xs">Go to Generate</Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {completedGenerations.filter(g => !!g.resultUrl).map(gen => (
                    <div key={gen._id} onClick={() => gen.resultUrl && setPreviewMedia({ url: gen.resultUrl, type: gen.type, prompt: gen.prompt })} className="group relative rounded-xl overflow-hidden border border-white/5 hover:border-neon-cyan/30 transition-colors cursor-pointer">
                      {gen.type === "text-to-video" ? (
                        <div className="w-full aspect-video bg-black/50 relative">
                          <video src={gen.resultUrl!} preload="metadata" className="w-full aspect-video object-cover" muted />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                            <Play className="size-10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                          </div>
                        </div>
                      ) : (
                        <img src={gen.resultUrl!} alt={gen.prompt} className="w-full aspect-square object-cover" loading="lazy" />
                      )}
                      <div className="p-2 bg-white/[0.02]">
                        <div className="text-xs truncate">{gen.prompt}</div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-muted-foreground">{gen.model ?? gen.type}</span>
                          <span className="text-[10px] text-neon-green">{new Date(gen.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </HexWidget>
          )}

          {/* ═══════════════ TEMPLATES TAB ═══════════════ */}
          {activeTab === "templates" && (
            <div className="space-y-4">
              <HexWidget title="Ready-Made Templates" icon={Layers} color="neon-purple">
                <p className="text-xs text-muted-foreground mb-4">Click any template to load it into the generator.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TEMPLATES.map(tpl => (
                    <button key={tpl.name} onClick={() => { setGenPrompt(tpl.prompt); setGenType(tpl.type); if (tpl.style) setGenStyle(tpl.style); setActiveTab("generate"); }} className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-neon-cyan/20 transition-colors text-left">
                      <div className="text-2xl">{tpl.name.split(" ")[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium mb-1">{tpl.name.split(" ").slice(1).join(" ")}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">{tpl.prompt}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${tpl.type === "text-to-video" ? "bg-neon-cyan/10 text-neon-cyan" : "bg-neon-magenta/10 text-neon-magenta"}`}>
                            {tpl.type === "text-to-video" ? "🎬 Video" : "🖼️ Image"}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground">{tpl.style}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </HexWidget>

              <HexWidget title="Available AI Models" icon={Cpu} color="neon-cyan">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">🎬 Video Models ({VIDEO_MODELS.length})</div>
                    <div className="space-y-1.5">
                      {VIDEO_MODELS.map(m => (
                        <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                          <span className="text-xs flex-1 font-medium">{m.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${TEXT_COLORS[m.color]}`}>{m.tag}</span>
                          <span className="text-[10px] text-muted-foreground">{m.speed}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">🖼️ Image Models ({IMAGE_MODELS.length})</div>
                    {IMAGE_MODELS.map(m => (
                      <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02]">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                        <span className="text-xs flex-1 font-medium">{m.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-white/5 ${TEXT_COLORS[m.color]}`}>{m.tag}</span>
                      </div>
                    ))}
                    <div className="mt-4 p-3 rounded-xl bg-neon-green/5 border border-neon-green/10">
                      <div className="text-xs font-bold text-neon-green mb-1">✨ Features</div>
                      <ul className="text-[11px] text-muted-foreground space-y-1">
                        <li>• Image-to-Video with reference image</li>
                        <li>• Veo 3.1 models include AI audio</li>
                        <li>• Background generation — navigate freely</li>
                        <li>• Click results to preview & download</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </HexWidget>
            </div>
          )}

          {/* ═══════════════ ANALYTICS TAB ═══════════════ */}
          {activeTab === "analytics" && (
            <div className="grid md:grid-cols-2 gap-4">
              <HexWidget title="Generation Analytics" icon={BarChart3} color="neon-cyan">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-cyan">{genStats?.total ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Total Generations</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-green">{genStats?.done ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Successful</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-magenta">{genStats?.generating ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">In Progress</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-red-400">{genStats?.failed ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Failed</div>
                    </div>
                  </div>
                  {genStats && genStats.total > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">Success Rate</div>
                      <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <div className="bg-gradient-to-r from-neon-green to-neon-cyan h-full rounded-full transition-all" style={{ width: `${Math.round((genStats.done / genStats.total) * 100)}%` }} />
                      </div>
                      <div className="text-right text-xs text-neon-green mt-1">{Math.round((genStats.done / genStats.total) * 100)}%</div>
                    </div>
                  )}
                </div>
              </HexWidget>

              <HexWidget title="Publishing Analytics" icon={TrendingUp} color="neon-green">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-purple">{schedStats?.total ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Total Posts</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-green">{schedStats?.posted ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Published</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-cyan">{schedStats?.scheduled ?? 0}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Scheduled</div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                      <div className="text-3xl font-bold text-neon-orange">{connectedAccounts.length}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">Active Accounts</div>
                    </div>
                  </div>
                </div>
              </HexWidget>

              <HexWidget title="Viral Strategy Tips" icon={TrendingUp} color="neon-orange" className="md:col-span-2">
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    { icon: "🎯", title: "Hook in First 2 Seconds", desc: "Start with a surprising or emotional hook. 80% of viewers decide to stay or leave in the first 2 seconds." },
                    { icon: "📊", title: "Post 10+ Daily", desc: "More posts = more chances for the algorithm to push your content. Consistency beats quality at scale." },
                    { icon: "🕐", title: "Peak Hours Matter", desc: "Post when your audience is active. Our AI analyzes optimal times for each platform." },
                    { icon: "#️⃣", title: "Trending Hashtags", desc: "Mix trending and niche hashtags. Use 5-10 relevant tags per post for maximum discovery." },
                    { icon: "🔄", title: "Repost Winners", desc: "When a video performs well, create 5 variations. Double down on what works." },
                    { icon: "📱", title: "Multi-Platform", desc: "Same content, adapted for each platform. Reels, Shorts, TikTok, X — maximize reach." },
                  ].map(tip => (
                    <div key={tip.title} className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
                      <div className="text-xl mb-2">{tip.icon}</div>
                      <div className="text-xs font-bold mb-1">{tip.title}</div>
                      <div className="text-[10px] text-muted-foreground">{tip.desc}</div>
                    </div>
                  ))}
                </div>
              </HexWidget>
            </div>
          )}

          {/* ═══════════════ SETTINGS TAB ═══════════════ */}
          {activeTab === "settings" && (
            <div className="grid md:grid-cols-2 gap-4">
              <HexWidget title="App Info" icon={Settings} color="neon-cyan">
                <div className="space-y-3">
                  {[
                    { label: "App Name", value: "Icon Code Y" },
                    { label: "Version", value: "2.0 — AI Content Factory" },
                    { label: "Video Models", value: `${VIDEO_MODELS.length} models`, color: "text-neon-cyan" },
                    { label: "Image Models", value: `${IMAGE_MODELS.length} model`, color: "text-neon-magenta" },
                    { label: "Total Generations", value: String(genStats?.total ?? 0), color: "text-neon-green" },
                    { label: "Connected Accounts", value: String(connectedAccounts.length), color: "text-neon-purple" },
                    { label: "Developer", value: "Eng. Youssef Mohamed El-Sayed" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className={`text-xs font-bold ${color ?? ""}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </HexWidget>

              <HexWidget title="Download Source Code" icon={FileArchive} color="neon-green">
                <div className="text-center py-6">
                  <FileArchive className="size-12 text-neon-green/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">Download the complete source code as a ZIP file.</p>
                  <Button onClick={() => window.open("https://icon-code-y-56fad9ff.viktor.space/source.zip", "_blank")} className="bg-neon-green/15 text-neon-green hover:bg-neon-green/25 font-bold">
                    <Download className="size-4 mr-2" /> Download ZIP
                  </Button>
                  <p className="text-[10px] text-muted-foreground mt-3">Contact Viktor to generate the latest ZIP.</p>
                </div>
              </HexWidget>

              <HexWidget title="Security & Error Handling" icon={Shield} color="neon-orange" className="md:col-span-2">
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { icon: Check, title: "Chrome Translation Fix", desc: "Prevents auto-translation from breaking the app on Arabic devices.", color: "text-neon-green" },
                    { icon: Check, title: "Error Boundary", desc: "Friendly reload button appears instead of blank screen on crashes.", color: "text-neon-green" },
                    { icon: Check, title: "Background Generation", desc: "Generations run server-side. Navigate freely — nothing stops.", color: "text-neon-green" },
                    { icon: Check, title: "Auto Error Recovery", desc: "Failed generations show clear error messages with retry option.", color: "text-neon-green" },
                  ].map(({ icon: Ic, title, desc, color }) => (
                    <div key={title} className="flex items-start gap-3 p-3 rounded-xl bg-neon-green/5 border border-neon-green/10">
                      <Ic className={`size-4 ${color} mt-0.5 shrink-0`} />
                      <div>
                        <div className={`text-xs font-bold ${color}`}>{title}</div>
                        <div className="text-[10px] text-muted-foreground">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </HexWidget>
            </div>
          )}

          {/* Footer */}
          <div className="card-holographic rounded-2xl border border-white/5 p-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap justify-center">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/5 border border-neon-green/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                  <span className="text-neon-green/80">AI Engine Online</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-cyan/5 border border-neon-cyan/10">
                  <Cpu className="size-3 text-neon-cyan" />
                  <span className="text-neon-cyan/80">{VIDEO_MODELS.length + IMAGE_MODELS.length} Models</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-purple/5 border border-neon-purple/10">
                  <Globe className="size-3 text-neon-purple" />
                  <span className="text-neon-purple/80">10 Platforms</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center md:text-right">
                Developed by <strong className="text-foreground font-bold">Eng. Youssef Mohamed El-Sayed</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
