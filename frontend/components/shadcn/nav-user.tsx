"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Loader2,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/shadcn/ui/sidebar";
import { useState } from "react";
import ThemSwitch from "./them-switch";

export function NavUser({
  user,
}: {
  user: {
    id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: "/home" });
      // The page will redirect, so no need to setIsLoading(false)
    } catch {
      setIsLoading(false);
    }
  };

  const getFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {user?.image && (
                  <AvatarImage src={user?.image} alt="user-image" />
                )}
                <AvatarFallback className="rounded-lg">
                  {getFirstLetter(user.name || user.username || "A")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.name || user.username}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <div className="bg-slate-200 hover:bg-slate-200 flex items-center gap-2 p-2 rounded-t-lg text-sm cursor-default dark:bg-white dark:text-black">
              <BadgeCheck width={18} height={18} />
              <div className="flex align-center gap-1">
                You are a
                <span className="capitalize py-0 px-2 rounded-full bg-black text-white ">
                  {user?.role}
                </span>
              </div>
              {user?.isVerified ? <>✅</> : <>❌</>}
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <ThemSwitch />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" width={18} height={18} />
              ) : (
                <LogOut />
              )}
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
