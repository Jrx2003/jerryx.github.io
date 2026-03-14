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
  description: "个人网站 - 上海交通大学本科生，AICAD远程实习生，专注于CAD Agent系统开发。热爱技术，享受生活。",
  keywords: ["Jerry Xu", "徐劼瑞", "上海交通大学", "AICAD", "CAD Agent", "AI", "个人网站", "Next.js", "TypeScript"],
  authors: [{ name: "Jerry Xu" }],
  metadataBase: new URL("https://jrx2003.github.io"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Jerry Xu",
    title: "Jerry Xu - 徐劼瑞",
    description: "上海交通大学本科生，AICAD远程实习生，专注于CAD Agent系统开发",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jerry Xu - 徐劼瑞",
    description: "上海交通大学本科生，AICAD远程实习生，专注于CAD Agent系统开发",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
