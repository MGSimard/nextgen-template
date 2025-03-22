import type { Metadata } from "next";
// https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadata-fields

// https://realfavicongenerator.net/
// For favicon.ico to cover all three recommended sizes (48x48, 32x32, 16x16),
// create all three as different layers in a single image (top-left alignement) then export as .ico.

// To test Favicons, Touch icons & Manifest locally run: "npx realfavicon check 3000"

export const siteMetadata: Metadata = {
  authors: [{ name: "MGSimard", url: "https://mgsimard.dev" }],
  applicationName: "NextGen Template",
  title: {
    default: "NextGen Template",
    template: "NextGen | %s",
  },
  description: "A Next.js template by MGSimard.",
  manifest: "/manifest.webmanifest",
  icons: [
    { rel: "shortcut icon", url: "/favicons/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "96x96", url: "/favicons/icon.png" },
    { rel: "icon", type: "image/svg+xml", url: "/favicons/icon.svg" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/favicons/apple-icon.png" },
  ],
  openGraph: {
    title: "NextGen Template",
    description: "A Next.js template by MGSimard.",
    url: "https://nextgen-template.vercel.app",
    type: "website",
    siteName: "NextGen Template",
    images: [{ url: "/shared/opengraph-image.png", width: 1200, height: 600 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen Template",
    description: "A Next.js template by MGSimard.",
    images: ["/shared/twitter-image.png"],
    creator: "@MGSimard",
  },
};
