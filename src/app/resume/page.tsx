"use client";

import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Award, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const education = [
  {
    school: "香港中文大学",
    degree: "硕士",
    period: "2026.09 - 2028.06 (预计)",
    major: "计算机科学",
    status: "预录取",
  },
  {
    school: "上海交通大学",
    degree: "本科",
    period: "2022.08 - 2026.06",
    major: "电子与计算机工程",
    courses: "数据结构与算法、计算机组成原理、计算机视觉与深度学习、机器学习中的优化",
  },
  {
    school: "凯斯西储大学",
    degree: "交换生",
    period: "2025.01 - 2025.05",
    courses: "数据科学导论、全栈开发、Linux和脚本编程",
  },
];

const experience = [
  {
    title: "AI应用工程师实习生",
    company: "苏州比特无限智能科技有限公司",
    period: "2026.02 - 至今",
    highlights: [
      "ACI (Agent-Computer Interface) 系统开发：设计并实现基于离散动作的迭代式CAD环境",
      "实现ACI四大支柱：可操作（15个可组合CAD动作）、可观测（状态快照）、可回滚（动作历史）、可组合（特征引用）",
      "MCP (Model Context Protocol) 架构：实现MCP Server/Client，统一注册/调用CAD工具",
      "评估系统：Ground-Truth Benchmark评分、多模态评估流程（渲染图像+LLM-as-a-Judge）",
      "渲染与可视化：多视图渲染系统（等轴测/前/右/顶视图）、渲染回退诊断",
    ],
  },
  {
    title: "网络安全实习生",
    company: "上海计算机软件技术开发中心",
    period: "2024.08 - 2024.09",
    highlights: [
      "针对侧信道攻击中的加密信息泄露问题进行系统研究",
      "探索传统方法（PCA降维+模板攻击）在密钥恢复中的应用",
      "实现深度学习方法（CNN提取能耗迹线时序特征）",
      "创新性地应用Transformer架构于侧信道分析领域",
    ],
  },
];

const projects = [
  {
    name: "Git Safety Agent",
    description: "安全优先的本地 AI Agent，将自然语言任务转为结构化 Plan",
    tech: ["Python", "LangChain", "FAISS", "FastAPI"],
    link: "https://github.com/Jrx2003/git-safety-agent",
  },
  {
    name: "P2M 实时网格重建",
    description: "基于 Orbbec SDK + PCL + OpenGL 的RGB-D实时三维重建系统",
    tech: ["C++", "PCL", "OpenGL", "点云处理"],
    link: "https://github.com/Jrx2003/p2m_cpu",
  },
  {
    name: "Lang Reader",
    description: "视频跟读学习平台，支持视频时间点与笔记双向同步",
    tech: ["Vue", "Node.js", "MongoDB"],
    link: "https://github.com/Jrx2003/lang-reader",
  },
  {
    name: "md2slides",
    description: "Markdown 幻灯片生成器，支持双格式转换",
    tech: ["AWK", "Reveal.js", "LaTeX Beamer"],
    link: "https://github.com/Jrx2003/md2slides",
  },
];

const skills = {
  "AI/Agent": ["LangChain", "Pydantic", "Prompt Engineering", "MCP", "LLM应用"],
  "后端开发": ["FastAPI", "Streamlit", "Git", "Vim", "Docker"],
  "三维图形": ["CadQuery", "PCL", "OpenGL", "点云处理"],
  "编程语言": ["Python", "C/C++", "TypeScript", "Java"],
  "机器学习": ["PyTorch", "凸优化", "深度学习"],
  "嵌入式": ["STM32", "Verilog"],
  "数据分析": ["Pandas", "NumPy", "SQL", "Excel"],
};

const languages = [
  { name: "英语", level: "TOEFL 100/120" },
  { name: "日语", level: "N2（2025年12月通过）" },
];

export default function ResumePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      {/* Content */}
      <div className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
              <FileText className="w-4 h-4 text-blue-400" />
              简历
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">徐劼瑞</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              AI应用工程师 | 软件开发者
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/Jrx2003"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  GitHub
                </motion.button>
              </a>
              <Link href="/about/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  关于我
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Education */}
          <motion.section {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">教育经历</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={edu.school}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{edu.school}</h3>
                      <p className="text-muted-foreground">
                        {edu.degree} · {edu.major}
                        {edu.status && <span className="ml-2 text-emerald-400">({edu.status})</span>}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                      {edu.period}
                    </span>
                  </div>
                  {edu.courses && (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground/60">核心课程：</span>
                      {edu.courses}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Experience */}
          <motion.section {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">工作经历</h2>
            </div>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-400 mt-1">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Projects */}
          <motion.section {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">项目经历</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-5 hover:bg-white/5 transition-colors"
                >
                  <h3 className="font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    GitHub
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Skills */}
          <motion.section {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">技能</h2>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-sm font-medium text-foreground/60 mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((skill) => (
                        <span key={skill} className="text-sm px-2.5 py-1 rounded-full bg-white/5">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Languages */}
          <motion.section {...fadeInUp} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">语言能力</h2>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center justify-between">
                    <span className="font-medium">{lang.name}</span>
                    <span className="text-muted-foreground">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-6 text-center"
          >
            <p className="text-muted-foreground text-sm">
              完整简历请访问我的 GitHub 或联系本人获取
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
