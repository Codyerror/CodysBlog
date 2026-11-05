/**
 * 全站唯一配置入口。
 * 想改博客名、猫的名字、简介、社交链接、评论系统、备案号，只改这个文件即可。
 * 需要区分生产/本地的值用 NEXT_PUBLIC_ 开头的环境变量覆盖（见 .env.local.example）。
 *
 * 站点只有一个名字：CodyLink。没有中文别名，两种语言里都显示这个名字。
 */

/**
 * 换成自己的猫：把 catArtwork.enabled 改成 true，把图放进 public/cats/，
 * 然后填 src 即可，全站猫会一起换掉，不用碰任何组件。
 * 详细步骤见 README「二、换猫」。
 */
export type CatArtworkConfig = {
  /** false = 用内置手绘 SVG 猫；true = 用下面的图片 */
  enabled: boolean
  /** 默认图。填 public/ 下的绝对路径，如 '/cats/mochi.gif'。支持 png/webp/svg/gif */
  src: string
  /** 暗色主题专用图（可选）。不填就沿用 src */
  darkSrc: string
  /** 按位置覆盖；留空的位置回退到 src。对应表见 README */
  variants: Record<CatArtworkSlot, string>
  /** 按位置覆盖的暗色图（可选）；留空回退到 darkSrc 或 src */
  darkVariants: Record<CatArtworkSlot, string>
  /** 图片替代文字 */
  alt: string
}

/** 可以单独指定图片的位置。 */
export type CatArtworkSlot =
  | 'face'
  | 'sitting'
  | 'loaf'
  | 'sleep'
  | 'peek'
  | 'box'
  | 'walk'
  | 'card'

const catArtwork: CatArtworkConfig = {
  enabled: false,
  /** 项目自带 public/cats/my-cat.svg 示例图，打开 enabled 就能立刻看到换图效果 */
  src: '/cats/my-cat.svg',
  darkSrc: '',
  variants: { face: '', sitting: '', loaf: '', sleep: '', peek: '', box: '', walk: '', card: '' },
  darkVariants: { face: '', sitting: '', loaf: '', sleep: '', peek: '', box: '', walk: '', card: '' },
  alt: 'my cat',
}

export const siteConfig = {
  name: 'CodyLink',
  /** 一行小写英文副标，出现在 logo 下面、页脚和 RSS 标题里。 */
  subtitle: 'notes, code & cats',
  tagline: 'A small corner of the internet, supervised by a cat.',
  description:
    "Cody's notebook on data, code, and whatever the cat walked across today. Mostly written for future me.",
  author: 'Cody',

  /** 部署后改成自己的域名。用于 sitemap、RSS、OG 卡片里的绝对地址。 */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cody-blog.vercel.app',

  /** 默认访问根路径时落到英文站；中文站通过右上角切换器进入。 */
  defaultLocale: 'en',
  locales: ['en', 'zh-CN'] as const,

  social: {
    github: 'https://github.com/Codyerror',
    email: 'hello@example.com',
  },

  /** Giscus 评论。可以在 .env.local 里覆盖，避免把仓库 ID 写死在代码里。 */
  giscus: {
    repo: (process.env.NEXT_PUBLIC_GISCUS_REPO ?? 'Codyerror/CodysBlog') as `${string}/${string}`,
    repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? 'R_kgDOQ7pwOA',
    category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'Announcements',
    categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? 'DIC_kwDOQ7pwOM4C1Eqm',
  },

  /** 全站的猫。改名字、职位、口头禅都在这里；换图看下面的 artwork。 */
  cat: {
    name: 'Mochi',
    title: 'Chief Distraction Officer',
    since: '2021',
    artwork: catArtwork,
  },

  /** 点站名 / 摸猫时冒出来的短句。刻意写得口语、不对仗。 */
  slogans: [
    'the cat approved this draft. probably.',
    'mostly notes for future me',
    'sometimes the bug is me',
    'coffee, .mdx, and a cat on the keyboard',
    'no takeaways, just things I figured out',
    'written between naps (the cat’s, not mine)',
  ],

  /** 鼠标悬停在猫身上时，它会说一句。 */
  catLines: [
    'pspspsps',
    'you may pet me now',
    'purrrrr',
    'did you save your work?',
    'I sit on the keyboard, therefore I am',
    'meow.',
    'that post is three weeks late',
  ],

  /**
   * 若站点部署在中国大陆服务器/CDN 并完成 ICP 备案，把备案号填在这里，
   * 页脚会自动展示并链接到工信部系统。境外托管（Vercel 等）留空即可。
   */
  icp: '',

  /**
   * 「关于」页：关注的技术方向。改这里即可更新卡片，不用碰页面组件。
   * titleEn / titleZh 是标题，descEn / descZh 是简介，跟随站点语言切换。
   */
  focusAreas: [
    {
      icon: '🤖',
      titleEn: 'AI & LLM applications',
      titleZh: 'AI 与大模型应用',
      descEn: 'Building LLM apps, agent orchestration, RAG and prompt engineering.',
      descZh: '大模型应用落地、智能体编排、检索增强（RAG）与提示工程。',
    },
    {
      icon: '📈',
      titleEn: 'Quant & data analysis',
      titleZh: '量化与数据分析',
      descEn: 'Micro-cap quant strategies, backtesting and the Python data stack.',
      descZh: '微盘股量化策略研究、回测框架与 Python 数据分析。',
    },
    {
      icon: '🛠️',
      titleEn: 'Tooling & automation',
      titleZh: '工程化与自动化',
      descEn: 'Dev tooling, automation scripts and continuous deployment.',
      descZh: '开发工具链、自动化脚本与持续部署流程。',
    },
    {
      icon: '🌐',
      titleEn: 'Web & full-stack',
      titleZh: '前端与全栈',
      descEn: 'Interactive front-ends and full-stack apps with Next.js & TypeScript.',
      descZh: '基于 Next.js 与 TypeScript 的交互式前端与全栈应用。',
    },
  ],

  /**
   * 「关于」页：友情链接 / 资源导航。放 AI 相关的开发文档与技术站点。
   * 加一个链接只需往这里追加一项，不用碰页面组件。
   */
  friendLinks: [
    { name: 'OpenAI', url: 'https://platform.openai.com/docs', tag: 'LLM' },
    { name: 'Anthropic', url: 'https://docs.anthropic.com', tag: 'LLM' },
    { name: 'Google AI', url: 'https://ai.google.dev', tag: 'LLM' },
    { name: 'Hugging Face', url: 'https://huggingface.co/docs', tag: 'ML' },
    { name: 'Mistral', url: 'https://docs.mistral.ai', tag: 'LLM' },
    { name: 'Ollama', url: 'https://ollama.com', tag: 'Local' },
    { name: 'Vercel AI SDK', url: 'https://ai-sdk.dev', tag: 'Framework' },
    { name: 'LangChain', url: 'https://docs.langchain.com', tag: 'Framework' },
    { name: 'LlamaIndex', url: 'https://docs.llamaindex.ai', tag: 'Framework' },
    { name: 'MCP', url: 'https://modelcontextprotocol.io', tag: 'Protocol' },
    { name: 'Next.js', url: 'https://nextjs.org/docs', tag: 'Web' },
    { name: 'Python', url: 'https://docs.python.org/3', tag: 'Dev' },
    { name: 'PyTorch', url: 'https://pytorch.org/docs', tag: 'ML' },
    { name: 'MDN', url: 'https://developer.mozilla.org', tag: 'Web' },
  ],
} as const

export type SiteConfig = typeof siteConfig
