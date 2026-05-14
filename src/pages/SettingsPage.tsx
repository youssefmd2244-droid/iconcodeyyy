import {
  Brain,
  Cloud,
  Cpu,
  Globe,
  Languages,
  Mic,
  Moon,
  Palette,
  RefreshCw,
  Scissors,
  Server,
  Sun,
  Video,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";

export function SettingsPage() {
  const { theme, toggleTheme, switchable } = useTheme();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your AI Content Factory
        </p>
      </div>

      {/* System Status */}
      <Card className="card-holographic border-neon-cyan/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="size-4 text-neon-cyan" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "HuggingFace Models", status: "Online", icon: Brain },
            { label: "Gradio Interfaces", status: "Active", icon: Server },
            { label: "Stable Diffusion XL", status: "Ready", icon: Palette },
            { label: "AI Video Generator", status: "Running", icon: Video },
            { label: "Local GPU Processing", status: "Active", icon: Cpu },
            { label: "Cloud Storage (100 GB)", status: "62% Used", icon: Cloud },
          ].map(({ label, status, icon: Ic }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <Ic className="size-4 text-neon-cyan" />
              <span className="text-sm flex-1">{label}</span>
              <span className="text-xs text-neon-green font-bold">{status}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              API-Free Architecture · $0/month · No paid tokens
            </span>
            <span className="text-xs text-neon-green font-bold">100% Free</span>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      {switchable && (
        <Card className="card-holographic border-neon-purple/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="size-4 text-neon-purple" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="size-4 text-neon-purple" />
                ) : (
                  <Sun className="size-4 text-neon-yellow" />
                )}
                <Label className="text-sm">Dark Mode</Label>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Generation */}
      <Card className="card-holographic border-neon-magenta/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Video className="size-4 text-neon-magenta" />
            Content Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scissors className="size-4 text-neon-orange" />
              <Label className="text-sm">Viral Editing Techniques</Label>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="size-4 text-neon-purple" />
              <Label className="text-sm">AI Voiceover</Label>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="size-4 text-neon-yellow" />
              <Label className="text-sm">Multi-Language Subtitles</Label>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw className="size-4 text-neon-cyan" />
              <Label className="text-sm">24/7 Autonomous Pipeline</Label>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Platform Outputs */}
      <Card className="card-holographic border-neon-green/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="size-4 text-neon-green" />
            Output Formats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { format: "9:16 Vertical", desc: "TikTok · Reels · Shorts" },
            { format: "16:9 Landscape", desc: "YouTube · Desktop" },
            { format: "1:1 Square", desc: "Instagram Feed" },
          ].map(({ format, desc }) => (
            <div key={format} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{format}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scalability */}
      <Card className="card-holographic border-neon-orange/15">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="size-4 text-neon-orange" />
            Scalability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connected Accounts</span>
              <span className="text-sm font-bold text-neon-cyan">Unlimited</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily Upload Limit</span>
              <span className="text-sm font-bold text-neon-cyan">Unlimited</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Videos Per Day Per Channel</span>
              <span className="text-sm font-bold text-neon-cyan">5-10</span>
            </div>
            <div className="pt-3 border-t border-white/5">
              <div className="text-[10px] text-muted-foreground">
                No limits on accounts or upload volume. All services operational 24/7.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground py-4">
        Developed by <strong className="text-foreground">Eng. Youssef Mohamed El-Sayed</strong>
      </div>
    </div>
  );
}
