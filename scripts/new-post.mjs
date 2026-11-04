#!/usr/bin/env node
/**
 * 命令行快速新建一篇文章，省得手写 frontmatter。
 *
 *   npm run new:post -- --slug my-second-post --title "My second post" --tags "data,notes"
 *   npm run new:post -- --locale zh-CN --slug 第二篇 --title "第二篇文章"
 *
 * 可选参数：--locale（en | zh-CN，默认 en）、--slug、--title、--tags（逗号分隔）、--summary、--date
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

function readArg(name, fallback) {
  const index = args.indexOf(`--${name}`)
  return index !== -1 && args[index + 1] ? args[index + 1] : fallback
}

const locale = readArg('locale', 'en')
const title = readArg('title', locale === 'zh-CN' ? '未命名文章' : 'Untitled post')
const slug =
  readArg('slug', '') ||
  title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') ||
  `post-${Date.now()}`
const date = readArg('date', new Date().toISOString().slice(0, 10))
const summary = readArg('summary', '')
const tags = readArg('tags', '')
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean)

if (!['zh-CN', 'en'].includes(locale)) {
  console.error('✗ --locale 只能是 zh-CN 或 en')
  process.exit(1)
}
if (/[\\/]/.test(slug) || slug.startsWith('.')) {
  console.error('✗ slug 不能包含路径分隔符')
  process.exit(1)
}

const quote = (value) => JSON.stringify(value)
const frontmatter = [
  '---',
  `title: ${quote(title)}`,
  `date: ${quote(date)}`,
  `summary: ${quote(summary)}`,
  `tags: [${tags.map(quote).join(', ')}]`,
  `locale: ${quote(locale)}`,
  '# cover: "/images/cover.jpg"   # 可选：封面图，放在 public/images/',
  '# draft: true                 # 可选：写了 half 先藏起来，去掉 # 生效',
  '---',
  '',
].join('\n')

const body = locale === 'zh-CN'
  ? `## 开头\n\n先写一句结论，再展开。\n\n## 正文\n\n- 支持 Markdown 表格、代码块、引用\n- 代码块右上角有复制按钮\n\n\`\`\`python\nprint("hello")\n\`\`\`\n\n> 想留给读者的一句话。\n`
  : `## Intro\n\nStart with the conclusion, then unpack it.\n\n## Body\n\n- Markdown tables, code blocks and quotes all work\n- Every code block gets a copy button\n\n\`\`\`python\nprint("hello")\n\`\`\`\n\n> One line worth remembering.\n`

const dir = path.join(root, 'content', 'posts', locale)
const file = path.join(dir, `${slug}.mdx`)

if (fs.existsSync(file)) {
  console.error(`✗ 文件已存在：${path.relative(root, file)}`)
  process.exit(1)
}

fs.mkdirSync(dir, { recursive: true })
fs.writeFileSync(file, frontmatter + body, 'utf-8')

console.log(`✓ 已创建 ${path.relative(root, file)}`)
console.log(`  预览地址：http://localhost:3000/${locale}/blog/${slug}`)
console.log('  运行 npm run dev 后打开上面的地址即可看到效果。')
