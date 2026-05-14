import { Brain, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-neon-cyan/10">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 hexagon bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <Brain className="size-4 text-background" />
          </div>
          <span className="text-sm font-bold gradient-text tracking-wide">ICON CODE Y</span>
        </Link>

        <nav className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neon-green">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            All Systems Online
          </div>
          <Button
            size="sm"
            className="bg-neon-cyan text-background hover:bg-neon-cyan/90 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-xs font-semibold"
            asChild
          >
            <Link to="/dashboard">
              <Zap className="size-3 mr-1" />
              Launch Dashboard
              <ArrowRight className="size-3 ml-1" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
