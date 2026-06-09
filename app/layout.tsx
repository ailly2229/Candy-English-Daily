import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";

export const metadata: Metadata = {
  title: "Candy English Daily",
  description: "A sweet daily English learning companion with easy and standard lessons.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Candy English"
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/candy-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/candy-icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ff7eb6"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
