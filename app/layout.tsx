import type { Metadata } from "next";
import "./globals.css";
import { ProgressProvider } from "@/context/ProgressContext";

export const metadata: Metadata = {
  title: "Candy English Daily",
  description: "A sweet daily BBC Learning English companion with easy and standard lessons."
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
