import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from './providers'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SiteBackdrop } from '@/components/site-backdrop'
import { LocaleSync } from '@/components/locale-sync'
import { BackToTop } from '@/components/back-to-top'
import { CatCompanion } from '@/components/cat-companion'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} · ${siteConfig.subtitle}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['CodyLink', 'Cody', 'data analysis', 'machine learning', 'engineering notes', 'cats'],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
    title: `${siteConfig.name} · ${siteConfig.subtitle}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} · ${siteConfig.subtitle}`,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/en',
    languages: { 'en': '/en', 'zh-CN': '/zh-CN' },
    types: { 'application/rss+xml': '/en/rss.xml' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SiteBackdrop />
          <LocaleSync />
          <CatCompanion />
          <Header />
          <main className="relative min-h-[70vh]">{children}</main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
