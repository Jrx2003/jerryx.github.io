"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Github,
  ExternalLink,
  Cpu,
  Boxes,
  Globe,
  GitBranch,
  Database,
  ArrowRight,
  Star,
} from "lucide-react";

const projects = [
  {
    title: "AICAD - CAD Agent 系统",
    description:
      "基于大语言模型的智能 CAD 建模系统。实现了 Agent-Computer Interface (ACI) 设计，支持迭代式建模、MCP 协议通信、多模态评估等核心功能。",
    icon: Cpu,
    color: "text-blue-400",
    bgColor: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
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
    color: "text-green-400",
    bgColor: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/20",
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
    color: "text-purple-400",
    bgColor: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/20",
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
    color: "text-amber-400",
    bgColor: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
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
    color: "text-red-400",
    bgColor: "from-red-500/20 to-rose-500/20",
    borderColor: "border-red-500/20",
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
              <Star className="w-4 h-4" />
              项目集
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">我的项目</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              从 AI Agent 系统到嵌入式开发，展示我的技术实践
            </p>
          </motion.div>

          {/* Featured Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              精选项目
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`glass rounded-2xl p-6 h-full border ${project.borderColor}`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.bgColor} flex items-center justify-center`}>
                          <project.icon className={`w-7 h-7 ${project.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          <span className="text-sm text-muted-foreground">Featured</span>
                        </div>
                      </div>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    </div>

                    <p className="text-muted-foreground mb-6">{project.description}</p>

                    <ul className="space-y-3 mb-6">
                      {project.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-3">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${project.color.replace('text-', 'bg-')}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium glass"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Other Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              其他项目
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`glass rounded-2xl p-6 h-full border ${project.borderColor} hover:bg-white/5 transition-colors`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.bgColor} flex items-center justify-center`}>
                        <project.icon className={`w-5 h-5 ${project.color}`} />
                      </div>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

                    <ul className="space-y-2 mb-4">
                      {project.details.slice(0, 2).map((detail, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className={`w-1 h-1 rounded-full mt-1 ${project.color.replace('text-', 'bg-')}`} />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full text-xs glass"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* GitHub CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <div className="glass rounded-2xl p-8 max-w-xl mx-auto">
              <Github className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">更多项目</h3>
              <p className="text-muted-foreground mb-6">
                在 GitHub 上查看我的更多开源项目和代码贡献
              </p>
              <a
                href="https://github.com/Jrx2003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
              >
                访问 GitHub
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
