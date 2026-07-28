// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: { default: "Torque Blog", template: "%s | Torque" },
  description: "A powerful, modern blogging platform built with Next.js and Cloudflare.",
  icons: {
    icon: "/favicon.webp",
  },
  openGraph: {
    type: "website",
    siteName: "Torque",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
