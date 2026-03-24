"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Code2,
  Music,
  Zap,
  Gamepad2,
  Heart,
  MapPin,
  Calendar,
  Building2,
  Award,
  Camera,
  BookOpen,
  FileText,
} from "lucide-react";

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
    description: "计算机科学专业，预录取",
    icon: Award,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    school: "上海交通大学",
    degree: "本科",
    period: "2022.08 - 2026.06",
    description: "电子与计算机工程专业，核心课程：数据结构与算法、计算机组成原理、计算机视觉与深度学习、机器学习中的优化",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    school: "凯斯西储大学",
    degree: "交换生",
    period: "2025.01 - 2025.05",
    description: "核心课程：数据科学导论、全栈开发、Linux和脚本编程",
    icon: GraduationCap,
    gradient: "from-amber-500 to-orange-500",
  },
];

const experience = [
  {
    title: "AI应用工程师实习生",
    company: "苏州比特无限智能科技有限公司",
    period: "2026.02 - 至今",
    description:
      "ACI (Agent-Computer Interface) 系统开发：设计并实现基于离散动作的迭代式CAD环境，实现ACI四大支柱（可操作、可观测、可回滚、可组合）。MCP架构实现与评估系统开发，包括Ground-Truth Benchmark评分、多模态评估流程。",
    skills: ["Python", "FastAPI", "LangChain", "CAD", "LLM", "MCP"],
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "网络安全实习生",
    company: "上海计算机软件技术开发中心",
    period: "2024.08 - 2024.09",
    description:
      "针对侧信道攻击中的加密信息泄露问题，系统探索多种模型方案：传统方法（PCA降维+模板攻击）、深度学习方法（CNN卷积神经网络提取能耗迹线时序特征）、以及Transformer架构在此领域的创新性应用。",
    skills: ["Python", "PyTorch", "CNN", "Transformer", "网络安全"],
    icon: Briefcase,
    gradient: "from-blue-500 to-indigo-500",
  },
];

const interests = [
  {
    icon: Music,
    title: "音乐",
    description:
      "音乐剧是我生活中不可或缺的一部分，无论是经典作品还是新创剧目，现场演出的独特魅力总能带给我无限感动。同时我也是手风琴爱好者，学习多年，音乐是我表达情感的重要方式。",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/20",
  },
  {
    icon: Camera,
    title: "摄影",
    description:
      "热爱用镜头记录生活中的美好瞬间。无论是城市风光、自然景观还是人文纪实，摄影让我学会用不同的视角观察世界，发现平凡中的不平凡。",
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/20",
  },
  {
    icon: Zap,
    title: "F1 赛车",
    description:
      "速度与策略的完美结合让我着迷。关注每一场比赛，分析车队策略，感受赛车运动的激情。从赛道设计到工程师团队的协作，F1 展现的不仅是速度，更是人类工程学的巅峰。",
    color: "text-red-400",
    bgGradient: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/20",
  },
  {
    icon: Gamepad2,
    title: "游戏",
    description:
      "游戏涉猎广泛，从策略类到竞技类都有涉足。玩过皇室战争、部落冲突、王者荣耀、绝地求生、战地、文明6、我的世界、泰拉瑞亚、GTA5、杀戮尖塔等众多游戏。游戏设计中的平衡性与可重玩性给了我很多关于系统设计的启发。",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/20",
  },
  {
    icon: BookOpen,
    title: "历史",
    description:
      "对人类历史充满好奇心，喜欢探索不同时期、不同文明的发展脉络。历史让我理解当下的由来，也为思考未来提供借鉴。",
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    borderColor: "border-emerald-500/20",
  },
  {
    icon: Code2,
    title: "动漫",
    description:
      "资深动漫爱好者，从经典作品到当季新番都有关注。优秀的动画作品不仅是娱乐，更是艺术表达和故事讲述的绝佳载体。",
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/20",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      {/* Content */}
      <div className="relative z-10 py-32 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
              <Heart className="w-4 h-4 text-red-400" />
              关于我
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="gradient-text">我的故事</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              一个热爱技术与生活的开发者
            </p>
          </motion.div>

          {/* Introduction Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 mb-20"
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                你好，我是<span className="text-foreground font-medium">徐劼瑞（Jerry）</span>，
                一名充满热情的软件开发者。上海交通大学电子与计算机工程专业本科在读（2022-2026），
                已获香港中文大学计算机科学硕士预录取（2026秋季入学）。
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                2025年初，我在凯斯西储大学进行了为期一学期的交换学习，接触了数据科学、全栈开发和Linux系统编程。
                目前我在苏州比特无限智能科技有限公司担任AI应用工程师实习生，深入参与CAD Agent系统的开发，
                专注于ACI（Agent-Computer Interface）架构设计和MCP协议实现。
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                我相信技术应该服务于人，而好的工程师不仅要写出优秀的代码，更要理解用户的需求和感受。
                在工作之余，我热爱音乐（手风琴、音乐剧）、摄影、F1赛车、游戏和动漫，
                这些爱好让我的生活更加丰富多彩。
              </p>
            </div>
          </motion.div>

          {/* Education Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">教育经历</h2>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-pink-500/30 to-transparent" />

              <div className="space-y-8">
                {education.map((edu, index) => (
                  <motion.div
                    key={edu.school}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-16"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-4 top-6 w-4 h-4 rounded-full bg-gradient-to-br ${edu.gradient} ring-4 ring-background`} />

                    <div className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${edu.gradient} flex items-center justify-center`}>
                            <edu.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{edu.school}</h3>
                            <p className="text-muted-foreground">{edu.degree}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{edu.period}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{edu.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">工作经历</h2>
            </div>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-6 md:p-8 hover:bg-white/5 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exp.gradient} flex items-center justify-center`}>
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                        <p className="text-lg text-muted-foreground">{exp.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{exp.period}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-xs font-medium glass hover:bg-white/10 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">兴趣爱好</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interests.map((interest, index) => (
                <motion.div
                  key={interest.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className={`glass rounded-2xl p-6 h-full hover:bg-white/5 transition-all border ${interest.borderColor}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${interest.bgGradient} flex items-center justify-center mb-4`}>
                      <interest.icon className={`w-7 h-7 ${interest.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{interest.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {interest.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills & Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">技能与语言</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  技术栈
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "FastAPI", "LangChain", "PyTorch", "React", "Next.js", "TypeScript", "Docker", "Git"].map((skill) => (
                    <span key={skill} className="px-3 py-1.5 rounded-full text-sm glass">
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  语言能力
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">英语</span>
                    <span className="font-medium">TOEFL 100/120</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">日语</span>
                    <span className="font-medium">N2（2025年12月通过）</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">目前位于上海，即将前往香港</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
