import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Liminova Labs | 360° Digital Solutions & Growth Agency",
  description: "We build scalable platforms, craft brand identities, and drive profit through data-driven marketing. Transform your ideas into reality with Liminova Labs.",
  keywords: ["Digital Agency", "App Development", "Flutter", "Next.js", "SEO", "Meta Ads", "UI/UX", "Liminova Labs"],
  openGraph: {
    title: "Liminova Labs | Digital Transformation Agency",
    description: "End-to-end digital solutions designed to help your business scale efficiently.",
    type: "website",
    locale: "en_US",
    siteName: "Liminova Labs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}