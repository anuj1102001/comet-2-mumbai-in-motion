import type { Metadata, Viewport } from "next";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3300";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: "COMET 2.0 — Mumbai in Motion",
  description:
    "COMET 2.0 — Mumbai in Motion: a cinematic product story for an original sneaker concept inspired by Mumbai's local trains, CST, vintage postcards and street lettering. A UX/UI and product design case study.",
  openGraph: {
    title: "COMET 2.0 — Mumbai in Motion",
    description: "A city that never stops.",
    images: ["/img/look/platform-wide-1400.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eee5d3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVars} antialiased`}>
      <body className="min-h-full">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
