import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { NavTrigger } from "@/components/NavTrigger";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { siteMetadata } from "@/utils/siteMetadata";
import "@/styles/globals.css";

const geistSans = Geist({ subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--GeistMono", subsets: ["latin"], display: "swap" });

export const viewport: Viewport = { themeColor: "#fa4242" };
export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.className} ${geistMono.variable}`}>
      <body>
        <Toaster richColors toastOptions={{ className: "sonner-card" }} />
        <NavTrigger />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
