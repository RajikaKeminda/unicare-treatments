'use client'; // This marks the file as a client component

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex items-center justify-between font-semibold p-1 bg-white shadow-md">
      {/* Logo */}
      <Link className="text-primary font-semibold text-2xl" href="">
        Unicare Treatments
      </Link>

      {/* Navigation Links (Desktop) */}
      <nav className="hidden md:flex items-center gap-8 text-gray-500 font-semibold">
        <Link className="block text-gray-500 hover:text-white hover:bg-primary hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200" href={''}>Home</Link>
        <Link className="block text-gray-500 hover:text-white hover:bg-primary hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200"  href={''}>Appointment</Link>
        <Link  className="block text-gray-500 hover:text-white hover:bg-primary hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200" href={''}>Treatments Updates</Link>
        <Link className="block text-gray-500 hover:text-white hover:bg-primary hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200"  href={'/Product'}>Products</Link>
        <Link  className="block text-gray-500 hover:text-white hover:bg-primary hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200" href={''}>Instruction blogs</Link>
        <Link  className="block text-gray-500 hover:text-white hover:bg-primary hover:px-4 hover:py-2 hover:rounded-lg transition-all duration-200" href={''}>Contact Us</Link>
        <Link className="bg-primary rounded-full text-white px-8 py-2 hover:bg-red-900 hover:shadow-lg transform hover:scale-105 transition-all duration-200 ease-in-out" href={''} >
          Register
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-500 focus:outline-none">
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
          isMenuOpen ? 'block' : 'hidden'
        } z-50`}
      >
        {/* Close button for mobile menu */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-500">Menu</h2>
          <button
            onClick={toggleMenu}
            className="text-gray-500 focus:outline-none"
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
        <Link href={''} className="block text-gray-500 hover:text-primary">
          Home
        </Link>
        <Link href={''} className="block text-gray-500 hover:text-primary">
          Product Menu
        </Link>
        <Link href={''} className="block text-gray-500 hover:text-primary">
          Help Desk
        </Link>
        <Link href={''} className="block text-gray-500 hover:text-primary">
          Contact Us
        </Link>
        <Link href={''} className="block text-gray-500 hover:text-primary">
          Login
        </Link>
        <Link
          href={''}
          className="block bg-primary rounded-full text-white px-8 py-2 text-center"
        >
          Register
        </Link>
      </div>
    </header>
  );
}
