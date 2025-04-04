"use client";
import Image from "next/image";
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 md:flex-nowrap">
        <div className="flex-shrink-0 md:ml-0 w-full md:w-auto flex justify-center md:justify-start">
          <Image
            src="/logo-bg-removed2.png"
            alt="Logo"
            width={180}
            height={80}
            className="w-32 md:w-[230px]"
            unoptimized
          />
        </div>

        <div className="flex items-center w-full max-w-sm border rounded-full focus-within:shadow-md mt-3 md:mt-0">
          <input
            type="text"
            placeholder="Search product here..."
            className="w-full h-10 outline-none rounded-l-full pl-3 text-black"
          />
          <div className="text-lg min-w-[50px] h-10 bg-red-600 flex items-center justify-center rounded-r-full text-white">
            <GrSearch />
          </div>
        </div>

        <div className="flex items-center gap-5 md:gap-7 mt-3 md:mt-0">
          <div className="text-3xl cursor-pointer hidden sm:block">
            <FaRegCircleUser />
          </div>

          <Link href="/shopping-cart">
            <div className="text-2xl relative">
              <span>
                <FaShoppingCart />
              </span>
              <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-3 text-xs">
                0
              </div>
            </div>
          </Link>

          <Link
            href={"/sign-in"}
            className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 hidden sm:block"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
