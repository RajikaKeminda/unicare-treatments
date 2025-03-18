"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";
import Image from "next/image";
import logo from "@/images/logo.svg";
import logoLight from "@/images/logo-white.svg";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { ModeToggle } from "@/shadcn/them-switch-list";

const LinkComponent = ({
  href,
  text,
  isSelected,
}: {
  href: string;
  text: string;
  isSelected: boolean;
}) => {
  return (
    <Link
      className={cn(
        isSelected && "underline",
        "block px-4 hover:bg-black hover:text-white hover:dark:bg-white dark:text-white hover:dark:text-black hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200 underline-offset-[5px]"
      )}
      href={href}
    >
      {text}
    </Link>
  );
};

export default function HeaderNavigator() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const user = session?.user;

  const toggleMenu = () => {
    setIsMenuOpen((state) => !state);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ redirect: true, callbackUrl: "/home" });
      // The page will redirect, so no need to setIsLoading(false)
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex items-center justify-between font-semibold bg-white dark:bg-black shadow-md py-2 px-10">
      <Link className="text-primary font-semibold text-2xl" href="/">
        <Image
          src={logo}
          alt="Unicare Treatments"
          width={200}
          height={22}
          className="block dark:hidden"
        />
        <Image
          src={logoLight}
          alt="Unicare Treatments"
          width={200}
          height={22}
          className="hidden dark:block"
        />
      </Link>

      {/* Navigation Links (Desktop) */}
      <nav className="hidden md:flex items-center gap-1  font-thin">
        <LinkComponent
          href="/home"
          text="Home"
          isSelected={pathname.includes("/home")}
        />
        {!!user && (
          <LinkComponent
            href="/channeling"
            text="Appointment"
            isSelected={pathname.includes("/channeling")}
          />
        )}
        <LinkComponent
          href="/treatment"
          text="Treatments"
          isSelected={pathname.includes("/treatment")}
        />
        <LinkComponent
          href="/products"
          text="Products"
          isSelected={pathname.includes("/products")}
        />
        <LinkComponent
          href="/instruction-blogs"
          text="Instruction blogs"
          isSelected={pathname.includes("/instruction-blogs")}
        />
        <LinkComponent
          href="/contact-us"
          text="Contact Us"
          isSelected={pathname.includes("/contact-us")}
        />
        <span className="px-2">
          <ModeToggle />
        </span>

        {user ? (
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <span className="font-semibold">Hi, {user.username} </span>
            </Link>
            <span
              onClick={handleSignOut}
              className="px-4 bg-black text-white dark:bg-white dark:text-black border-radius-2 p-2  rounded-full cursor-pointer flex items-center gap-1"
            >
              {isLoading && (
                <Loader2 className="animate-spin" width={18} height={18} />
              )}
              Logout
            </span>
          </div>
        ) : (
          <Link
            className="px-4 bg-black text-white dark:bg-white dark:text-black border-radius-2 p-2 rounded-full cursor-pointer"
            href={"/sign-in"}
          >
            Login
          </Link>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className=" focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation (Hidden by default, shown when toggled) */}
      <div
        className={`md:hidden absolute top-12 left-0 w-full bg-white shadow-md py-4 px-6 space-y-4 ${
          isMenuOpen ? "block" : "hidden"
        } z-[100]`}
      >
        {/* Close button for mobile menu */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold ">Menu</h2>
          <button
            onClick={toggleMenu}
            className=" focus:outline-none"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu links */}
        <Link href={""} className="block  hover:text-primary">
          Home
        </Link>
        <Link href={""} className="block  hover:text-primary">
          Product Menu
        </Link>
        <Link href={""} className="block  hover:text-primary">
          Help Desk
        </Link>
        <Link href={""} className="block  hover:text-primary">
          Contact Us
        </Link>
        <Link href={""} className="block  hover:text-primary">
          Login
        </Link>
        <Link
          href={""}
          className="block bg-primary rounded-full text-white px-8 py-2 text-center"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
