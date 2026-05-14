import {
  BarChart3,
  Brain,
  Calendar,
  Hash,
  Home,
  Image,
  MessageCircle,
  Palette,
  Settings,
  Share2,
  Video,
  Wand2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Settings", url: "/settings", icon: Settings },
];

const aiTools = [
  { title: "Text → Video", url: "/dashboard", icon: Video },
  { title: "Text → Image", url: "/dashboard", icon: Image },
  { title: "AI Upscaler", url: "/dashboard", icon: Wand2 },
  { title: "Style Transfer", url: "/dashboard", icon: Palette },
];

const automation = [
  { title: "Platforms", url: "/dashboard", icon: Share2 },
  { title: "Scheduler", url: "/dashboard", icon: Calendar },
  { title: "Analytics", url: "/dashboard", icon: BarChart3 },
  { title: "Hashtags", url: "/dashboard", icon: Hash },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 hexagon bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
            <Brain className="size-4 text-background" />
          </div>
          <div>
            <div className="text-sm font-bold gradient-text">ICON CODE Y</div>
            <div className="text-[10px] text-muted-foreground">AI Content Factory</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest text-muted-foreground/60">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest text-muted-foreground/60">AI Engine</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiTools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest text-muted-foreground/60">Automation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {automation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-3">
        <a
          href="https://wa.me/201094555299"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#25D366]/5 border border-[#25D366]/15 text-[#25D366] text-xs hover:bg-[#25D366]/10 transition-all"
        >
          <MessageCircle className="size-3.5" />
          <span>للتواصل</span>
        </a>
      </SidebarFooter>
    </Sidebar>
  );
}
