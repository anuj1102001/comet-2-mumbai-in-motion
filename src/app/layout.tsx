import type { Metadata, Viewport } from "next";
import { fontVars } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "COMET — Mumbai in Motion",
  description:
    "An immersive 3D product story for an original Comet sneaker concept inspired by Mumbai's local trains, CST, vintage postcards and street lettering. A UX/UI and product design case study.",
  openGraph: {
    title: "COMET — Mumbai in Motion",
    description: "A city that never stops. A story that moves with every step.",
    images: ["/img/board-2.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#eee5d3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVars} antialiased`}>
      <body className="grain min-h-full">{children}</body>
    </html>
  );
}
