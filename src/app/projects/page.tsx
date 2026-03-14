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
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  Cpu,
  Boxes,
  Globe,
  GitBranch,
  Database,
  Brain,
} from "lucide-react";

const projects = [
  {
    title: "AICAD - CAD Agent 系统",
    description:
      "基于大语言模型的智能 CAD 建模系统。实现了 Agent-Computer Interface (ACI) 设计，支持迭代式建模、MCP 协议通信、多模态评估等核心功能。",
    icon: Cpu,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    tags: ["Python", "FastAPI", "LangChain", "CAD", "LLM", "MCP"],
    githubUrl: "https://github.com/Jrx2003",
    featured: true,
    details: [
      "设计并实现了 ACI 四大支柱：Actionable、Observable、Reversible、Composable",
      "开发了 Sub Agent 迭代运行时系统，支持异步动作执行与状态管理",
      "实现了基于 MCP 协议的 Sandbox 通信机制",
      "构建了多模态评估系统，支持 LLM-as-a-Judge 自动评分",
    ],
  },
  {
    title: "Git Safety Agent",
    description:
      "智能代码安全检测 Agent，基于 LLM 实现代码审查与安全漏洞检测。集成 Git 工作流，在提交前自动扫描潜在风险。",
    icon: GitBranch,
    iconColor: "text-green-500",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    tags: ["Python", "Git", "LLM", "Security", "CLI"],
    githubUrl: "https://github.com/Jrx2003",
    featured: true,
    details: [
      "基于 AST 分析与 LLM 推理的混合检测策略",
      "支持多种编程语言的安全规则检测",
      "Git 钩子集成，实现提交前自动扫描",
      "可配置的规则引擎，支持自定义检测规则",
    ],
  },
  {
    title: "点云处理系统",
    description:
      "基于深度学习的点云数据处理与分析系统。实现了点云分割、分类、重建等核心算法，应用于 3D 视觉场景理解。",
    icon: Database,
    iconColor: "text-purple-500",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    tags: ["Python", "PyTorch", "Open3D", "CUDA", "3D Vision"],
    githubUrl: "https://github.com/Jrx2003",
    featured: false,
    details: [
      "实现了 PointNet、PointNet++、DGCNN 等经典点云网络",
      "CUDA 加速的点云预处理管道",
      "支持大规模点云的分布式处理",
      "可视化工具集成，便于结果分析",
    ],
  },
  {
    title: "语言学习网站",
    description:
      "个性化语言学习平台，结合间隔重复算法与 AI 辅助学习。支持多语言学习路径规划与智能内容推荐。",
    icon: Globe,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    githubUrl: "https://github.com/Jrx2003",
    featured: false,
    details: [
      "基于 SM-2 算法的间隔重复系统",
      "AI 驱动的个性化学习路径推荐",
      "实时学习进度追踪与数据分析",
      "支持多种语言的学习内容管理",
    ],
  },
  {
    title: "嵌入式物联网系统",
    description:
      "基于 STM32 的物联网设备管理系统。实现了设备远程监控、数据采集、边缘计算等功能。",
    icon: Boxes,
    iconColor: "text-red-500",
    iconBg: "bg-red-100 dark:bg-red-900/30",
    tags: ["C/C++", "STM32", "MQTT", "FreeRTOS", "IoT"],
    githubUrl: "https://github.com/Jrx2003",
    featured: false,
    details: [
      "低功耗设计，支持电池供电长期运行",
      "MQTT 协议实现云端通信",
      "FreeRTOS 实时操作系统集成",
      "OTA 固件升级功能",
    ],
  },
];

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

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
          <h1 className="text-4xl font-bold mb-4">项目集</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            展示我的技术项目与实习经历，从 AI Agent 系统到嵌入式开发
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">精选项目</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${project.iconBg} flex items-center justify-center`}
                      >
                        <project.icon
                          className={`h-6 w-6 ${project.iconColor}`}
                        />
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Github className="h-4 w-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-2 mb-4 flex-1">
                      {project.details.map((detail, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">其他项目</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-lg ${project.iconBg} flex items-center justify-center`}
                      >
                        <project.icon
                          className={`h-5 w-5 ${project.iconColor}`}
                        />
                      </div>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Github className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-1 mb-4 flex-1">
                      {project.details.slice(0, 2).map((detail, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {project.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            更多项目请在 GitHub 上查看
          </p>
          <a
            href="https://github.com/Jrx2003"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              访问 GitHub
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
