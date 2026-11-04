// @ts-nocheck
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
// @ts-ignore
import rehypeHighlight from 'rehype-highlight'
// @ts-ignore
import rehypeSlug from 'rehype-slug'
// @ts-ignore
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'

const countWords = (raw: string) => {
  const cleaned = raw
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*|_\-~]/g, ' ')
  const cjk = (cleaned.match(/[\u4e00-\u9fff]/g) ?? []).length
  const latin = (cleaned.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length
  return cjk + latin
}

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    summary: { type: 'string' },
    tags: { type: 'list', of: { type: 'string' } },
    locale: { type: 'string', required: true },
    /** 可选：封面图，放在 public/images/ 下，填 /images/xxx.jpg */
    cover: { type: 'string' },
    /** 可选：设为 true 则全站隐藏，方便写一半先存着 */
    draft: { type: 'boolean', default: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) =>
        `/${post.locale}/blog/${post._raw.flattenedPath.replace(`${post.locale}/`, '')}`,
    },
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace(`${post.locale}/`, ''),
    },
    readingTime: { type: 'json', resolve: (post) => readingTime(post.body.raw) },
    wordCount: { type: 'number', resolve: (post) => countWords(post.body.raw) },
  },
}))

// @ts-ignore
export default makeSource({
  contentDirPath: 'content/posts',
  documentTypes: [Post],
  // @ts-ignore
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      rehypeHighlight,
    ],
  },
})
