"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Calendar,
  Tag,
  FolderOpen,
} from "lucide-react";
import { Cpu, Cloud, Brain, Search } from "lucide-react";

interface Document {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  tags: string[];
  category: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface CategoryPageClientProps {
  category: Category;
  documents: Document[];
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Cloud,
  Brain,
  Search,
};

export default function CategoryPageClient({
  category,
  documents,
}: CategoryPageClientProps) {
  const Icon = iconMap[category.icon] || FileText;

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      <div className="relative z-10 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/kb/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回知识库
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.bgColor} flex items-center justify-center`}
              >
                <Icon className={`w-8 h-8 ${category.color}`} />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">{category.name}</h1>
                <p className="text-muted-foreground mt-1">{category.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Documents List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                文档列表
                <span className="text-sm font-normal text-muted-foreground">
                  ({documents.length} 篇)
                </span>
              </h2>
            </div>

            {documents.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">暂无文档</h3>
                <p className="text-muted-foreground">
                  该分类下还没有文档，请稍后查看。
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/kb/${category.id}/${doc.slug}/`}>
                      <div className="glass rounded-xl p-5 hover:bg-white/5 transition-colors group">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="font-semibold text-lg mb-1 group-hover:text-foreground transition-colors">
                                  {doc.title}
                                </h3>
                                {doc.description && (
                                  <p className="text-muted-foreground text-sm line-clamp-2">
                                    {doc.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              {doc.date && (
                                <span className="inline-flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {doc.date}
                                </span>
                              )}
                              {doc.tags && doc.tags.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Tag className="w-3.5 h-3.5" />
                                  <div className="flex gap-1.5">
                                    {doc.tags.slice(0, 3).map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-0.5 rounded-full text-xs glass"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                    {doc.tags.length > 3 && (
                                      <span className="text-xs">
                                        +{doc.tags.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
