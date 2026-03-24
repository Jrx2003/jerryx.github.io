"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Music,
  Zap,
  Gamepad2,
  Heart,
  Coffee,
  BookOpen,
  Calendar,
  ArrowRight,
  Tag,
} from "lucide-react";

const blogCategories = [
  {
    id: "musical",
    title: "音乐剧",
    icon: Music,
    color: "text-pink-400",
    bgColor: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/20",
    description: "音乐剧观后感与推荐",
  },
  {
    id: "f1",
    title: "F1 赛车",
    icon: Zap,
    color: "text-red-400",
    bgColor: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/20",
    description: "F1 比赛分析与车队动态",
  },
  {
    id: "gaming",
    title: "游戏",
    icon: Gamepad2,
    color: "text-purple-400",
    bgColor: "from-purple-500/20 to-indigo-500/20",
    borderColor: "border-purple-500/20",
    description: "游戏心得与攻略分享",
  },
  {
    id: "life",
    title: "随笔",
    icon: Coffee,
    color: "text-amber-400",
    bgColor: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/20",
    description: "生活感悟与日常记录",
  },
];

const blogPosts = [
  {
    title: "杀戮尖塔2： roguelike 卡牌的新高度",
    category: "游戏",
    categoryId: "gaming",
    date: "2026-03-10",
    excerpt:
      "作为杀戮尖塔的忠实玩家，续作给我带来了全新的体验。新的角色、新的卡牌机制，以及更加丰富的遗物系统...",
    tags: ["杀戮尖塔2", "Roguelike", "游戏评测"],
  },
  {
    title: "F1 2026 赛季前瞻",
    category: "F1 赛车",
    categoryId: "f1",
    date: "2026-03-05",
    excerpt:
      "新赛季即将开始，各支车队都做了哪些准备？新规下的赛车会有怎样的表现？让我来分析一下今年的看点...",
    tags: ["F1", "赛车", "2026赛季"],
  },
  {
    title: "音乐剧《汉密尔顿》观后感",
    category: "音乐剧",
    categoryId: "musical",
    date: "2026-02-28",
    excerpt:
      "终于有机会现场观看这部改变音乐剧历史的作品。Hip-hop 与历史的结合，多元化的卡司阵容...",
    tags: ["汉密尔顿", "音乐剧", "观后感"],
  },
  {
    title: "关于成长的一些思考",
    category: "随笔",
    categoryId: "life",
    date: "2026-02-20",
    excerpt:
      "最近经历了一些事情，让我对生活有了新的认识。成长总是伴随着痛苦，但正是这些经历塑造了现在的我们...",
    tags: ["成长", "感悟", "生活"],
  },
];

export default function BlogPage() {
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
              <BookOpen className="w-4 h-4" />
              博客
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              <span className="gradient-text">生活与兴趣</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              分享技术与生活之外的世界
            </p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              分类
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blogCategories.map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`glass rounded-2xl p-6 text-center h-full border ${cat.borderColor} hover:bg-white/5 transition-colors cursor-pointer group`}>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <cat.icon className={`w-7 h-7 ${cat.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Blog Posts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              最新文章
            </h2>
            <div className="space-y-6">
              {blogPosts.map((post, index) => {
                const category = blogCategories.find(c => c.id === post.categoryId);
                return (
                  <motion.div
                    key={post.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium glass ${category?.color || ''}`}>
                            {post.category}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-foreground transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground">{post.excerpt}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full text-xs glass text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="glass rounded-2xl p-8 text-center max-w-2xl mx-auto">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">更多内容筹备中</h3>
              <p className="text-muted-foreground mb-6">
                我正在整理更多的技术笔记和生活随笔，敬请期待。
                如果你有感兴趣的话题，欢迎通过 GitHub 与我交流。
              </p>
              <a
                href="https://github.com/Jrx2003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/10 transition-colors"
              >
                联系我
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
