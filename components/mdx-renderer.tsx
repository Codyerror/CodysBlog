'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'
import { mdxComponents } from '@/components/mdx-components'

export function MDXRenderer({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code)
  return <MDXContent components={mdxComponents} />
}
