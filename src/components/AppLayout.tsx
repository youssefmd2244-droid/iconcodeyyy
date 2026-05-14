import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { HolographicBackground } from "./HolographicBackground";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 items-center px-4 md:hidden relative z-10">
          <SidebarTrigger />
        </header>
        <main className="flex-1 relative overflow-auto">
          <HolographicBackground />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
