// @ts-nocheck
import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'
import readingTime from 'reading-time'
// @ts-ignore
import rehypeHighlight from 'rehype-highlight'
// @ts-ignore
import rehypeSlug from 'rehype-slug'
// @ts-ignore
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import path from 'path'

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
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/${post.locale}/blog/${post._raw.flattenedPath.replace(`${post.locale}/`, '')}` },
    slug: { type: 'string', resolve: (post) => post._raw.flattenedPath.replace(`${post.locale}/`, '') },
    readingTime: { type: 'json', resolve: (post) => readingTime(post.body.raw) },
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
