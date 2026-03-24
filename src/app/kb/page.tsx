"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  Cloud,
  Brain,
  Search,
  ArrowRight,
  BookOpen,
  FolderOpen,
  Calendar,
  Tag,
} from "lucide-react";
import { KB_CATEGORIES } from "@/lib/content";

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Cloud,
  Brain,
  Search,
};

const categories = KB_CATEGORIES.map(cat => ({
  ...cat,
  Icon: iconMap[cat.icon] || BookOpen,
}));

export default function KBPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      <div className="relative z-10 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              知识库
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">技术知识库</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              基于 Obsidian 笔记系统的技术知识管理，涵盖 AI Agent、云计算、大语言模型、搜索推荐等领域
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              知识领域
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/kb/${category.id}/`}>
                    <div className={`glass rounded-2xl p-6 h-full border ${category.borderColor} hover:bg-white/5 transition-colors group`}>
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.bgColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <category.Icon className={`w-7 h-7 ${category.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold">{category.name}</h3>
                            <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">
                            {category.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <FolderOpen className="w-3 h-3" />
                            浏览全部文档
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              知识库说明
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold">Obsidian 同步</h3>
                <p className="text-sm text-muted-foreground">
                  知识库内容直接与 Obsidian 笔记系统同步，保持最新状态
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold">标签分类</h3>
                <p className="text-sm text-muted-foreground">
                  使用标签系统组织内容，支持多维度检索与导航
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold">持续更新</h3>
                <p className="text-sm text-muted-foreground">
                  定期更新学习笔记、项目文档和技术总结
                </p>
              </div>
            </div>
          </motion.div>

          {/* GitHub Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <a
              href="https://github.com/Jrx2003/note"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              在 GitHub 上查看完整笔记仓库
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
