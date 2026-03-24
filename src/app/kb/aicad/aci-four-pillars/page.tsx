"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

export default function ACIFourPillarsPage() {
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
              href="/kb/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回知识库
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Tag className="w-4 h-4" />
                AICAD
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                2026-03-12
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                10 分钟阅读
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">ACI 四大支柱</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              Agent-Computer Interface 设计的核心原则详解
            </p>
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8 md:p-12"
          >
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">什么是 ACI？</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                ACI（Agent-Computer Interface）是连接大语言模型（LLM）与计算机系统的接口设计理念。
                与传统的 API 或 CLI 不同，ACI 专门为 AI Agent 设计，强调可观察性、可操作性和可逆性。
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">四大核心原则</h2>

              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-blue-400">1. Actionable（可操作）</h3>
                  <p className="text-muted-foreground">
                    LLM 发出离散、可组合的操作指令，而非完整的脚本。每个操作都是原子性的，
                    可以独立执行和验证。这使得 Agent 能够逐步构建解决方案，并在每一步进行验证。
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-green-400">2. Observable（可观察）</h3>
                  <p className="text-muted-foreground">
                    每个操作执行后，系统返回结构化的状态快照，包含执行结果、环境状态和相关元数据。
                    这使得 LLM 能够基于当前状态做出下一步决策，形成观察-思考-行动的循环。
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-amber-400">3. Reversible（可逆）</h3>
                  <p className="text-muted-foreground">
                    所有操作都可以被撤销或回滚。系统维护完整的操作历史，允许 Agent 在发现错误时
                    回退到之前的状态。这种容错机制对于复杂的自动化任务至关重要。
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2 text-purple-400">4. Composable（可组合）</h3>
                  <p className="text-muted-foreground">
                    操作可以引用和组合之前的结果。通过特征引用（Feature References），
                    复杂操作可以基于先前创建的对象进行构建，实现渐进式的任务完成。
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">在 CAD 中的应用</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                在 AICAD 项目中，ACI 四大支柱指导了整个 CAD Agent 系统的设计。
                例如，当 LLM 需要创建一个带孔的长方体时，它会发出一系列离散操作：
                创建草图 → 拉伸 → 创建孔 → 倒角。每个步骤都可以观察、回滚和修改。
              </p>

              <h2 className="text-2xl font-bold mb-4">总结</h2>
              <p className="text-muted-foreground leading-relaxed">
                ACI 四大支柱为 LLM Agent 与计算机系统的交互提供了一个稳健的设计框架。
                它不仅适用于 CAD 领域，也可以推广到其他需要 AI 自动化操作的场景。
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex items-center justify-between"
          >
            <Link
              href="/kb/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回知识库
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
