"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  FileText,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Document {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  tags: string[];
  category: string;
  categoryId: string;
  content: string;
  filePath: string;
}

interface DocumentPageClientProps {
  document: Document;
}

export default function DocumentPageClient({ document }: DocumentPageClientProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      <div className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href={`/kb/${document.categoryId}/`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回 {document.category}
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full glass">
                <FileText className="w-4 h-4" />
                {document.category}
              </span>
              {document.date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {document.date}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.ceil(document.content.length / 500)} 分钟阅读
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">{document.title}</span>
            </h1>

            {document.description && (
              <p className="text-xl text-muted-foreground">
                {document.description}
              </p>
            )}

            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-sm glass text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 md:p-10"
          >
            <article className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mt-8 mb-4 pb-2 border-b border-white/10">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="px-1.5 py-0.5 rounded bg-white/10 text-sm font-mono">
                        {children}
                      </code>
                    ) : (
                      <pre className="p-4 rounded-xl bg-black/30 overflow-x-auto mb-4">
                        <code className={`${className} text-sm font-mono`}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-500 pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-4"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="w-full border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-white/5">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="border border-white/10 px-4 py-2 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-white/10 px-4 py-2 text-muted-foreground">
                      {children}
                    </td>
                  ),
                  hr: () => <hr className="border-white/10 my-8" />,
                }}
              >
                {document.content}
              </ReactMarkdown>
            </article>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex items-center justify-between"
          >
            <Link
              href={`/kb/${document.categoryId}/`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回列表
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
