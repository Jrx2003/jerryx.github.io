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
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const education = [
  {
    school: "香港中文大学",
    degree: "硕士预录取",
    period: "2025 - 2027 (预计)",
    description: "继续深造，专注于人工智能与软件工程领域",
    icon: Award,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    school: "上海交通大学",
    degree: "本科",
    period: "2021 - 2025",
    description: "计算机科学与技术专业，扎实的编程基础与工程能力",
    icon: GraduationCap,
    gradient: "from-blue-500 to-cyan-500",
  },
];

const experience = [
  {
    title: "远程实习生",
    company: "AICAD",
    period: "2025 - 至今",
    description:
      "参与 CAD Agent 系统的开发，基于大语言模型实现智能 CAD 建模。负责 Agent 架构设计、MCP 协议实现、迭代式建模流程等核心功能。",
    skills: ["Python", "FastAPI", "LangChain", "CAD", "LLM"],
    icon: Briefcase,
    gradient: "from-emerald-500 to-teal-500",
  },
];

const interests = [
  {
    icon: Music,
    title: "音乐剧",
    description:
      "音乐剧是我生活中不可或缺的一部分。无论是经典作品还是新创剧目，我都热衷于欣赏现场演出的独特魅力。音乐与戏剧的结合总能带给我无限的感动与启发。",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/20",
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
    title: "杀戮尖塔",
    description:
      "Roguelike 卡牌游戏的爱好者。在构建牌组的过程中锻炼策略思维，享受每一次通关的成就感。游戏设计中的平衡性与可重玩性也给了我很多关于系统设计的启发。",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/20",
  },
  {
    icon: Code2,
    title: "开源贡献",
    description:
      "热衷于参与开源社区，享受与他人协作解决问题的过程。通过 GitHub 分享代码，学习他人的优秀实践，不断提升自己的工程能力。",
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
                一名充满热情的软件开发者。目前在上海交通大学就读本科，并已获得香港中文大学的硕士预录取。
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                在 AICAD 的远程实习经历让我深入接触了 AI Agent 系统的开发，尤其是基于大语言模型的 CAD 智能建模系统。
                这段经历让我对 LLM 的应用有了更深刻的理解，也锻炼了我的系统架构能力。
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                我相信技术应该服务于人，而好的工程师不仅要写出优秀的代码，更要理解用户的需求和感受。
                在工作之余，我喜欢通过音乐剧、F1 赛车和游戏来丰富自己的生活。
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
