"use client";

import * as React from "react";

import { NavMain } from "@/components/shadcn/nav-main";
import { NavUser } from "@/components/shadcn/nav-user";

import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/shadcn/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps, useEffect, useState } from "react";
import { adminNavMenu, doctorNavMenu } from "@/helpers/data/side.menu.data";
import { NavMenu } from "@/types/common";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const [navMenu, setNavMenu] = useState<NavMenu[]>([]);

  const user = session?.user;
  const role = user?.role;

  useEffect(() => {
    const isAdmin = role === "admin";
    const isDoctor = role === "doctor";
    if (isAdmin) {
      setNavMenu(adminNavMenu);
    } else if (isDoctor) {
      setNavMenu(doctorNavMenu);
    } else {
      setNavMenu([]);
    }
  }, [role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex align-center justify-center">
          <Link href="/home">
            <Image
              src="/logo-bg-removed2.png"
              alt="Logo"
              width={160}
              height={32}
            />
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMenu} />
      </SidebarContent>
      {user && (
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
}
