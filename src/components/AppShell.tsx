"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api");

  if (bare) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div id="main" className="pt-20 min-h-screen">
        {children}
      </div>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
