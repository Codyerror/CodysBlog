import { useTranslations } from 'next-intl'

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('nav.about')}</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg mb-4">
          山高有径，数海有光
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          这里是 Cody 的技术札记。聚焦数据分析、机器学习。让我们共同学习，于数据山峦间，寻一份理性与洞察。
        </p>
        <h2>技术栈</h2>
        <ul>
          <li>Next.js 15+</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>MDX</li>
          <li>Contentlayer</li>
        </ul>
        <h2>联系我</h2>
        <p>
          如果你对我的文章有任何问题或建议，欢迎通过 GitHub 或邮件与我联系。
        </p>
      </div>
    </div>
  )
}
