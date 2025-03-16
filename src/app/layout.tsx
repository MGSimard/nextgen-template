import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NavTrigger } from "@/components/NavTrigger";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { siteMetadata } from "@/utils/siteMetadata";
import "@/styles/globals.css";
import { ReactScan } from "@/components/ReactScan";

const geistSans = Geist({ subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--GeistMono", subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f1b79" }, // Light theme primary color
    { media: "(prefers-color-scheme: dark)", color: "#fa4242" }, // Dark theme primary color
  ],
};
export const metadata: Metadata = siteMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.className} ${geistMono.variable}`}>
      <ReactScan />
      <body>
        <ThemeProvider disableTransitionOnChange defaultTheme="system" enableSystem>
          <Toaster richColors toastOptions={{ className: "sonner-card" }} />
          <NavTrigger />
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
