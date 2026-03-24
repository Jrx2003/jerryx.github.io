"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cpu,
  Cloud,
  Brain,
  Search,
  ArrowRight,
  FileText,
  Clock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

const knowledgeBases = [
  {
    id: "aicad",
    title: "AICAD",
    description: "CAD Agent 系统技术文档，包含 ACI 设计、迭代式建模、评估系统等核心技术",
    icon: Cpu,
    color: "text-blue-400",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
    stats: "50+ 文档",
    path: "/kb/aicad/",
    articles: [
      { title: "ACI 四大支柱", path: "/kb/aicad/aci-four-pillars/", date: "2026-03-12" },
      { title: "CAD Agent 迭代式演进方案", path: "/kb/aicad/iteration-design/", date: "2026-03-11" },
      { title: "MCP 协议实现详解", path: "/kb/aicad/mcp-protocol/", date: "2026-03-10" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    description: "云计算与云原生技术知识库，涵盖 Kubernetes、微服务、Serverless 等",
    icon: Cloud,
    color: "text-green-400",
    bgColor: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/20",
    stats: "30+ 文档",
    path: "/kb/cloud/",
    articles: [
      { title: "Kubernetes 架构详解", path: "/kb/cloud/kubernetes/", date: "2026-03-08" },
      { title: "微服务设计模式", path: "/kb/cloud/microservices/", date: "2026-03-05" },
      { title: "Serverless 最佳实践", path: "/kb/cloud/serverless/", date: "2026-03-01" },
    ],
  },
  {
    id: "llm",
    title: "LLM",
    description: "大语言模型算法与技术，包括 Transformer、RLHF、推理优化等",
    icon: Brain,
    color: "text-purple-400",
    bgColor: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/20",
    stats: "40+ 文档",
    path: "/kb/llm/",
    articles: [
      { title: "Transformer 详解", path: "/kb/llm/transformer/", date: "2026-03-10" },
      { title: "RLHF 深度解析", path: "/kb/llm/rlhf/", date: "2026-03-07" },
      { title: "推理优化技术", path: "/kb/llm/inference-optimization/", date: "2026-03-03" },
    ],
  },
  {
    id: "searchrec",
    title: "SearchRec",
    description: "搜索与推荐系统，从经典算法到深度学习推荐",
    icon: Search,
    color: "text-amber-400",
    bgColor: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
    stats: "35+ 文档",
    path: "/kb/searchrec/",
    articles: [
      { title: "推荐系统概述", path: "/kb/searchrec/recommendation-overview/", date: "2026-03-09" },
      { title: "Learning to Rank", path: "/kb/searchrec/learning-to-rank/", date: "2026-03-06" },
      { title: "GNN 在搜推中的应用", path: "/kb/searchrec/gnn-for-search/", date: "2026-02-28" },
    ],
  },
];

export default function KnowledgeBasePage() {
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
              <FileText className="w-4 h-4" />
              知识库
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">技术笔记</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              我的技术知识库，涵盖 AI、云计算、推荐系统等领域
            </p>
          </motion.div>

          {/* Knowledge Base Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {knowledgeBases.map((kb, index) => (
              <motion.div
                key={kb.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`glass rounded-2xl p-6 h-full border ${kb.borderColor}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${kb.bgColor} flex items-center justify-center`}>
                        <kb.icon className={`w-6 h-6 ${kb.color}`} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{kb.title}</h2>
                        <span className="text-sm text-muted-foreground">{kb.stats}</span>
                      </div>
                    </div>
                    <Link
                      href={kb.path}
                      className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      查看全部
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6">{kb.description}</p>

                  {/* Recent Articles */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      最近更新
                    </h3>
                    {kb.articles.map((article) => (
                      <Link
                        key={article.path}
                        href={article.path}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                            {article.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{article.date}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sync Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center"
          >
            <Clock className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">内容同步说明</h3>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto mb-4">
              知识库内容与 Obsidian 笔记系统同步。
              如需查看完整内容，请访问 GitHub 上的 note 仓库。
            </p>
            <a
              href="https://github.com/Jrx2003/note"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm"
            >
              查看完整笔记
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
