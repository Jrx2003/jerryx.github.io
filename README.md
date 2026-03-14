# Jerry Xu 个人网站

基于 Next.js 14 + shadcn/ui 构建的个人网站，托管于 GitHub Pages。

## 特性

- **现代设计** - 使用 Tailwind CSS 构建的响应式界面，支持暗黑/亮色主题切换
- **知识库同步** - 从 Obsidian 笔记系统自动同步内容
- **丰富内容** - 技术项目展示、知识库导航、生活博客
- **流畅动画** - 使用 Framer Motion 实现页面过渡和交互效果
- **SEO 优化** - 静态导出，利于搜索引擎索引

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS + shadcn/ui
- **动画**: Framer Motion
- **图标**: Lucide React
- **内容**: MDX + gray-matter
- **部署**: GitHub Actions → GitHub Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建静态站点
npm run build
```

## 项目结构

```
website/
├── .github/workflows/      # GitHub Actions 工作流
│   ├── sync-notes.yml      # 笔记同步工作流
│   └── deploy.yml          # 部署工作流
├── content/                # 同步的笔记内容（自动更新）
├── scripts/
│   └── sync-notes.js       # 笔记同步脚本
├── src/
│   ├── app/                # Next.js 页面
│   ├── components/         # React 组件
│   ├── lib/                # 工具函数
│   └── styles/             # 全局样式
└── public/                 # 静态资源
```

## 笔记同步

笔记从 [Obsidian 仓库](https://github.com/Jrx2003/note) 自动同步：

- **触发条件**: 每天凌晨 4 点 (UTC) 或手动触发
- **同步范围**: AICAD、Cloud Computing、LLM、SearchRec 知识库
- **转换规则**:
  - `[[文件名]]` → 相对链接
  - `![[图片.png]]` → 图片路径
  - Frontmatter 提取为文章元数据

## 自定义

### 修改个人信息

编辑 `src/app/page.tsx` 中的 Hero 部分和 `src/app/about/page.tsx` 中的个人介绍。

### 添加新项目

在 `src/app/projects/page.tsx` 中的 `projects` 数组添加新项目。

### 添加博客文章

在 `src/app/blog/page.tsx` 中的 `blogPosts` 数组添加新文章。

## 部署

网站通过 GitHub Actions 自动部署到 GitHub Pages：

1. 推送代码到 `main` 分支
2. 自动触发构建工作流
3. 构建完成后自动部署

访问地址: https://jrx2003.github.io

## License

MIT License - 自由使用和修改
