import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="bg-gray-100 w-full p-8">{children}</div>;
}
