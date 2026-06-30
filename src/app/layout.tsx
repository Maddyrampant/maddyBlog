import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeClientWrapper from "@/components/theme/ThemeClientWrapper";
import { I18nProvider } from "@/i18n/provider";
import "./globals.css";
import "@/themes/default/styles/theme.css";
import "@/themes/zoomg/styles/theme.css";
import "@/themes/madelin/styles/theme.css";
import "@/themes/zoomji/styles/theme.css";
import { themeManager } from "@/core/theme";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await themeManager.initialize();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
        suppressHydrationWarning
      >
        <I18nProvider>
          <ThemeClientWrapper>{children}</ThemeClientWrapper>
        </I18nProvider>
      </body>
    </html>
  );
}
