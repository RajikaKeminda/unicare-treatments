"use client";

import * as React from "react";

import { BsBox, BsFilePost, BsGrid } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { IoMdPhotos } from "react-icons/io";
import { FaBlog } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaBoxOpen } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { IoIosList } from "react-icons/io";

import { NavMain } from "@/components/shadcn/nav-main";
import { NavUser } from "@/components/shadcn/nav-user";
import { MdOutlineContactSupport } from "react-icons/md";
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BiSolidDashboard,
      items: [],
    },
    {
      title: "Items",
      url: "/dashboard/items",
      icon: BsBox,
    },
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: FaBlog,
      isActive: true,
      items: [
        {
          icon: BsFilePost,
          title: "Posts",
          url: "/dashboard/blog/posts",
        },
        {
          icon: BsGrid,
          title: "Categories",
          url: "/dashboard/blog/categories",
        },
      ],
    },
    {
      title: "Gallery",
      url: "/dashboard/gallery",
      icon: IoMdPhotos,
    },
    {
      title: "Inquiries",
      url: "/dashboard/inquiries",
      icon: MdOutlineContactSupport,
    },
    {
      title: "Products",
      url: "/dashboard/product-manage",
      icon: FaBoxOpen,
      isActive: true,
      items: [
        {
          icon: MdAdd,
          title: "Add Product",
          url: "/dashboard/product-manage/product-add",
        },
        {
          icon: IoIosList,
          title: "All Products",
          url: "/dashboard/product-manage/product-see",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: FiSettings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = session?.user;
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
        <NavMain items={data.navMain} />
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
