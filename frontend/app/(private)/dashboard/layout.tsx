import { AppSidebar } from "@/shadcn/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/shadcn/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />

      {children}
      <div className="fixed right-2 bottom-2 z-[9999] border border-black rounded-full overflow-hidden block md:hidden bg-white/50">
        <SidebarTrigger />
      </div>
    </SidebarProvider>
  );
}
