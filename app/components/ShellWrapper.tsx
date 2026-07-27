// app/components/ShellWrapper.tsx
"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ShellWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <>
      {!isLanding && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isLanding && <Footer />}
    </>
  );
}
