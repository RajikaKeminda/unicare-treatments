// RootLayout.tsx
'use client';  // Add this line at the top of the file to mark it as a client-side component

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation'; // Now you can use this hook in this file

import HeaderNav from "@/components/layout/HeaderNavigation";
import FooterNav from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin'); 

  if (!isAdminRoute) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <main className="w-full mx-auto px-4 md:px-8 bg-white">
            <div className="bg-gray-900 text-center py-1 mb-4">
              <h2 className="font-bold text-sm sm:text-base">Special Offer: Get 20% off on all products!</h2>
            </div>

            <HeaderNav />
            {children}
            <FooterNav />
          </main>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <main className="w-full mx-auto px-4 md:px-8 bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}
