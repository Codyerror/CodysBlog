'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'
import { getMessage } from '@/lib/i18n'

export function CopyLink({ locale }: { locale: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.prompt('Copy this link:', window.location.href)
    }
  }

  return (
    <button onClick={copy} className="btn-outline !py-2 !px-4 !text-xs" aria-label={getMessage(locale, 'post.copyLink')}>
      {copied ? <Check className="w-3.5 h-3.5 text-brand" /> : <Link2 className="w-3.5 h-3.5" />}
      {copied ? getMessage(locale, 'post.copied') : getMessage(locale, 'post.copyLink')}
    </button>
  )
}
