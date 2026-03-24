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
  ChevronDown,
  Music,
  Gamepad2,
  Trophy,
  Camera,
} from "lucide-react";
import { ParticleBackground, FloatingOrbs } from "@/components/home/ParticleBackground";
import { Typewriter } from "@/components/home/Typewriter";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "知识库",
    description: "技术笔记与学习心得",
    href: "/kb/",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Coffee,
    title: "博客",
    description: "生活随笔与兴趣爱好",
    href: "/blog/",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "关于我",
    description: "了解更多关于我的故事",
    href: "/about/",
    gradient: "from-purple-500 to-pink-500",
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

const interests = [
  {
    icon: Music,
    title: "音乐",
    description: "音乐剧与手风琴",
    color: "text-pink-400",
    bgGradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    icon: Camera,
    title: "摄影",
    description: "记录生活美好瞬间",
    color: "text-amber-400",
    bgGradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    icon: Trophy,
    title: "F1 赛车",
    description: "速度与策略的完美结合",
    color: "text-red-400",
    bgGradient: "from-red-500/20 to-orange-500/20",
  },
  {
    icon: Gamepad2,
    title: "游戏",
    description: "涉猎广泛的玩家",
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-indigo-500/20",
  },
];

const featuredProjects = [
  {
    title: "AICAD",
    description: "基于大语言模型的 CAD Agent 系统开发",
    tags: ["Python", "LangChain", "FastAPI", "CAD"],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Git Safety Agent",
    description: "智能 Git 操作安全检查工具",
    tags: ["TypeScript", "Node.js", "Git"],
    gradient: "from-blue-500 to-cyan-500",
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <ParticleBackground />
      <FloatingOrbs />

      {/* Gradient Background */}
      <div className="fixed inset-0 gradient-bg -z-10" />
      <div className="fixed inset-0 grid-pattern -z-10" />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                欢迎访问我的个人网站
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="gradient-text">Jerry Xu</span>
            </motion.h1>

            {/* Subtitle with Typewriter */}
            <motion.div variants={fadeInUp} className="text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-8">
              <Typewriter
                texts={[
                  "上海交通大学本科生",
                  "港中文硕士预录取",
                  "AICAD 远程实习生",
                  "CAD Agent 开发者",
                  "音乐剧爱好者",
                  "F1 赛车迷",
                ]}
                className="text-foreground/80"
                delay={2500}
              />
            </motion.div>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              专注于 AI Agent 系统开发，致力于用技术创造价值。
              <br className="hidden sm:block" />
              在代码与生活之间寻找平衡，做一个有趣的技术人。
            </motion.p>

            {/* Tech Stack */}
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-2 mb-12">
              {techStack.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="px-3 py-1 rounded-full text-xs font-medium glass hover:bg-white/10 transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/projects/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow"
                >
                  <span className="flex items-center gap-2">
                    查看项目
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              <Link href="/about/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full glass font-semibold hover:bg-white/10 transition-colors"
                >
                  了解更多
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs uppercase tracking-widest">滚动探索</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </section>

        {/* Quick Links Section */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">快速导航</h2>
              <p className="text-muted-foreground text-lg">
                探索我的技术世界与生活点滴
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={link.href}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="group relative h-full glass rounded-2xl p-6 hover:bg-white/5 transition-colors cursor-pointer overflow-hidden"
                    >
                      {/* Gradient Border Effect */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${link.gradient} opacity-5`} />

                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <link.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>

                      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-32 px-4 relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">精选项目</h2>
              <p className="text-muted-foreground text-lg">
                最近的技术探索与实践经验
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href="/projects/">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group relative glass rounded-2xl p-8 hover:bg-white/5 transition-all cursor-pointer overflow-hidden h-full"
                    >
                      {/* Gradient glow on hover */}
                      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity`} />

                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${project.gradient} text-white mb-4`}>
                        <Cpu className="w-3 h-3" />
                        Featured
                      </div>

                      <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                      <p className="text-muted-foreground mb-6">{project.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-md text-xs glass"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <Link href="/projects/">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  查看全部项目 →
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Interests Section */}
        <section className="py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">生活与兴趣</h2>
              <p className="text-muted-foreground text-lg">
                代码之外，我也是个有趣的人
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    className="glass rounded-2xl p-6 text-center h-full hover:bg-white/5 transition-colors"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${interest.bgGradient} flex items-center justify-center mx-auto mb-4`}>
                      <interest.icon className={`w-8 h-8 ${interest.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{interest.title}</h3>
                    <p className="text-sm text-muted-foreground">{interest.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub CTA */}
        <section className="py-32 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-12 text-center relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/20 blur-3xl" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Github className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">更多内容在 GitHub</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  查看我的开源项目、代码贡献和技术探索
                </p>
                <a
                  href="https://github.com/Jrx2003"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
                  >
                    访问 GitHub
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
