"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Zap,
  Gamepad2,
  Heart,
  Coffee,
  BookOpen,
  Calendar,
  Tag,
} from "lucide-react";

const blogCategories = [
  {
    id: "musical",
    title: "音乐剧",
    icon: Music,
    color: "text-pink-500",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    description: "音乐剧观后感与推荐",
  },
  {
    id: "f1",
    title: "F1 赛车",
    icon: Zap,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    description: "F1 比赛分析与车队动态",
  },
  {
    id: "gaming",
    title: "游戏",
    icon: Gamepad2,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    description: "游戏心得与攻略分享",
  },
  {
    id: "life",
    title: "随笔",
    icon: Coffee,
    color: "text-amber-500",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    description: "生活感悟与日常记录",
  },
];

const blogPosts = [
  {
    title: "杀戮尖塔2： roguelike 卡牌的新高度",
    category: "游戏",
    date: "2026-03-10",
    excerpt:
      "作为杀戮尖塔的忠实玩家，续作给我带来了全新的体验。新的角色、新的卡牌机制，以及更加丰富的遗物系统...",
    tags: ["杀戮尖塔2", "Roguelike", "游戏评测"],
  },
  {
    title: "F1 2026 赛季前瞻",
    category: "F1 赛车",
    date: "2026-03-05",
    excerpt:
      "新赛季即将开始，各支车队都做了哪些准备？新规下的赛车会有怎样的表现？让我来分析一下今年的看点...",
    tags: ["F1", "赛车", "2026赛季"],
  },
  {
    title: "音乐剧《汉密尔顿》观后感",
    category: "音乐剧",
    date: "2026-02-28",
    excerpt:
      "终于有机会现场观看这部改变音乐剧历史的作品。Hip-hop 与历史的结合，多元化的卡司阵容...",
    tags: ["汉密尔顿", "音乐剧", "观后感"],
  },
  {
    title: "关于成长的一些思考",
    category: "随笔",
    date: "2026-02-20",
    excerpt:
      "最近经历了一些事情，让我对生活有了新的认识。成长总是伴随着痛苦，但正是这些经历塑造了现在的我们...",
    tags: ["成长", "感悟", "生活"],
  },
];

export default function BlogPage() {
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
          <h1 className="text-4xl font-bold mb-4">博客</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            生活随笔与兴趣爱好，分享技术与生活之外的世界
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {blogCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 rounded-full ${cat.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <cat.icon className={`h-6 w-6 ${cat.color}`} />
                    </div>
                    <CardTitle className="text-lg">{cat.title}</CardTitle>
                    <CardDescription>{cat.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">最新文章</h2>
          <div className="space-y-6">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">{post.category}</Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground">{post.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">更多内容筹备中</h3>
              <p className="text-muted-foreground">
                我正在整理更多的技术笔记和生活随笔，敬请期待。
                如果你有感兴趣的话题，欢迎通过 GitHub 与我交流。
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
