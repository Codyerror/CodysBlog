import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 text-gray-700 dark:text-gray-300">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => <ul className="my-4 pl-6 list-disc">{children}</ul>,
    ol: ({ children }) => <ol className="my-4 pl-6 list-decimal">{children}</ol>,
    li: ({ children }) => <li className="my-2">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-6 text-gray-600 dark:text-gray-400">
        {children}
      </blockquote>
    ),
    pre: ({ children }) => (
      <pre className="my-4 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
        {children}
      </pre>
    ),
    code: ({ children, className }) => {
      if (className) {
        return <code className={className}>{children}</code>
      }
      return (
        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          {children}
        </code>
      )
    },
    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className="rounded-lg my-6 max-w-full h-auto"
        loading="lazy"
      />
    ),
    hr: () => <hr className="my-8 border-gray-300 dark:border-gray-600" />,
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => <tr className="border-b border-gray-300 dark:border-gray-600">{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-bold">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2">{children}</td>
    ),
    ...components,
  }
}
