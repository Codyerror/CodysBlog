import type { MDXComponents } from 'mdx/types'

/**
 * 排版样式统一由 .prose-cody 负责（见 globals.css），
 * 这里只处理结构增强，避免组件内联的 Tailwind 颜色覆盖暗色主题变量。
 * 导出为常量，避免在 render 中反复创建组件对象。
 */
export const mdxComponents: MDXComponents = {
  a: ({ href, children, ...props }) => {
    const external = href?.startsWith('http')
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
  img: ({ src, alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} loading="lazy" {...props} />
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto">
      <table {...props}>{children}</table>
    </div>
  ),
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components }
}
