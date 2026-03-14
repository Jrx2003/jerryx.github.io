"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Cloud,
  Brain,
  Search,
  ArrowRight,
  FolderOpen,
  FileText,
} from "lucide-react";

const knowledgeBases = [
  {
    id: "aicad",
    title: "AICAD",
    description: "CAD Agent 系统技术文档，包含 ACI 设计、迭代式建模、评估系统等核心技术",
    icon: Cpu,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    stats: "50+ 文档",
    categories: ["ACI 设计", "CAD 基础", "Agent 系统", "评估系统"],
  },
  {
    id: "cloud",
    title: "Cloud Computing",
    description: "云计算与云原生技术知识库，涵盖 Kubernetes、微服务、Serverless 等",
    icon: Cloud,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    stats: "30+ 文档",
    categories: ["Kubernetes", "微服务", "Serverless", "FinOps"],
  },
  {
    id: "llm",
    title: "LLM",
    description: "大语言模型算法与技术，包括 Transformer、RLHF、推理优化等",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    stats: "40+ 文档",
    categories: ["Transformer", "RLHF", "推理优化", "Agent"],
  },
  {
    id: "searchrec",
    title: "SearchRec",
    description: "搜索与推荐系统，从经典算法到深度学习推荐",
    icon: Search,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    stats: "35+ 文档",
    categories: ["推荐算法", "搜索排序", "GNN", "LLM4Rec"],
  },
];

const recentUpdates = [
  {
    title: "ACI 四大支柱",
    category: "AICAD",
    date: "2026-03-12",
    description: "Agent-Computer Interface 设计的核心原则详解",
  },
  {
    title: "Sub Agent 迭代系统",
    category: "AICAD",
    date: "2026-03-11",
    description: "迭代式建模流程的架构设计与实现",
  },
  {
    title: "Transformer 详解",
    category: "LLM",
    date: "2026-03-10",
    description: "注意力机制、位置编码与模型架构深入解析",
  },
];

export default function KnowledgeBasePage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">知识库</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            我的技术笔记与学习心得，基于 Obsidian 笔记系统自动同步
          </p>
        </motion.div>

        {/* Knowledge Base Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {knowledgeBases.map((kb, index) => (
              <motion.div
                key={kb.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${kb.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <kb.icon className={`h-6 w-6 ${kb.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{kb.title}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {kb.stats}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base mt-4">
                      {kb.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {kb.categories.map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            最近更新
          </h2>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <motion.div
                key={update.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{update.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {update.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold">{update.title}</h3>
                        <p className="text-muted-foreground">
                          {update.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sync Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <FolderOpen className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">内容同步说明</h3>
              <p className="text-muted-foreground text-sm">
                知识库内容从 Obsidian 笔记系统自动同步，每天凌晨 4 点更新。
                笔记中的 WikiLink 和 Markdown 格式会自动转换为网站格式。
                如需查看最新内容，请访问 GitHub 上的 note 仓库。
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
