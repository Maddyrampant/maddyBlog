import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeClientWrapper from "@/components/theme/ThemeClientWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "maddyBlog",
    template: "%s | maddyBlog",
  },
  description: "A modern blogging platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <ThemeClientWrapper>{children}</ThemeClientWrapper>
      </body>
    </html>
  );
}
