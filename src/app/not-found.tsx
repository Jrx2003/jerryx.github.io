"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      <div className="relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-lg mx-auto"
        >
          {/* 404 Number */}
          <div className="relative mb-8">
            <span className="text-[150px] sm:text-[200px] font-bold gradient-text leading-none">
              404
            </span>
            <div className="absolute inset-0 blur-3xl bg-purple-500/20 -z-10" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            页面未找到
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Home className="w-4 h-4" />
              返回首页
            </Link>
            <Link
              href="/kb/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <Search className="w-4 h-4" />
              浏览知识库
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
