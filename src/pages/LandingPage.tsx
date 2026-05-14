// No auth required — instant access
import {
  ArrowRight,
  Bot,
  Brain,
  Camera,
  ChartBar,
  Clock,
  Cloud,
  Code2,
  Cpu,
  Database,
  Film,
  Ghost,
  Globe,
  Hash,
  HardDrive,
  Heart,
  Image,
  Infinity,
  Layers,
  MessageCircle,
  Monitor,
  Palette,
  Paintbrush,
  Play,
  Rocket,
  Server,
  Share2,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Video,
  Wand2,
  Zap,
  RefreshCw,
  Target,
  Timer,
  Scissors,
  Languages,
  Subtitles,
  Mic,
  Music,
  Maximize,
  ZoomIn,
  Workflow,
  BrainCircuit,
  Cog,
  RadioTower,
  Boxes,
  Gauge,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/* ═══════════════════════════════════════════════════════════════════
   BACKGROUND — Hex grid + floating elements
   ═══════════════════════════════════════════════════════════════════ */
function HexGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="hex-bg absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(0,240,255,0.08),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(123,47,255,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_20%_60%,rgba(255,0,170,0.04),transparent_50%)]" />

      {/* Floating hexagons */}
      <div className="absolute top-[15%] left-[10%] w-16 h-16 hexagon bg-neon-cyan/5 border border-neon-cyan/10" style={{ animation: "floatUp 6s ease-in-out infinite" }} />
      <div className="absolute top-[25%] right-[15%] w-24 h-24 hexagon bg-neon-purple/5 border border-neon-purple/10" style={{ animation: "floatUp 8s ease-in-out infinite 1s" }} />
      <div className="absolute bottom-[30%] left-[20%] w-20 h-20 hexagon bg-neon-magenta/5 border border-neon-magenta/10" style={{ animation: "floatUp 7s ease-in-out infinite 2s" }} />
      <div className="absolute top-[60%] right-[8%] w-12 h-12 hexagon bg-neon-green/5 border border-neon-green/10" style={{ animation: "floatUp 5s ease-in-out infinite 0.5s" }} />
      <div className="absolute bottom-[15%] right-[25%] w-14 h-14 hexagon bg-neon-cyan/5 border border-neon-cyan/10" style={{ animation: "floatUp 9s ease-in-out infinite 3s" }} />

      {/* Scanline */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.015]">
        <div className="absolute w-full h-40 bg-gradient-to-b from-transparent via-neon-cyan to-transparent" style={{ animation: "scanline 12s linear infinite" }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */
type NeonColor = "neon-cyan" | "neon-magenta" | "neon-purple" | "neon-green" | "neon-orange" | "neon-yellow";

const COLOR_MAP: Record<NeonColor, { border: string; bg: string; text: string; glow: string }> = {
  "neon-cyan": { border: "border-neon-cyan/20", bg: "bg-neon-cyan/10", text: "text-neon-cyan", glow: "group-hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]" },
  "neon-magenta": { border: "border-neon-magenta/20", bg: "bg-neon-magenta/10", text: "text-neon-magenta", glow: "group-hover:shadow-[0_0_30px_rgba(255,0,170,0.15)]" },
  "neon-purple": { border: "border-neon-purple/20", bg: "bg-neon-purple/10", text: "text-neon-purple", glow: "group-hover:shadow-[0_0_30px_rgba(123,47,255,0.15)]" },
  "neon-green": { border: "border-neon-green/20", bg: "bg-neon-green/10", text: "text-neon-green", glow: "group-hover:shadow-[0_0_30px_rgba(0,255,136,0.15)]" },
  "neon-orange": { border: "border-neon-orange/20", bg: "bg-neon-orange/10", text: "text-neon-orange", glow: "group-hover:shadow-[0_0_30px_rgba(255,107,0,0.15)]" },
  "neon-yellow": { border: "border-neon-yellow/20", bg: "bg-neon-yellow/10", text: "text-neon-yellow", glow: "group-hover:shadow-[0_0_30px_rgba(255,230,0,0.15)]" },
};

function FeatureCard({ icon: Icon, title, desc, color = "neon-cyan" }: { icon: React.ElementType; title: string; desc: string; color?: NeonColor }) {
  const c = COLOR_MAP[color];
  return (
    <div className={`group card-holographic rounded-2xl p-6 ${c.border} ${c.glow} transition-all duration-300`}>
      <div className={`inline-flex size-12 items-center justify-center rounded-xl ${c.bg} mb-4`}>
        <Icon className={`size-6 ${c.text}`} />
      </div>
      <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function PlatformBadge({ name, color }: { name: string; color: NeonColor }) {
  const c = COLOR_MAP[color];
  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${c.bg} ${c.border} border text-sm font-medium ${c.text}`}>
      <Globe className="size-3.5" />
      {name}
    </span>
  );
}

function SectionHeader({ badge, badgeColor = "neon-cyan", title, subtitle }: { badge: string; badgeColor?: NeonColor; title: string; subtitle: string }) {
  const c = COLOR_MAP[badgeColor];
  return (
    <div className="text-center mb-16">
      <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${c.bg} ${c.border} border text-sm font-medium ${c.text} mb-4`}>
        {badge}
      </span>
      <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{subtitle}</p>
    </div>
  );
}

function StatBox({ value, label, color = "text-neon-cyan" }: { value: string; label: string; color?: string }) {
  return (
    <div className="text-center p-4">
      <div className={`text-3xl md:text-4xl font-bold ${color} mb-1`} style={{ textShadow: "0 0 20px currentColor" }}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   GENRE CARDS — for Multi-Genre section
   ═══════════════════════════════════════════════════════════════════ */
function GenreCard({ icon: Icon, title, desc, tags, color = "neon-cyan" }: { icon: React.ElementType; title: string; desc: string; tags: string[]; color?: NeonColor }) {
  const c = COLOR_MAP[color];
  return (
    <div className={`group card-holographic rounded-2xl overflow-hidden ${c.border} ${c.glow} transition-all duration-300`}>
      {/* Top accent bar */}
      <div className={`h-1 ${c.bg}`} style={{ boxShadow: `0 0 20px currentColor` }} />
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`inline-flex size-14 items-center justify-center rounded-2xl ${c.bg} shrink-0`}>
            <Icon className={`size-7 ${c.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mt-1">{desc}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className={`text-xs px-2.5 py-1 rounded-full ${c.bg} ${c.text}/80 border ${c.border}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TECH STACK ITEM
   ═══════════════════════════════════════════════════════════════════ */
function TechItem({ icon: Icon, name, desc, color = "neon-cyan" }: { icon: React.ElementType; name: string; desc: string; color?: NeonColor }) {
  const c = COLOR_MAP[color];
  return (
    <div className="flex items-center gap-4 p-4 card-holographic rounded-xl border border-white/5">
      <div className={`inline-flex size-10 items-center justify-center rounded-lg ${c.bg} shrink-0`}>
        <Icon className={`size-5 ${c.text}`} />
      </div>
      <div>
        <div className="font-semibold text-sm text-foreground">{name}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  // Instant access — no login required

  return (
    <div className="min-h-screen bg-background relative">
      <HexGrid />

      {/* ────────────────── NAV ────────────────── */}
      <nav className="relative z-20 border-b border-white/5 glass-panel">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="size-9 hexagon bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
              <Zap className="size-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-neon-cyan">Icon</span> Code Y
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#engine" className="hover:text-neon-cyan transition-colors">AI Engine</a>
            <a href="#automation" className="hover:text-neon-cyan transition-colors">Automation</a>
            <a href="#genres" className="hover:text-neon-cyan transition-colors">Genres</a>
            <a href="#viral-machine" className="hover:text-neon-cyan transition-colors">Viral Machine</a>
            <a href="#visual-quality" className="hover:text-neon-cyan transition-colors">Output</a>
            <a href="#free-infra" className="hover:text-neon-cyan transition-colors">Free Infra</a>
            <a href="#stack" className="hover:text-neon-cyan transition-colors">Tech Stack</a>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neon-green">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              All Systems Online
            </div>
            <Link to="/dashboard">
              <Button size="sm" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-semibold">
                <Zap className="size-3.5 mr-1" /> Launch Dashboard <ArrowRight className="size-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════
         SECTION 1 — HERO
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="container mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-medium mb-6">
            <Sparkles className="size-4" />
            Next-Gen AI Content Factory
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="gradient-text">Icon Code Y</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            AI-Driven Content Factory &amp; Multi-Channel Social&nbsp;Media Automation Ecosystem
          </p>
          <p className="text-sm md:text-base text-muted-foreground/70 max-w-2xl mx-auto mb-10">
            Generate cinema-quality videos, photorealistic images &amp; multi-genre content — then auto-publish across every platform. Powered by open-source AI. <strong className="text-neon-green">100% Free Forever.</strong>
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/dashboard">
              <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold text-lg px-8 h-14 neon-border">
                <Rocket className="size-5 mr-2" /> Launch Dashboard — Instant Access
              </Button>
            </Link>
            <a href="#engine">
              <Button size="lg" variant="outline" className="border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 font-semibold h-14 px-8">
                <Play className="size-5 mr-2" /> Explore Features
              </Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="card-holographic rounded-2xl max-w-3xl mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-2 divide-x divide-white/5">
            <StatBox value="10+" label="Daily Auto-Posts" color="text-neon-cyan" />
            <StatBox value="4K–8K" label="AI Upscaling" color="text-neon-magenta" />
            <StatBox value="7+" label="Social Platforms" color="text-neon-purple" />
            <StatBox value="∞" label="Free Generation" color="text-neon-green" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 2 — CORE AI GENERATION ENGINE
         ════════════════════════════════════════════════════════════ */}
      <section id="engine" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="⚡ AI Generation Engine"
            badgeColor="neon-cyan"
            title="Create Anything with AI"
            subtitle="From text prompts to cinema-quality video, photorealistic images, and multi-niche content — all powered by cutting-edge diffusion models and LLMs."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Video}
              title="Text-to-Video"
              desc="Generate high-fidelity videos from 5 seconds up to 6 minutes using advanced LLMs and Diffusion models. Cinematic quality at your fingertips."
              color="neon-cyan"
            />
            <FeatureCard
              icon={Film}
              title="Image-to-Video"
              desc="Transform any static image into fluid, lifelike video with AI-driven animation, camera moves, and physics simulation."
              color="neon-purple"
            />
            <FeatureCard
              icon={Image}
              title="Text-to-Image"
              desc="Generate photorealistic assets in any aspect ratio — portraits, landscapes, product shots, illustrations — in seconds."
              color="neon-magenta"
            />
            <FeatureCard
              icon={Wand2}
              title="AI Upscaling"
              desc="Automatic resolution enhancement: 4K for YouTube, optimized bitrates for TikTok/Reels, platform-perfect quality every time."
              color="neon-green"
            />
            <FeatureCard
              icon={Layers}
              title="Multi-Niche Support"
              desc="Funny AI videos, educational content, technical reports, cinematic storytelling — one engine for every content vertical."
              color="neon-orange"
            />
            <FeatureCard
              icon={Sparkles}
              title="Style Transfer"
              desc="Apply artistic styles, custom-trained LoRAs, and brand-specific aesthetics to all generated content automatically."
              color="neon-yellow"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 3 — SMART AUTOMATION & INTEGRATION
         ════════════════════════════════════════════════════════════ */}
      <section id="automation" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="🧠 The Brain"
            badgeColor="neon-purple"
            title="Smart Automation & Integration"
            subtitle="Full social media sync, autonomous posting, strategic analytics, and WhatsApp integration — your AI marketing team on autopilot."
          />

          {/* Platform badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <PlatformBadge name="Instagram" color="neon-magenta" />
            <PlatformBadge name="Facebook" color="neon-purple" />
            <PlatformBadge name="TikTok" color="neon-cyan" />
            <PlatformBadge name="Snapchat" color="neon-yellow" />
            <PlatformBadge name="YouTube" color="neon-orange" />
            <PlatformBadge name="Telegram" color="neon-cyan" />
            <PlatformBadge name="Kwai" color="neon-green" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <FeatureCard
              icon={Share2}
              title="Full Social Media Sync"
              desc="Direct API integration with Instagram, Facebook, TikTok, Snapchat, YouTube, Telegram, and Kwai. Connect once, publish everywhere."
              color="neon-purple"
            />
            <FeatureCard
              icon={Bot}
              title="Autonomous Posting"
              desc="Schedule and auto-post 10+ high-quality videos daily per account. The AI handles captions, thumbnails, and optimal formats."
              color="neon-cyan"
            />
            <FeatureCard
              icon={ChartBar}
              title="Strategic Analytics"
              desc="AI engine analyzes channel history to determine the 'Golden Posting Time', generates trending hashtags and descriptions for maximum Explore page reach."
              color="neon-green"
            />
            <FeatureCard
              icon={MessageCircle}
              title="WhatsApp Integration"
              desc="Automated scripts, customer engagement tools, broadcast messaging, and smart auto-replies powered by AI."
              color="neon-orange"
            />
          </div>

          {/* Golden Posting Time visual */}
          <div className="mt-12 max-w-4xl mx-auto card-holographic rounded-2xl p-8 border border-neon-green/15">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="size-5 text-neon-green" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Golden Posting Time — AI Schedule Optimizer</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">{day}</div>
                  <div className="space-y-1">
                    {[9, 12, 15, 18, 21].map((hour) => {
                      const heat = Math.random();
                      const bg =
                        heat > 0.7
                          ? "bg-neon-green/60"
                          : heat > 0.4
                            ? "bg-neon-green/25"
                            : "bg-neon-green/8";
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`h-5 rounded-sm ${bg} transition-colors`}
                          title={`${day} ${hour}:00`}
                        />
                      );
                    })}
                  </div>
                  {i === 0 && (
                    <div className="mt-2 text-[10px] text-muted-foreground/50 space-y-1">
                      {["9am", "12pm", "3pm", "6pm", "9pm"].map((t) => (
                        <div key={t} className="h-5 flex items-center">{t}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-neon-green/8" /> Low</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-neon-green/25" /> Medium</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-neon-green/60" /> Peak</div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 4 — MULTI-GENRE AI CONTENT SUITE
         ════════════════════════════════════════════════════════════ */}
      <section id="genres" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="🎬 Multi-Genre Content"
            badgeColor="neon-magenta"
            title="Every Genre. Every Style."
            subtitle="From anime to cinematic realism, horror to educational — generate specialized content with dedicated AI models and rendering pipelines."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <GenreCard
              icon={Star}
              title="Anime & Cartoon Engine"
              desc="Dedicated models for high-quality 2D/3D anime, cell-shaded characters, and vibrant cartoon animations with fluid movement."
              tags={["2D Anime", "3D Toon", "Cell Shading", "Fluid Motion"]}
              color="neon-magenta"
            />
            <GenreCard
              icon={Film}
              title="Cinematic & Hyper-Realistic Films"
              desc="Ultra-realism rendering with cinematic lighting, 8K textures, and human-like physics for professional filmmaking."
              tags={["8K Textures", "Cinematic Lighting", "Ray Tracing", "Physics Sim"]}
              color="neon-cyan"
            />
            <GenreCard
              icon={Ghost}
              title="Horror & Dark Fantasy"
              desc="Specialized shaders and atmospheric AI tools for psychological horror, jump-scares, and dark fantasy environments with eerie sound design."
              tags={["Atmospheric FX", "Jump Scares", "Dark Fantasy", "Sound Design"]}
              color="neon-purple"
            />
            <GenreCard
              icon={Paintbrush}
              title="Versatile Image Generation"
              desc="Toggle between artistic styles — oil painting, sketch, photorealistic, digital art — for stunning static assets."
              tags={["Oil Painting", "Pencil Sketch", "Photorealistic", "Digital Art"]}
              color="neon-orange"
            />
          </div>

          {/* Style preview strip */}
          <div className="mt-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-4 justify-center">
              <Palette className="size-4 text-neon-yellow" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Style Toggle Preview</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { style: "Photorealistic", gradient: "from-neon-cyan/20 to-neon-cyan/5", border: "border-neon-cyan/20" },
                { style: "Oil Painting", gradient: "from-neon-orange/20 to-neon-orange/5", border: "border-neon-orange/20" },
                { style: "Anime / Toon", gradient: "from-neon-magenta/20 to-neon-magenta/5", border: "border-neon-magenta/20" },
                { style: "Digital Art", gradient: "from-neon-purple/20 to-neon-purple/5", border: "border-neon-purple/20" },
              ].map(({ style, gradient, border }) => (
                <div key={style} className={`aspect-[4/3] rounded-xl bg-gradient-to-br ${gradient} border ${border} flex items-center justify-center`}>
                  <span className="text-sm font-medium text-foreground/80">{style}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 5 — 5D/6D INTERFACE EXPERIENCE
         ════════════════════════════════════════════════════════════ */}
      <section id="interface" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="🌐 5D / 6D Experience"
            badgeColor="neon-green"
            title="Revolutionary Interface"
            subtitle="5D depth layers and 6D hexagonal modular widgets — a futuristic control center for real-time visualization of every metric."
          />

          {/* Interface preview grid */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-4">
            {/* Large dashboard preview */}
            <div className="md:col-span-2 card-holographic rounded-2xl border border-neon-cyan/15 p-6 min-h-[260px] flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Monitor className="size-4 text-neon-cyan" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Real-Time Dashboard</span>
                <div className="flex-1" />
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
              </div>
              <div className="flex-1 grid grid-cols-3 gap-3">
                {[
                  { label: "Videos Generated", value: "1,284", color: "text-neon-cyan" },
                  { label: "Images Created", value: "9,512", color: "text-neon-magenta" },
                  { label: "Auto-Posts Today", value: "47", color: "text-neon-green" },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/[0.03] rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                    <div className={`text-xl font-bold ${color}`} style={{ textShadow: "0 0 12px currentColor" }}>{value}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{label}</div>
                  </div>
                ))}
              </div>
              {/* Mini bar chart */}
              <div className="mt-4 flex items-end gap-1 h-16">
                {Array.from({ length: 24 }, (_, i) => {
                  const h = 15 + Math.random() * 85;
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-neon-cyan/40 to-neon-cyan/10 transition-all hover:from-neon-cyan/60"
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Side widgets */}
            <div className="flex flex-col gap-4">
              <div className="card-holographic rounded-2xl border border-neon-purple/15 p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="size-4 text-neon-purple" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depth Layers</span>
                </div>
                <div className="space-y-2">
                  {["Layer 1 — UI Controls", "Layer 2 — Data Viz", "Layer 3 — 3D Scene", "Layer 4 — Particles", "Layer 5 — Background"].map((l, i) => (
                    <div key={l} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full`} style={{ background: `hsl(${180 + i * 30}, 100%, 60%)`, boxShadow: `0 0 6px hsl(${180 + i * 30}, 100%, 60%)` }} />
                      <span className="text-xs text-muted-foreground">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-holographic rounded-2xl border border-neon-magenta/15 p-5 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Cloud className="size-4 text-neon-magenta" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cloud Storage</span>
                </div>
                <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div className="absolute inset-y-0 left-0 w-[62%] bg-gradient-to-r from-neon-magenta to-neon-purple rounded-full" style={{ boxShadow: "0 0 12px rgba(255,0,170,0.4)" }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>62 GB used</span>
                  <span>100 GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hex widget strip */}
          <div className="mt-8 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Brain, label: "AI Queue", value: "3 jobs", color: "text-neon-cyan" },
              { icon: TrendingUp, label: "Engagement", value: "+24%", color: "text-neon-green" },
              { icon: Hash, label: "Trending Tags", value: "12 new", color: "text-neon-yellow" },
              { icon: Camera, label: "Render Queue", value: "7 pending", color: "text-neon-magenta" },
            ].map(({ icon: Ic, label, value, color }) => (
              <div key={label} className="card-holographic rounded-xl p-4 border border-white/5 flex items-center gap-3">
                <Ic className={`size-5 ${color}`} />
                <div>
                  <div className={`text-sm font-bold ${color}`}>{value}</div>
                  <div className="text-[10px] text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 6 — ZERO-COST ECOSYSTEM
         ════════════════════════════════════════════════════════════ */}
      <section id="free" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="💎 100% Free Forever"
            badgeColor="neon-green"
            title="Zero-Cost Ecosystem"
            subtitle="Built entirely on open-source libraries — no subscription fees, no API costs, no credit limits. Unlimited content generation, forever."
          />

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="card-holographic rounded-2xl p-8 border border-neon-green/20 text-center group hover:shadow-[0_0_40px_rgba(0,255,136,0.1)] transition-all">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-neon-green/10 mb-4 mx-auto">
                <Code2 className="size-8 text-neon-green" />
              </div>
              <h3 className="font-bold text-lg mb-2">Open-Source Core</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stable Diffusion, ComfyUI, local LLMs — zero subscription fees or hidden API costs for end-users.
              </p>
            </div>
            <div className="card-holographic rounded-2xl p-8 border border-neon-cyan/20 text-center group hover:shadow-[0_0_40px_rgba(0,240,255,0.1)] transition-all">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-neon-cyan/10 mb-4 mx-auto">
                <Infinity className="size-8 text-neon-cyan" />
              </div>
              <h3 className="font-bold text-lg mb-2">Unlimited Generation</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No credit barriers. Generate infinite images and videos of any duration (5s to 6 min) without limits.
              </p>
            </div>
            <div className="card-holographic rounded-2xl p-8 border border-neon-purple/20 text-center group hover:shadow-[0_0_40px_rgba(123,47,255,0.1)] transition-all">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-neon-purple/10 mb-4 mx-auto">
                <HardDrive className="size-8 text-neon-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">Local GPU Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Run entirely on your own hardware — bypass cloud costs and maintain full data privacy. 100% offline-capable.
              </p>
            </div>
          </div>

          {/* Cost comparison bar */}
          <div className="mt-12 max-w-3xl mx-auto card-holographic rounded-2xl p-6 border border-neon-green/15">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Monthly Cost Comparison</h4>
            <div className="space-y-4">
              {[
                { label: "Traditional AI SaaS", cost: "$299/mo", width: "100%", color: "from-red-500/40 to-red-500/10" },
                { label: "API-Based Pipeline", cost: "$149/mo", width: "50%", color: "from-neon-orange/40 to-neon-orange/10" },
                { label: "Icon Code Y", cost: "$0", width: "3%", color: "from-neon-green/80 to-neon-green/30" },
              ].map(({ label, cost, width, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-bold text-foreground">{cost}</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 7 — TECHNICAL STACK
         ════════════════════════════════════════════════════════════ */}
      <section id="stack" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="⚙️ Tech Stack"
            badgeColor="neon-orange"
            title="Built for Performance"
            subtitle="A modern, production-grade stack combining Python AI orchestration, real-time frontends, and GPU-accelerated rendering."
          />

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
            <TechItem icon={Server} name="Python (FastAPI / Django)" desc="AI orchestration backend with async processing" color="neon-green" />
            <TechItem icon={Brain} name="Stable Diffusion Video" desc="Open-source video & image diffusion models" color="neon-cyan" />
            <TechItem icon={Sparkles} name="OpenAI API + Custom LoRAs" desc="Advanced LLMs and fine-tuned style models" color="neon-purple" />
            <TechItem icon={Monitor} name="React.js / Next.js" desc="Blazing-fast frontend with SSR capabilities" color="neon-orange" />
            <TechItem icon={Layers} name="Three.js / WebGL" desc="5D/6D visual effects and 3D rendering" color="neon-magenta" />
            <TechItem icon={Cpu} name="ComfyUI Integration" desc="Node-based AI workflow for custom pipelines" color="neon-yellow" />
            <TechItem icon={Database} name="Real-time Database" desc="Persistent storage with instant sync" color="neon-cyan" />
            <TechItem icon={Shield} name="GPU Acceleration" desc="CUDA / ROCm support for local rendering" color="neon-green" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 8 — AUTONOMOUS CONTENT FACTORY (VIRAL MACHINE)
         ════════════════════════════════════════════════════════════ */}
      <section id="viral-machine" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="🤖 The Viral Machine"
            badgeColor="neon-cyan"
            title="Autonomous Content Factory"
            subtitle="Set it and forget it. Select a niche and the AI researches trends, writes scripts, generates visuals, edits the final video, and publishes — zero human intervention."
          />

          {/* Core viral machine features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <FeatureCard
              icon={BrainCircuit}
              title="Zero-Manual Input"
              desc="Once the niche is selected, the AI autonomously researches trends, writes scripts, generates visuals, and edits the final video — no human intervention required."
              color="neon-cyan"
            />
            <FeatureCard
              icon={RefreshCw}
              title="24/7 Automated Workflow"
              desc="A background service generates and queues 5-10 high-quality videos daily per channel, covering diverse niches from Cute Animals to Tech News."
              color="neon-purple"
            />
            <FeatureCard
              icon={RadioTower}
              title="Smart Auto-Publishing"
              desc="Full integration with social media schedulers to post at peak engagement hours. Auto-generated viral captions, tags, and SEO-optimized titles."
              color="neon-green"
            />
          </div>

          {/* Viral Pipeline visual */}
          <div className="max-w-5xl mx-auto card-holographic rounded-2xl p-8 border border-neon-cyan/15">
            <div className="flex items-center gap-3 mb-6">
              <Workflow className="size-5 text-neon-cyan" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Automated Pipeline — From Trend to Post</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { step: "1", label: "Trend Research", desc: "AI scans trending topics", icon: TrendingUp, color: "neon-cyan" as NeonColor },
                { step: "2", label: "Script Writing", desc: "Auto-generates scripts", icon: Brain, color: "neon-purple" as NeonColor },
                { step: "3", label: "Visual Generation", desc: "Creates images & video", icon: Sparkles, color: "neon-magenta" as NeonColor },
                { step: "4", label: "Smart Editing", desc: "Viral cuts & transitions", icon: Scissors, color: "neon-orange" as NeonColor },
                { step: "5", label: "Auto-Publish", desc: "Posts at peak hours", icon: RadioTower, color: "neon-green" as NeonColor },
              ].map(({ step, label, desc, icon: Ic, color }) => {
                const c = COLOR_MAP[color];
                return (
                  <div key={step} className={`text-center p-4 rounded-xl border ${c.border} bg-white/[0.02]`}>
                    <div className={`inline-flex size-10 items-center justify-center rounded-full ${c.bg} mb-3`}>
                      <Ic className={`size-5 ${c.text}`} />
                    </div>
                    <div className={`text-xs font-bold ${c.text} mb-1`}>Step {step}</div>
                    <div className="text-sm font-semibold text-foreground mb-1">{label}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                );
              })}
            </div>
            {/* Niche examples */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Supported Niches — Auto-Detected</div>
              <div className="flex flex-wrap gap-2">
                {["🐾 Cute Animals", "💻 Tech News", "💡 Life Hacks", "📖 Storytelling", "🔥 Viral Challenges", "🎮 Gaming", "🍳 Cooking", "💪 Fitness", "🎵 Music", "📚 Education", "🎬 Cinema", "😂 Comedy"].map((niche) => (
                  <span key={niche} className="text-xs px-3 py-1.5 rounded-full bg-neon-cyan/8 border border-neon-cyan/15 text-neon-cyan/80">{niche}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Daily output visualizer */}
          <div className="mt-8 max-w-5xl mx-auto grid md:grid-cols-2 gap-4">
            <div className="card-holographic rounded-2xl p-6 border border-neon-purple/15">
              <div className="flex items-center gap-2 mb-4">
                <Gauge className="size-4 text-neon-purple" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Output Per Channel</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-neon-purple" style={{ textShadow: "0 0 20px currentColor" }}>5-10</div>
                  <div className="text-xs text-muted-foreground mt-1">Videos / Day</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-neon-cyan" style={{ textShadow: "0 0 20px currentColor" }}>∞</div>
                  <div className="text-xs text-muted-foreground mt-1">Channels Supported</div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                <Timer className="size-3 text-neon-green" />
                <span className="text-xs text-muted-foreground">Runs 24/7 — fully autonomous pipeline</span>
              </div>
            </div>
            <div className="card-holographic rounded-2xl p-6 border border-neon-green/15">
              <div className="flex items-center gap-2 mb-4">
                <Target className="size-4 text-neon-green" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smart SEO Engine</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Viral Captions", desc: "AI-generated hooks & CTAs", pct: 95 },
                  { label: "Hashtag Strategy", desc: "Trending + niche-specific tags", pct: 88 },
                  { label: "SEO Titles", desc: "Optimized for search & discovery", pct: 92 },
                  { label: "Engagement Timing", desc: "Published at peak hours", pct: 97 },
                ].map(({ label, desc, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">{label}</span>
                      <span className="text-neon-green">{pct}%</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-1.5">{desc}</div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-neon-green/60 to-neon-green/30" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 9 — VISUAL QUALITY & OUTPUT STYLE
         ════════════════════════════════════════════════════════════ */}
      <section id="visual-quality" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="🎬 Cinematic Output"
            badgeColor="neon-magenta"
            title="Visual Quality & Output Style"
            subtitle="Multi-platform optimized rendering with viral editing techniques, AI voiceovers, burned subtitles, and high-retention editing — built for the Explore page."
          />

          {/* Multi-format rendering */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="card-holographic rounded-2xl p-8 border border-neon-magenta/15">
              <div className="flex items-center gap-3 mb-6">
                <Maximize className="size-5 text-neon-magenta" />
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Multi-Platform Format Rendering</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* 9:16 */}
                <div className="text-center">
                  <div className="mx-auto w-24 h-40 rounded-xl border-2 border-neon-magenta/30 bg-gradient-to-b from-neon-magenta/10 to-transparent flex flex-col items-center justify-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-neon-magenta" style={{ textShadow: "0 0 12px currentColor" }}>9:16</span>
                    <div className="text-[10px] text-neon-magenta/80">Vertical</div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">Reels / TikTok / Shorts</div>
                  <div className="text-xs text-muted-foreground mt-1">Optimized for mobile-first vertical feeds</div>
                </div>
                {/* 16:9 */}
                <div className="text-center">
                  <div className="mx-auto w-40 h-24 rounded-xl border-2 border-neon-cyan/30 bg-gradient-to-b from-neon-cyan/10 to-transparent flex flex-col items-center justify-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-neon-cyan" style={{ textShadow: "0 0 12px currentColor" }}>16:9</span>
                    <div className="text-[10px] text-neon-cyan/80">Landscape</div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">YouTube / Desktop</div>
                  <div className="text-xs text-muted-foreground mt-1">Full HD / 4K cinematic widescreen</div>
                </div>
                {/* 1:1 */}
                <div className="text-center">
                  <div className="mx-auto w-32 h-32 rounded-xl border-2 border-neon-purple/30 bg-gradient-to-b from-neon-purple/10 to-transparent flex flex-col items-center justify-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-neon-purple" style={{ textShadow: "0 0 12px currentColor" }}>1:1</span>
                    <div className="text-[10px] text-neon-purple/80">Square</div>
                  </div>
                  <div className="text-sm font-semibold text-foreground">Instagram / Feed</div>
                  <div className="text-xs text-muted-foreground mt-1">Perfect for grid layouts & carousels</div>
                </div>
              </div>
            </div>
          </div>

          {/* Viral editing features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <FeatureCard
              icon={Scissors}
              title="Fast Cuts & Transitions"
              desc="AI-driven rapid cuts, dynamic transitions, and zoom-ins that mirror the pacing of top-performing viral content."
              color="neon-orange"
            />
            <FeatureCard
              icon={Music}
              title="Background Music Sync"
              desc="Automatic beat-synced editing — transitions and cuts land on musical beats for maximum watch time and retention."
              color="neon-magenta"
            />
            <FeatureCard
              icon={ZoomIn}
              title="Dynamic Zoom & Motion"
              desc="AI-powered zoom-ins on key moments, kinetic text, and camera movements that keep eyes glued to the screen."
              color="neon-cyan"
            />
            <FeatureCard
              icon={Subtitles}
              title="Auto Subtitle Burning"
              desc="Animated captions burned directly into every video — word-highlighted, emoji-enhanced, and styled per-platform."
              color="neon-green"
            />
            <FeatureCard
              icon={Mic}
              title="AI Voiceovers"
              desc="Multi-language AI voiceovers with natural intonation. Support for regional dialects and multiple voice styles."
              color="neon-purple"
            />
            <FeatureCard
              icon={Languages}
              title="Multi-Language Export"
              desc="Automatically translate and re-render content for global audiences — subtitles, voiceover, and captions in any language."
              color="neon-yellow"
            />
          </div>

          {/* High-retention visual */}
          <div className="max-w-4xl mx-auto card-holographic rounded-2xl p-6 border border-neon-orange/15">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="size-5 text-neon-orange" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">High-Retention Editing — Explore Page Optimized</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { metric: "95%", label: "Avg. Watch Rate", color: "text-neon-green" },
                { metric: "3.2s", label: "Hook Speed", color: "text-neon-cyan" },
                { metric: "12+", label: "Languages", color: "text-neon-purple" },
                { metric: "60fps", label: "Smooth Output", color: "text-neon-orange" },
              ].map(({ metric, label, color }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className={`text-2xl font-bold ${color}`} style={{ textShadow: "0 0 15px currentColor" }}>{metric}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         SECTION 10 — SUSTAINABLE FREE INFRASTRUCTURE
         ════════════════════════════════════════════════════════════ */}
      <section id="free-infra" className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader
            badge="♾️ Unlimited & Free"
            badgeColor="neon-green"
            title="Sustainable Free Infrastructure"
            subtitle="API-free architecture powered by local HuggingFace models and Gradio interfaces — 100% free, unlimited scalability, zero paid tokens."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            <div className="card-holographic rounded-2xl p-8 border border-neon-green/20 text-center group hover:shadow-[0_0_40px_rgba(0,255,136,0.1)] transition-all">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-neon-green/10 mb-4 mx-auto">
                <Boxes className="size-8 text-neon-green" />
              </div>
              <h3 className="font-bold text-lg mb-2">HuggingFace Models</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by local HuggingFace models — Stable Diffusion, LLMs, and audio models running without paid API tokens.
              </p>
            </div>
            <div className="card-holographic rounded-2xl p-8 border border-neon-cyan/20 text-center group hover:shadow-[0_0_40px_rgba(0,240,255,0.1)] transition-all">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-neon-cyan/10 mb-4 mx-auto">
                <Cog className="size-8 text-neon-cyan" />
              </div>
              <h3 className="font-bold text-lg mb-2">Gradio Interfaces</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Local Gradio UIs for every AI model — test, tweak, and deploy content pipelines with zero external dependencies.
              </p>
            </div>
            <div className="card-holographic rounded-2xl p-8 border border-neon-purple/20 text-center group hover:shadow-[0_0_40px_rgba(123,47,255,0.1)] transition-all">
              <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-neon-purple/10 mb-4 mx-auto">
                <Infinity className="size-8 text-neon-purple" />
              </div>
              <h3 className="font-bold text-lg mb-2">Unlimited Scalability</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No limits on connected accounts or daily upload volume. Scale to hundreds of channels with zero additional cost.
              </p>
            </div>
          </div>

          {/* Architecture visual */}
          <div className="max-w-5xl mx-auto card-holographic rounded-2xl p-8 border border-neon-green/15">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="size-5 text-neon-green" />
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">API-Free Architecture — Zero Monthly Costs</span>
            </div>
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "API Tokens", value: "$0", desc: "No paid APIs", color: "neon-green" as NeonColor },
                { label: "Subscriptions", value: "$0", desc: "No monthly fees", color: "neon-cyan" as NeonColor },
                { label: "Account Limits", value: "∞", desc: "Unlimited connections", color: "neon-purple" as NeonColor },
                { label: "Upload Volume", value: "∞", desc: "No daily caps", color: "neon-orange" as NeonColor },
              ].map(({ label, value, desc, color }) => {
                const c = COLOR_MAP[color];
                return (
                  <div key={label} className={`text-center p-5 rounded-xl border ${c.border} bg-white/[0.02]`}>
                    <div className={`text-3xl font-bold ${c.text}`} style={{ textShadow: "0 0 15px currentColor" }}>{value}</div>
                    <div className="text-sm font-semibold text-foreground mt-1">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                );
              })}
            </div>
            {/* Tech stack badges */}
            <div className="pt-4 border-t border-white/5">
              <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Powered By — 100% Open Source</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "🤗 HuggingFace", color: "neon-yellow" as NeonColor },
                  { name: "🎨 Stable Diffusion", color: "neon-cyan" as NeonColor },
                  { name: "🖥️ Gradio", color: "neon-orange" as NeonColor },
                  { name: "🧠 Local LLMs", color: "neon-purple" as NeonColor },
                  { name: "🎙️ Whisper", color: "neon-magenta" as NeonColor },
                  { name: "🎵 Bark TTS", color: "neon-green" as NeonColor },
                  { name: "🎬 ComfyUI", color: "neon-cyan" as NeonColor },
                  { name: "🐍 Python", color: "neon-yellow" as NeonColor },
                ].map(({ name, color }) => {
                  const c = COLOR_MAP[color];
                  return (
                    <span key={name} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${c.bg} ${c.border} border text-xs font-medium ${c.text}`}>
                      {name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Error-free guarantee */}
          <div className="mt-8 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neon-green/10 border border-neon-green/20">
              <Shield className="size-5 text-neon-green" />
              <span className="text-sm font-semibold text-neon-green">Genuinely Functional — Zero Errors, Zero Defects</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 max-w-xl mx-auto">
              Every pipeline is tested end-to-end before deployment. The tool is genuinely functional with automated error recovery, health monitoring, and self-healing workflows.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         FINAL CTA
         ════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-24 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">Ready to Create?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              No registration needed. Instant access to the full AI Content Factory — generate, automate, and publish from one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-neon-cyan text-background hover:bg-neon-cyan/90 font-bold text-lg px-10 h-14 neon-border">
                  <Rocket className="size-5 mr-2" /> Launch Now — Instant &amp; Free
                </Button>
              </Link>
              <a href="https://wa.me/201094555299" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-neon-green/30 text-neon-green hover:bg-neon-green/10 font-semibold h-14 px-8">
                  <MessageCircle className="size-5 mr-2" /> للتواصل — WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
         FOOTER
         ════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-white/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="size-8 hexagon bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                  <Zap className="size-4 text-white" />
                </div>
                <span className="font-bold text-lg">
                  <span className="text-neon-cyan">Icon</span> Code Y
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Next-Gen AI-Driven Content Factory &amp; Multi-Channel Social Media Automation Ecosystem.
              </p>
            </div>

            {/* Developer Info */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Developed by</p>
              <p className="font-bold text-foreground text-lg">Eng. Youssef Mohamed El-Sayed</p>
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <a
                href="https://wa.me/201094555299"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green font-semibold hover:bg-neon-green/20 transition-colors"
              >
                <MessageCircle className="size-5" />
                للتواصل — WhatsApp
              </a>
              <span className="text-xs text-muted-foreground">+20 109 455 5299</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Icon Code Y — All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Built with</span>
              <Heart className="size-3 text-neon-magenta" />
              <span>by Eng. Youssef Mohamed El-Sayed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
