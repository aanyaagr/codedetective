import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/layout/SiteChrome";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeDetective Academy | Learn. Investigate. Solve.",
  description:
    "Turn coding concepts into thrilling cases. Use your skills, uncover clues, and solve programming mysteries with your AI Detective Assistant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plexSans.variable} ${plexMono.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#080A0F] text-slate-100 antialiased font-sans flex flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
