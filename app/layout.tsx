import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { locales } from '@/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CodyInsight - 知山数说',
  description: '山高有径，数海有光。聚焦数据分析、机器学习的技术札记。',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
