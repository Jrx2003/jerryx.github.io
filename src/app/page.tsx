"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  BookOpen,
  Coffee,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  Zap,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const quickLinks = [
  {
    icon: Code2,
    title: "项目",
    description: "探索我的技术项目与实习经历",
    href: "/projects/",
    color: "text-blue-500",
  },
  {
    icon: BookOpen,
    title: "知识库",
    description: "技术笔记与学习心得",
    href: "/kb/",
    color: "text-green-500",
  },
  {
    icon: Coffee,
    title: "博客",
    description: "生活随笔与兴趣爱好",
    href: "/blog/",
    color: "text-amber-500",
  },
  {
    icon: Sparkles,
    title: "关于我",
    description: "了解更多关于我的故事",
    href: "/about/",
    color: "text-purple-500",
  },
];

const techStack = [
  "Python",
  "FastAPI",
  "LangChain",
  "FAISS",
  "PyTorch",
  "React",
  "Next.js",
  "TypeScript",
  "Docker",
  "Kubernetes",
];

const featuredContent = [
  {
    title: "AICAD 项目",
    category: "项目",
    description: "基于大语言模型的 CAD Agent 系统开发",
    date: "2026-03",
  },
  {
    title: "CAD Agent 技术详解",
    category: "技术",
    description: "深入解析 CAD Agent 的架构设计与实现",
    date: "2026-03",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={fadeIn} className="space-y-2">
              <Badge variant="secondary" className="mb-4">
                👋 欢迎访问我的个人网站
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                Jerry Xu
                <span className="text-muted-foreground"> / </span>
                徐劼瑞
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] mx-auto">
                上海交通大学本科生 · AICAD远程实习生
                <br />
                <span className="text-lg">
                  专注于 CAD Agent 系统开发
                </span>
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-2 mt-8"
            >
              {techStack.map((tech) => (
                <Badge key={tech} variant="outline" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 mt-10"
            >
              <Link href="/projects/">
                <Button size="lg" className="gap-2">
                  查看项目
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about/">
                <Button size="lg" variant="outline">
                  了解更多
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">快速导航</h2>
            <p className="text-muted-foreground">
              探索我的技术世界与生活点滴
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div
                        className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <link.icon className={`h-6 w-6 ${link.color}`} />
                      </div>
                      <CardTitle>{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">精选内容</h2>
            <p className="text-muted-foreground">
              最近的技术文章与项目更新
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {featuredContent.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.date}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">生活与兴趣</h2>
            <p className="text-muted-foreground">
              代码之外，我也是个有趣的人
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-pink-500" />
                  </div>
                  <CardTitle>音乐剧</CardTitle>
                  <CardDescription>
                    热爱音乐剧，享受现场演出的魅力
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle>F1 赛车</CardTitle>
                  <CardDescription>
                    速度与激情的完美结合
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="text-center h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>杀戮尖塔</CardTitle>
                  <CardDescription>
                    Roguelike 卡牌游戏的忠实玩家
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GitHub CTA */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">更多内容</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              在 GitHub 上查看我的开源项目和代码贡献
            </p>
            <a
              href="https://github.com/Jrx2003"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-5 w-5" />
                访问 GitHub
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
