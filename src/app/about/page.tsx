"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Code2,
  Music,
  Zap,
  Gamepad2,
  Heart,
  MapPin,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const education = [
  {
    school: "香港中文大学",
    degree: "硕士预录取",
    period: "2025 - 2027 (预计)",
    description: "继续深造，专注于人工智能与软件工程领域",
  },
  {
    school: "上海交通大学",
    degree: "本科",
    period: "2021 - 2025",
    description: "计算机科学与技术专业，扎实的编程基础与工程能力",
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
  },
];

const interests = [
  {
    icon: Music,
    title: "音乐剧",
    description:
      "音乐剧是我生活中不可或缺的一部分。无论是经典作品还是新创剧目，我都热衷于欣赏现场演出的独特魅力。音乐与戏剧的结合总能带给我无限的感动与启发。",
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: Zap,
    title: "F1 赛车",
    description:
      "速度与策略的完美结合让我着迷。关注每一场比赛，分析车队策略，感受赛车运动的激情。从赛道设计到工程师团队的协作，F1 展现的不仅是速度，更是人类工程学的巅峰。",
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    icon: Gamepad2,
    title: "杀戮尖塔2",
    description:
      "Roguelike 卡牌游戏的爱好者。在构建牌组的过程中锻炼策略思维，享受每一次通关的成就感。游戏设计中的平衡性与可重玩性也给了我很多关于系统设计的启发。",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    icon: Code2,
    title: "开源贡献",
    description:
      "热衷于参与开源社区，享受与他人协作解决问题的过程。通过 GitHub 分享代码，学习他人的优秀实践，不断提升自己的工程能力。",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-4">关于我</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            一个热爱技术与生活的开发者
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed mb-4">
                你好，我是徐劼瑞（Jerry），一名充满热情的软件开发者。目前在上海交通大学就读本科，并已获得香港中文大学的硕士预录取。
              </p>
              <p className="text-lg leading-relaxed mb-4">
                在 AICAD 的远程实习经历让我深入接触了 AI Agent 系统的开发，尤其是基于大语言模型的 CAD 智能建模系统。这段经历让我对 LLM 的应用有了更深刻的理解，也锻炼了我的系统架构能力。
              </p>
              <p className="text-lg leading-relaxed">
                我相信技术应该服务于人，而好的工程师不仅要写出优秀的代码，更要理解用户的需求和感受。在工作之余，我喜欢通过音乐剧、F1 赛车和游戏来丰富自己的生活。
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            教育经历
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <motion.div
                key={edu.school}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle>{edu.school}</CardTitle>
                        <CardDescription>{edu.degree}</CardDescription>
                      </div>
                      <Badge variant="outline">{edu.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{edu.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            工作经历
          </h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div>
                        <CardTitle>{exp.title}</CardTitle>
                        <CardDescription>{exp.company}</CardDescription>
                      </div>
                      <Badge variant="outline">{exp.period}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6" />
            兴趣爱好
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-lg ${interest.bgColor} flex items-center justify-center mb-4`}
                    >
                      <interest.icon className={`h-6 w-6 ${interest.color}`} />
                    </div>
                    <CardTitle>{interest.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {interest.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>目前位于上海，即将前往香港</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
