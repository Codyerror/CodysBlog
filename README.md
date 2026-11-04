# CodyLink

> notes, code & cats

Cody 的笔记本。文章就是仓库里一堆 `.mdx` 纯文本文件，没有数据库、没有 CMS，写完提交 Git 就发布。

站点只有一个名字：**CodyLink**（没有中文别名，中英两版都显示它）。**默认语言是英文**，访问根路径会跳到 `/en`；右上角「中 / EN」可切到中文。

技术栈：**Next.js 14.2.35（App Router）+ TypeScript + Contentlayer / MDX + Tailwind CSS 4 + next-themes**，评论用 Giscus，部署在 Vercel。页面上的猫全是内联 SVG（EveOneCat / motions.cat 手绘风），不依赖图片或外部字体。

---

## 一、日常更新（最常用，先看这里）

### 1. 本地预览

```bash
npm install          # 第一次或依赖变动时
npm run dev          # 打开 http://localhost:3000
```

默认会跳转到 `/en`。改文章、改样式、改文案都会即时刷新。

### 2. 新建一篇文章（推荐：一条命令）

```bash
npm run new:post -- --slug my-second-post --title "My second post" --tags "data,notes"
npm run new:post -- --locale zh-CN --slug 第二篇 --title "第二篇文章"
```

脚本会生成 `content/posts/en/my-second-post.mdx`（**默认英文目录**），含完整 frontmatter 与示例正文，并打印预览地址。

可选参数：`--locale`（`en` / `zh-CN`，默认 `en`）、`--slug`、`--title`、`--summary`、`--tags`（逗号分隔）、`--date`（`YYYY-MM-DD`）。不填 `--slug` 时由标题自动生成，中文标题建议显式传英文 slug。

### 3. 也可以直接手写文件

在 `content/posts/en/`（或 `content/posts/zh-CN/`）新建 `.mdx`，文件名就是网址里的 slug：

```
content/posts/en/my-second-post.mdx  →  /en/blog/my-second-post
```

文件模板：

```mdx
---
title: "My second post"
date: "2026-11-04"
summary: "One line about what this post is about."
tags: ["data", "notes"]
locale: "en"
cover: "/images/cover.jpg"
draft: false
---

## A heading

Body text supports Markdown.

```python
print("code blocks get a copy button")
```

> Quotes, tables and task lists all work.
```

> 上面示例里的三反引号在真实文件中不要转义，这里只是为了能嵌套展示。

### 4. frontmatter 字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 文章标题，同时也是浏览器标签页标题 |
| `date` | ✅ | `YYYY-MM-DD`，**必须加引号**，决定排序与 sitemap 的 lastModified |
| `locale` | ✅ | `en` 或 `zh-CN`，**要和所在目录一致**，否则该语言列表里看不到 |
| `summary` | 建议 | 列表卡片摘要、页面 description、OG 分享描述 |
| `tags` | 可选 | 字符串数组，自动生成标签页与筛选器 |
| `cover` | 可选 | 封面图路径，图片放 `public/images/`，填 `/images/xxx.jpg`；不填则卡片自动用一只猫 |
| `draft` | 可选 | `true` 时全站隐藏（但文件仍在仓库里），写完删掉这行即可发布 |

新增字段（如 `series`、`updated`）需要同步修改 `contentlayer.config.ts` 的 `fields`。

### 5. 发布到线上

```bash
git add content/posts && git commit -m "post: second one" && git push
```

Vercel 检测到推送会自动构建。构建时 Contentlayer 重新扫描所有 `.mdx`，**sitemap、RSS、标签页、文章上下篇、首页统计全部自动更新，不用手工维护任何索引文件**。

### 6. 图片怎么放

放进 `public/images/`，在文章里写 `![说明](/images/xxx.png)` 或填到 `cover`。建议压到 200KB 以内、宽 1200px 左右；封面比例 16:9 最适合分享卡片。不设封面也没关系，卡片会随机挑一只猫的姿势。

### 7. 中英双语

两种语言放在各自目录，`locale` 字段对应。slug 可以相同（`/en/blog/hello` 与 `/zh-CN/blog/hello`），页头「EN / 中」按钮会在两个版本之间切换并保留当前路径。界面文案在 `messages/en.json` 和 `messages/zh-CN.json`，**改文案两个文件都要改**，缺 key 时页面会直接显示 key 名，很容易发现。

---

## 二、换猫：四种方式，从省事到彻底

内置猫是 `components/cats.tsx` 里 10 个内联 SVG 组件，画风参考 [motions.cat / EveOneCat](http://www.motions.cat/)：淡奶黄平涂、深紫褐手绘粗描边、点眼 + `ω` 小嘴、软塌塌的一坨「液体猫」。想换成自己的猫，按需要选一种：

| 想做什么 | 用哪种 | 要写代码吗 |
|---|---|---|
| 改毛色 / 描边、改猫的名字台词 | 方式 1 | 只改配置和 CSS 变量 |
| **放自己猫的照片 / GIF，全站替换** | **方式 2（推荐）** | **不用，放图 + 改 2 行** |
| 只改某一只猫的画法、加新姿势 | 方式 3 | 改 SVG |
| 整库换成另一套插画 | 方式 4 | 改 `cats.tsx` |

### 方式 1｜只改配色和名字

- `app/globals.css` 顶部 `--cat-*` 变量有**两套**（亮色约第 24 行、暗色约第 57 行，两套都要改）。常用：`--cat-fur` 毛色、`--cat-line` 描边、`--cat-belly` 肚子和爪子、`--cat-inner` 耳朵内侧、`--cat-fish` / `--cat-box`。
- `lib/site-config.ts`：`cat.name` 名字、`cat.title` 职位、`catLines` 摸猫时说的话、`slogans` 点站名冒出的短句。
- 暗色主题下内置猫会自动变成浅米线稿猫，靠的就是那套暗色变量。

### 方式 2｜放一张自己的图，全站替换（零代码，推荐）

**三步：**

1. 把图片放进 `public/cats/`，比如 `public/cats/mochi.gif`。
2. 打开 `lib/site-config.ts`，找到文件顶部的 `catArtwork`，改两行：

   ```ts
   const catArtwork: CatArtworkConfig = {
     enabled: true,                 // false → true
     src: '/cats/mochi.gif',       // 填你的图
     // ...下面都不用动
   }
   ```

3. `npm run dev` 打开 `http://localhost:3000/en` 看效果，满意后 `git add . && git commit -m "cat: ..." && git push`。

> 路径写 **`public/` 之后的绝对路径**，不带 `public`，大小写必须和文件名完全一致。项目自带 `public/cats/my-cat.svg` 示例图：先把 `enabled` 改成 `true` 就能验证换图通道是否工作，之后再覆盖成自己的图。

**图片规格**：png / jpg / webp / svg / **gif（动图会自动循环播放，最适合 motions.cat 那种猫）**；透明背景最省心；接近正方形、边长 400–800 px、单张尽量 < 500 KB（GIF < 2 MB）。图按 `contain` 等比居中、不会裁切，但各位置占位比例不同（见下表），方图留白最少。

**只换某几只、其余保留手绘猫**：把 `src` 留空 `''`，只给 `variants` 里需要的位置填路径，没填的位置继续用内置 SVG。例如只把首页大猫换成真猫照片：

```ts
enabled: true,
src: '',
variants: { face: '', sitting: '/cats/real-cat.jpg', loaf: '', sleep: '', peek: '', box: '', walk: '', card: '' },
```

**按位置指定不同的图**（`variants` 的 key，留空回退到 `src`）：

| key | 出现在哪 | 占位比例 |
|---|---|---|
| `face` | Logo、页脚、关于页标题旁的小猫头 | 100:92 |
| `sitting` | 首页 Hero 大猫、关于页工牌猫 | 170:190 |
| `loaf` | 目录顶部、文末面包猫、首页便签 | 170:120 |
| `sleep` | 空结果、标签页、首页空状态 | 190:140 |
| `peek` | 文章卡片 hover 时探出的小猫 | 120:100 |
| `box` | 404 页纸箱猫 | 200:190 |
| `walk` | 页脚分割线上的小猫 | 130:90 |
| `card` | 文章卡片封面 | 170:190 |

**亮 / 暗两套**：自定义图**不会自动反色**，浅色猫在暗色主题下可能发白糊成一片。填 `darkSrc` 给暗色专门一张；要按位置区分就填 `darkVariants`（结构与 `variants` 相同，留空回退到 `darkSrc` 或 `src`）。

**不会跟着替换的**：`CatPaw`（爪印光标、点击爪印、导航小图标）和 `CatFish`（小鱼干彩蛋）是全站共用的小装饰，始终用内置图；`app/opengraph-image.tsx` 里分享卡片的猫头是独立用 div 画的，想同步换需要单独改那个文件。

**换图后仍然有效**：摸猫计数、撒小鱼干、猫爪光标、点击爪印、卡片 hover 探头、点站名冒台词等（外层保留了 `.cat-svg` 类名）。会**失效**的是内置 SVG 专属效果：瞳孔跟随鼠标、呼吸 / 抖毛 / 尾巴摆、全站炸毛。想让自定义图也轻微抖动，在 `globals.css` 给 `.cat-art-layer` 加一条 `animation` 即可。

### 方式 3｜只改某一只猫的 SVG

打开 `components/cats.tsx` 找到对应导出函数，改里面的 `<path d="..." />`。三条约束：

1. 别删外层 `<CatSvg viewBox="...">`，也别改 `viewBox`，否则所有尺寸会乱。
2. 保留 `cat-body` / `cat-noodle` / `cat-head` / `cat-eyes` / `cat-pupils` / `cat-tail` 这些类名，它们是呼吸、眨眼、猫眼跟随、炸毛动画的挂钩。
3. 颜色写 `var(--cat-fur)` 这类变量，别写死 `#fff`，否则暗色主题不跟着变。

想加新姿势：照着写一个 `export function CatXxx(...)`，再到页面里 import 使用。

### 方式 4｜整库替换

只要 **10 个导出名和 props 不变**（`CatFace` / `CatSitting` / `CatLoaf` / `CatSleep` / `CatPeek` / `CatPaw` / `CatFish` / `CatBox` / `CatWalk` / `CardCat`），整个 `cats.tsx` 可以随便重写，所有页面和互动层一行都不用改。最省事的做法其实是全站走方式 2 的图片。

### 位置与代码速查

| 想改什么 | 改哪里 |
|---|---|
| 猫的名字、职位、口头禅、台词 | `lib/site-config.ts` 的 `cat` / `catLines` / `slogans` |
| 换成自己的图片、按位置配图 | `lib/site-config.ts` 顶部的 `catArtwork` + `public/cats/` |
| 猫的奶黄毛色、紫褐描边、肚子/爪子颜色 | `app/globals.css` 顶部 `--cat-*` 变量（明暗两套） |
| 换一只猫的姿势、加新姿势 | `components/cats.tsx` |
| 猫出现在哪些页面 | `components/hero.tsx`、`post-card.tsx`、`footer.tsx`、`about/page.tsx`、`not-found.tsx`、`post-cat.tsx` |
| 背景的猫爪印密度 | `components/site-backdrop.tsx` |
| 鼠标互动（跟随、爪印、彩蛋） | `components/cat-companion.tsx` + `globals.css` 里 `.cat-*` 动画 |
| 猫的循环动效（呼吸、抖毛、尾巴摆、炸毛） | `app/globals.css` 的 `.cat-body` / `.cat-noodle` / `cat-jiggle` 等 |
| 自定义图的 hover 反馈、亮暗切换 | `app/globals.css` 的 `.cat-art-layer` |

**互动清单**（有鼠标的设备才启用，开启系统「减少动态效果」时自动安静）：

- 猫平时会**缓慢呼吸挤压**，每隔几秒突然**抖一下毛**，尾巴一直摇 —— 模仿 motions.cat 那些循环短 GIF。
- **悬停到任意一只猫，全站所有猫会陪着一起炸毛**（用 `:has()` 实现，浏览器不支持时至少被悬停的那只会抖）。
- 所有猫的**小点眼跟着鼠标转**（`--cat-eye-x/y` 由全局互动层写入）。
- 鼠标旁边有一枚**带阻尼的猫爪光标**，悬停到链接/按钮时会放大「抓一下」。
- 点击页面任意位置会留下**淡出的猫爪印**。
- 首页那只大猫可以**摸**：悬停或点击会冒爱心、呼噜一声，并累计次数。
- 摸满 5 次、点站名累计、或在键盘上敲出 `cat`，会**撒小鱼干**；首页猫会冒出台词。
- 文章读到底有一只面包猫，按「pet the cat」也会撒小鱼干。
- 文章卡片悬停时右侧会有**小猫探头**，尾巴摇得更快。
- 点站名/Logo 会冒一句猫台词；「Pick for me」随机跳一篇；列表按 `/` 聚焦搜索、`Esc` 清空。

**想彻底关掉互动**：删掉 `app/layout.tsx` 里的 `<CatCompanion />` 即可，猫插画会保留（眼睛静止）。

**换图后自检**：`/en` 首页大猫 → 文章卡片 → 页脚 → 随便输个错地址看 404 → 切一次亮 / 暗主题 → `npm run build` 通过再 push。图不显示时依次查：路径是不是 `/cats/xxx`、文件名大小写、文件是否真在 `public/cats/` 下、`enabled` 是不是 `true`。

---

## 三、想改站点外观 / 信息去哪改

| 想改什么 | 改哪个文件 |
|---|---|
| 站名、副标题、简介、作者、社交链接、Giscus、备案号、猫的名字、**换猫图片开关** | **`lib/site-config.ts`**（全站唯一配置入口） |
| 默认语言 | `lib/i18n.ts` 的 `defaultLocale` + `middleware.ts` 的 `DEFAULT_LOCALE`（**两处要一起改**） |
| 主色、纸张底色、贴纸阴影、正文排版、代码高亮、猫咪动画 | `app/globals.css` 顶部 CSS 变量 |
| 背景纸纹 / 猫爪水印 | `components/site-backdrop.tsx` |
| 首页 Hero、摸猫交互 | `components/hero.tsx` |
| 文章卡片样式与卡片里的猫 | `components/post-card.tsx` |
| 列表搜索 / 标签 / 年份筛选 | `components/blog-explorer.tsx` |
| 文章阅读页（进度条、目录、代码复制、上下篇、文末猫） | `app/[locale]/blog/[slug]/page.tsx` + `components/` 下对应组件 |
| 页头导航 / 页脚 | `components/header.tsx` / `footer.tsx` |
| 界面文案 | `messages/*.json` |
| 分享卡片（OG 图） | `app/opengraph-image.tsx` |
| 站点地址、Giscus ID | 本地 `.env.local`；**线上必须在 Vercel 项目 Settings → Environment Variables 填**（`.env*` 不会上传，见第六节） |

改完记得 `npm run build` 验证一次。

---

## 四、目录结构

```
cody-blog/
├── app/
│   ├── layout.tsx                 根布局：主题、页头页脚、纸纹背景、全站 metadata
│   ├── globals.css                设计系统（配色 + 贴纸元件 + 猫咪动画 + 排版）
│   ├── sitemap.ts / robots.ts      SEO：站点地图与抓取规则（自动生成）
│   ├── opengraph-image.tsx        站点级分享卡片（含一只 div 拼的猫）
│   ├── not-found.tsx              404 页（纸箱里的猫）
│   ├── api/admin/posts/route.ts  本地后台读写接口
│   └── [locale]/
│       ├── layout.tsx             语言路由静态参数
│       ├── page.tsx               首页
│       ├── blog/page.tsx          文章列表（搜索 / 标签 / 年份）
│       ├── blog/[slug]/page.tsx   文章详情
│       ├── tags/page.tsx          标签页
│       ├── about/page.tsx         关于页 + 猫的工牌
│       ├── rss.xml/route.ts       RSS 订阅
│       └── admin/                 本地写作后台（仅开发环境）
├── components/
│   ├── cats.tsx                   ← 所有猫咪 SVG 插画
│   ├── cat-companion.tsx          ← 全站鼠标互动层
│   ├── site-backdrop.tsx          纸纹 + 猫爪水印
│   ├── post-cat.tsx               文章底部的猫
│   └── ...                        Hero / 卡片 / 筛选 / 进度条 / 目录 / 复制 / 导航
├── content/posts/{en,zh-CN}/       ← 你的文章都在这里（en 是默认）
├── lib/
│   ├── site-config.ts             ← 全站配置，最常改
│   ├── posts.ts                   文章查询 / 标签统计 / 年份分组 / 上下篇
│   ├── i18n.ts / utils.ts         文案与格式化工具
│   └── contentlayer.ts            Contentlayer 产物导出
├── messages/                      中英文界面文案
├── scripts/new-post.mjs           ← 一键建文章脚本
├── public/images/                 文章图片
├── contentlayer.config.ts         内容模型（字段、slug、阅读时长、字数）
├── middleware.ts                  默认语言重定向 + 线上后台拦截
└── docs/ARCHITECTURE.md           架构分析与改造记录
```

---

## 五、关于「管理后台」

`npm run dev` 后手动访问 `http://localhost:3000/en/admin`，可以在浏览器里新建 / 编辑 / 删除文章。它没有账号体系，直接读写本地文件。

**生产环境默认关闭**：`middleware.ts` 会把 `/en/admin` 返回 404，API 也会返回 403。原因是 Vercel 等平台的文件系统是只读的，写进去不会持久，而且无鉴权的写接口本身就是风险。线上请走「本地写 .mdx → git push」这条流程。

---

## 六、部署到 Vercel

项目已经关联过 Vercel：`.vercel/project.json` 指向项目 `cody-blog`，Git 远端是 `Codyerror/CodysBlog`，分支 `main`。**推荐继续用 Git 自动部署**：push 一次，Vercel 自动构建上线，以后写文章也是同一条流程。

### 0. 部署前必查：两件会直接让构建失败的事

1. **别删 `.npmrc`**。`next-contentlayer@0.3.4` 声明的 peer 是 `next ^12 || ^13`，本项目用 `next@14.2.35`。实测不带 `.npmrc` 时 `npm ci` 会直接报 `ERESOLVE`，而 Vercel 默认安装就是这一步，构建必挂。`.npmrc` 里的 `legacy-peer-deps=true` 让线上与本地采用同样的依赖解析方式。
2. **`.env.local` 不会上传**。`.gitignore` 忽略所有 `.env*`，站点地址和 Giscus ID 必须在 Vercel 控制台的环境变量里填（见第 2 步）；本地那份只影响 `npm run dev`。

### 1. 首次 / 重新关联项目

如果 Vercel 项目还在、并且已连接这个 GitHub 仓库，跳过这步。否则到 [vercel.com/new](https://vercel.com/new) → **Add New → Project** → 选 `Codyerror/CodysBlog` → Import。

Vercel 会自动识别 Next.js，**下列构建设置保持默认，不要手填**：

| 设置 | 值 |
|---|---|
| Framework Preset | Next.js（自动检测） |
| Root Directory | `.`（仓库根） |
| Build Command | `npm run build` |
| Output Directory | `.next`（自动） |
| Install Command | `npm ci`（会读 `.npmrc`） |
| Node.js Version | 设 **22.x**（本地是 v22.22.2，保持一致） |

### 2. 在 Vercel 填环境变量

项目 → **Settings → Environment Variables**，照着 `.env.local.example` 逐个添加，勾选 **Production**（Preview 按需）：

| 变量 | 填什么 | 不填会怎样 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 正式域名，如 `https://cody-link.com`；没域名先填 `https://<项目名>.vercel.app` | sitemap / RSS / canonical / 分享卡片里会是占位域名 `cody-blog.vercel.app` |
| `NEXT_PUBLIC_GISCUS_REPO` | 公开仓库 `用户名/仓库名` | 用 `site-config.ts` 里的占位值 |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | 在 [giscus.app](https://giscus.app) 生成 | 评论加载不出来 |
| `NEXT_PUBLIC_GISCUS_CATEGORY` | 一般 `Announcements` | 同上 |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | 同上生成 | 同上 |
| `ENABLE_ADMIN` | **不要设** | 设为 `true` 会开放无鉴权的线上后台 |

> `NEXT_PUBLIC_` 变量在**构建时**内联进产物，改完必须重新部署（Deployments → ⋯ → **Redeploy**）才生效，不会立刻作用于已上线版本。评论还要求仓库是 public 且已开启 GitHub Discussions。

### 3. 部署

**方式 A：Git 自动部署（日常就用这个）**

```bash
cd E:/MyProject/cody-blog
git add -A
git commit -m "blog: CodyLink redesign"
git push origin main
```

推上去后 Vercel 自动构建，Deployments 里能看到进度，成功即上线。以后加文章、换猫图、改文案都是 `git add -A && git commit && git push`，sitemap / RSS / 标签页 / 上下篇全部自动重新派生。

**方式 B：Vercel CLI（临时预览 / 没连 Git 时）**

```bash
vercel login        # 当前机器的 token 已失效，先重新登录
vercel              # 生成 Preview 预览地址
vercel --prod       # 推到生产域名
```

`.vercel/project.json` 已 link 好，登录后不用再选项目。CLI 绕过 Git，适合临时看效果，但**别当日常流程**——线上版本会和仓库不一致。

### 4. 绑定自定义域名（可选）

项目 → **Settings → Domains** → 添加域名 → 按提示在 DNS 服务商加 A / CNAME → Vercel 自动签发 HTTPS 证书。之后把 `NEXT_PUBLIC_SITE_URL` 改成新域名并 **Redeploy** 一次。

| 方案 | 费用量级 | 备案 | 国内访问 |
|---|---|---|---|
| Vercel（境外托管） | 免费额度够个人博客用 | **免备案** | 一般，时有抖动 |
| 腾讯云 COS + CDN / 阿里云 OSS + CDN | 个人博客常见 5–20 元/月量级 | **必须 ICP 备案** | 快 |
| 轻量应用服务器 2C2G | 约 60–120 元/月量级 | **必须 ICP 备案** | 快 |

> 费用为整理时的常见概览（查询日期 2026-11-04），实际以各平台官网为准。只要由中国大陆境内服务器或 CDN 提供服务，就必须完成 ICP 备案（个人性质选「非经营」，约 1–3 周）；通过后把备案号填进 `lib/site-config.ts` 的 `icp`，页脚自动展示。

### 5. 上线后自检

- [ ] `/` 自动 307 跳到 `/en`，`/zh-CN` 中文站正常
- [ ] `/sitemap.xml`、`/robots.txt`、`/en/rss.xml`、`/opengraph-image` 均返回 200
- [ ] sitemap / RSS 里的域名是**正式域名**，不是占位值
- [ ] `/en/admin` 返回 404（线上后台默认关闭，设计如此）
- [ ] 随便输个不存在的文章地址返回 404
- [ ] 切一次亮 / 暗主题，猫在两种主题下都正常
- [ ] 文章页评论能加载（已配置 Giscus）
- [ ] 手机上看一眼首页和文章页

### 6. 部署失败时对照

| 现象 | 原因 / 处理 |
|---|---|
| `ERESOLVE` / `peer next@"^12 \|\| ^13"` | `.npmrc` 没进仓库或被删；也可在 Vercel 把 Install Command 覆盖成 `npm install --legacy-peer-deps` |
| 改了环境变量但线上没变 | `NEXT_PUBLIC_` 构建时内联，必须 Redeploy |
| `mdast-util-gfm-table` / `inTable` 报错 | `remark-gfm` 必须锁 `3.0.1`（4.x 与 Contentlayer 的 MDX 2 管线不兼容），别手滑升级 |
| OG 图片报 `Invalid URL` | `app/opengraph-image.tsx` 必须保持 `export const runtime = 'edge'` |
| 线上 `/en/admin` 404、API 403 | 设计如此：Vercel 文件系统只读且后台无鉴权，写文章走本地 Git 流程 |
| 构建日志有 Contentlayer Windows 警告 | 无害，Vercel 的 Linux 环境一般不会出现 |
| 国内访问慢 / 偶尔打不开 | Vercel 境外托管的已知代价，要稳定得快就换境内托管并备案 |

### 7. 上线后必做的 SEO 四件事

1. 在 Vercel 环境变量里把 `NEXT_PUBLIC_SITE_URL` 设成正式域名并 Redeploy。
2. 确认 `/sitemap.xml`、`/robots.txt`、`/en/rss.xml` 可访问，把 sitemap 提交到必应 / 百度站长平台。
3. 文章 slug 用英文短词，别用中文长串或数字 ID。
4. 每篇文章一个 H1，正文用 H2 / H3 依次降级，配一张 16:9 封面图。

---

## 七、常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发预览 |
| `npm run build` | 生产构建（会顺带做类型检查） |
| `npm start` | 启动生产构建产物 |
| `npm run lint` | ESLint 检查 |
| `npm run typecheck` | 只跑 TypeScript 类型检查 |
| `npm run new:post -- --slug x --title "A title"` | 新建文章（默认英文） |

---

## 八、常见坑

- **文章没出现在列表里**：99% 是 `locale` 和目录不一致，或 `date` 没加引号被解析成别的类型。
- **改了 frontmatter 但页面没变**：Contentlayer 有缓存，删掉 `.contentlayer/` 目录再 `npm run dev` 重启。
- **Windows 构建提示 `Contentlayer might not work as expected on Windows`**：已知提示，构建仍能完成，可忽略。
- **代码没有高亮**：代码块要标语言（```` ```python ````）；配色写在 `globals.css` 的 `.hljs-*`。
- **暗色模式不对**：`next-themes` 用 `class` 策略，`globals.css` 里的 `@custom-variant dark` 必须保留。
- **猫的眼睛不动 / 猫爪光标不出现**：只在 `(hover: hover) and (pointer: fine)` 且未开启「减少动态效果」时启用，触屏和省电模式是设计如此。
- **猫的 SVG 尺寸不听 `w-*` 类名**：`.cat-svg` 放在 `@layer components` 里，这样 Tailwind 工具类才能覆盖默认尺寸；别把它挪出 layer。
- **构建提示 `Using edge runtime ... disables static generation`**：来自 `app/opengraph-image.tsx`，为绕开 Windows 下 `@vercel/og` 的 `Invalid URL`，这张分享卡片刻意按需生成，其余页面仍全部静态。
- **线上后台 404**：设计如此，见第五节。
- **Vercel 构建报 `ERESOLVE`**：`.npmrc` 没进仓库或被删，见第六节的失败排查表。
- **改了默认语言但根路径没变**：`lib/i18n.ts`、`middleware.ts` 两处都要改，另外 `app/layout.tsx` 的 `lang` / canonical 也建议同步。

---

## 九、上线前自检清单

- [ ] Vercel 环境变量里 `NEXT_PUBLIC_SITE_URL` 已设成正式域名并 **Redeploy**（只改本地 `.env.local` 不算）
- [ ] `lib/site-config.ts` 里的 GitHub、邮箱已换成真实值；Giscus 的 repoId / categoryId 已在 Vercel 环境变量覆盖
- [ ] 关于页写清「我是谁 / 写什么」，首发不少于 3 篇
- [ ] 手机端排版正常、无横向滚动；HTTPS 生效
- [ ] `/en`、`/en/blog`、`/sitemap.xml`、`/robots.txt`、`/en/rss.xml` 均可访问
- [ ] 404 页能一键回首页，中英切换能保留当前路径
- [ ] 大陆托管：页脚已展示备案号；境外托管可跳过
- [ ] 评论区（Giscus）已确认能正常加载
- [ ] 已提交搜索引擎收录（必应 / 百度站长平台各一次）

---

## 十、已知限制

- **Contentlayer 0.3.4 已停止维护**，本项目锁在 Next.js 14.2.35；升级框架前先验证内容层，必要时迁移到 `next-mdx-remote` / Content Collections。
- `eslint-config-next@16` 与 `next@14` 大版本不一致，已关掉两条 React Compiler 误报规则，建议后续对齐版本。
- 后台无账号体系，**仅限本地开发**。
- Giscus 评论需要读者有 GitHub 账号，且仓库必须公开、已安装 giscus app。
- OG 分享卡片刻意只放英文（渲染器缺中文字体）；猫脸是用 `div` 拼的，不是 SVG。
- 猫咪互动依赖鼠标，触屏设备只保留静态插画。

---

MIT
