import { BsFilePost, BsGrid } from "react-icons/bs";
import { MdInventory } from "react-icons/md";
import {
  FaShoppingCart,
  FaClock,
  FaClipboardList,
  FaUser,
} from "react-icons/fa";
import { MdQueue } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { FaBlog } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { FaBoxOpen } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { IoIosList } from "react-icons/io";
//import { MdOutlineContactSupport } from "react-icons/md";
import { NavMenu } from "@/types/common";
import { FaCommentDots } from "react-icons/fa";



export const adminNavMenu: NavMenu[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BiSolidDashboard,
    items: [],
  },
  {
    title: "Blog",
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
        title: "Create Blog",
        url: "/dashboard/blog/create-blog",
      },
      {
        icon: BsGrid,
        title: "Categories",
        url: "/dashboard/blog-category",
      },
    ],
  },
  {
    title: "Gallery",
    url: "/dashboard/gallery",
    icon: IoMdPhotos,
  },
  {
    title: "Feedback",
    url: "/dashboard/product-inquiry",
    icon: FaCommentDots,

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
    icon: MdQueue,
    isActive: true,
    items: [
      {
        icon: FaClipboardList,
        title: "All Appointments",
        url: "/dashboard/appointment-list",
      },
      {
        icon: FaClock,
        title: "Schedule",
        url: "/dashboard/appointment-schedule",
      },
    ],
  },
  {
    title: "Treatment History",
    url: "/dashboard/treatment-history-management",
    icon: FaHistory,
  },
  {
    title: "Users",
    url: "/dashboard/user-management",
    icon: FaUser,
  },
];

export const doctorNavMenu: NavMenu[] = [
  {
    title: "Appointments",
    icon: MdQueue,
    isActive: true,
    items: [
      {
        icon: FaClipboardList,
        title: "All Appointments",
        url: "/dashboard/appointment-list",
      },
      {
        icon: FaClock,
        title: "Schedule",
        url: "/dashboard/appointment-schedule",
      },
    ],
  },
];
