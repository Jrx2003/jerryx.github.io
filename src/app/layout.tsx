import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: {
    default: "Jerry Xu - 徐劼瑞",
    template: "%s | Jerry Xu",
  },
  description: "个人网站 - 上海交通大学本科生，AICAD远程实习生，专注于CAD Agent系统开发",
  keywords: ["Jerry Xu", "徐劼瑞", "上海交通大学", "AICAD", "CAD Agent", "AI", "个人网站"],
  authors: [{ name: "Jerry Xu" }],
  metadataBase: new URL("https://jrx2003.github.io"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Jerry Xu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
