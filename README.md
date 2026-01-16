# CodyInsight - 知山数说

> 山高有径，数海有光

这是 Cody 的技术博客，使用 Next.js + MDX + Tailwind CSS 构建。

## 功能特性

- ✅ **多语言支持** - 中英文双语
- ✅ **暗黑模式** - 跟随系统或手动切换
- ✅ **MDX 支持** - Markdown + React 组件
- ✅ **代码高亮** - 自动语法高亮
- ✅ **评论系统** - Giscus (GitHub Discussions)
- ✅ **响应式设计** - 适配各种设备
- ✅ **SEO 优化** - Meta 标签、Sitemap

## 技术栈

- **框架**: Next.js 15+ (App Router)
- **语言**: TypeScript
- **内容**: Contentlayer + MDX
- **样式**: Tailwind CSS 4
- **主题**: next-themes
- **国际化**: next-intl
- **评论**: Giscus
- **部署**: Vercel

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 项目结构

```
cody-blog/
├── app/                    # Next.js App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── blog/         # 博客页面
│   │   └── about/        # 关于页面
│   ├── layout.tsx        # 根布局
│   └── providers.tsx     # 主题提供者
├── components/            # React 组件
│   ├── header.tsx
│   ├── footer.tsx
│   ├── post-card.tsx
│   └── ...
├── content/posts/         # MDX 文章
│   ├── zh-CN/           # 中文文章
│   └── en/              # 英文文章
├── lib/                 # 工具函数
├── messages/            # 翻译文件
└── public/              # 静态资源
```

## 添加新文章

1. 在 `content/posts/zh-CN/` 或 `content/posts/en/` 创建新的 `.mdx` 文件
2. 添加 frontmatter：

```yaml
---
title: "文章标题"
date: "2025-01-16"
summary: "文章摘要"
tags: ["标签1", "标签2"]
locale: "zh-CN"
---
```

3. 编写 MDX 内容
4. 保存文件，Contentlayer 会自动处理

## 配置 Giscus 评论

1. 在 GitHub 创建一个公开仓库用于存储评论
2. 访问 https://github.com/apps/giscus 安装 Giscus App
3. 获取配置参数
4. 更新 `components/giscus.tsx` 中的配置：

```typescript
<GiscusComponent
  repo="your-username/cody-blog"
  repoId="your-repo-id"
  category="Announcements"
  categoryId="your-category-id"
  // ...
/>
```

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 导入 GitHub 仓库
4. 点击 Deploy

## 许可证

MIT
