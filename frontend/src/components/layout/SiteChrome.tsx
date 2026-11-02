"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Home renders its own Navbar; login is full-screen; the resolution pages have
  // their own investigation nav (two stacked nav bars before).
  const showNavbar = pathname !== "/" && pathname !== "/login" && !pathname.startsWith("/resolution");

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
