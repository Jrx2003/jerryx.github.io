"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

export default function TransformerPage() {
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
                LLM
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                2026-03-10
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-4 h-4" />
                15 分钟阅读
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Transformer 详解</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              注意力机制、位置编码与模型架构深入解析
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
              <h2 className="text-2xl font-bold mb-4">引言</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Transformer 架构自 2017 年提出以来，已经成为自然语言处理领域的主流架构，
                并扩展到计算机视觉、语音识别等多个领域。其核心创新在于完全基于注意力机制，
                摒弃了传统的循环结构，实现了高效的并行计算。
              </p>

              <h2 className="text-2xl font-bold mb-4 mt-8">核心组件</h2>

              <div className="space-y-6 mb-8">
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">自注意力机制（Self-Attention）</h3>
                  <p className="text-muted-foreground">
                    自注意力机制允许模型在处理每个位置时，关注输入序列中的所有位置，
                    并动态地分配注意力权重。这使得模型能够捕获长距离依赖关系。
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">多头注意力（Multi-Head Attention）</h3>
                  <p className="text-muted-foreground">
                    通过多组独立的注意力权重，模型可以在不同的表示子空间中学习不同的特征，
                    增强了模型的表达能力。
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">位置编码（Positional Encoding）</h3>
                  <p className="text-muted-foreground">
                    由于 Transformer 本身不包含序列顺序信息，需要通过位置编码来注入位置信息。
                    原始论文使用正弦和余弦函数，现代变体则使用可学习的位置嵌入。
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">前馈网络（FFN）</h3>
                  <p className="text-muted-foreground">
                    每个 Transformer 层包含一个两层的前馈网络，对每个位置独立应用相同的变换，
                    引入非线性能力。
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-4">架构变体</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                基于 Transformer 架构，研究者们提出了多种变体，包括 BERT（双向编码器）、
                GPT（自回归解码器）、T5（编码器-解码器）等。每种变体针对不同的任务进行了优化。
              </p>

              <h2 className="text-2xl font-bold mb-4">总结</h2>
              <p className="text-muted-foreground leading-relaxed">
                Transformer 的成功在于其优秀的并行化能力和对长距离依赖的建模能力。
                理解 Transformer 是掌握现代大语言模型的基础。
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
