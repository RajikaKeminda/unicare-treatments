"use client";

import * as React from "react";

import { BsFilePost, BsGrid } from "react-icons/bs";
import { MdInventory } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { MdQueue } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
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
      url: "/dashboard/inquiry-management",
      icon: MdOutlineContactSupport,
    },
    {
      title: "Products",
      url: "/dashboard/product-management",
      icon: FaBoxOpen,
      isActive: true,
      items: [
        {
          icon: MdAdd,
          title: "Add Product",
          url: "/dashboard/product-management/product-add",
        },
        {
          icon: IoIosList,
          title: "All Products",
          url: "/dashboard/product-management/product-see",
        },
      ],
    },
    {
      title: "Inventory",
      url: "/dashboard/Inventory-management",
      icon: MdInventory,
    },
    {
      title: "Orders",
      url: "/dashboard/order-management",
      icon: FaShoppingCart,
    },
    {
      title: "Appointments",
      url: "/dashboard/appointment-management",
      icon: MdQueue,
    },
    {
      title: "Treatment History",
      url: "/dashboard/treatment-history-management",
      icon: FaHistory,
    },
    {
      title: "Users",
      url: "/dashboard/user-management",
      icon: FaUsers,
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
