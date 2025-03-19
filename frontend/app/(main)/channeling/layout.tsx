import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Channeling",
  description: "Manage your appointments efficiently",
};

export default function ChannelingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
