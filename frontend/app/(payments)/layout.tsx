export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="w-full bg-white">{children}</main>;
}
