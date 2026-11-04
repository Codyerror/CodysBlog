import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CatBox, CatPaw } from '@/components/cats'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center">
      <CatBox className="w-56 mx-auto fade-up" />
      <span className="eyebrow mt-2">404 · meow</span>
      <h1 className="mt-3 text-2xl md:text-3xl font-bold text-ink">
        Mochi knocked this page off the desk.
      </h1>
      <p className="mt-3 text-inksoft">
        It&apos;s gone, or it never existed. She looks completely innocent about it.
      </p>
      <Link href="/en" className="btn-primary mt-7">
        <ArrowLeft className="w-4 h-4" /> Back home
      </Link>
      <div className="mt-8 flex items-center justify-center gap-3 opacity-30">
        <CatPaw className="w-4 text-brand -rotate-12" />
        <CatPaw className="w-3 text-brand rotate-6" />
        <CatPaw className="w-4 text-brand rotate-12" />
      </div>
    </div>
  )
}
