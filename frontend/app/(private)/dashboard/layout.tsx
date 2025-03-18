import { AppSidebar } from "@/shadcn/app-sidebar";
import { SidebarProvider } from "@/shadcn/ui/sidebar";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
