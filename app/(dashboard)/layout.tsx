import { BrandSwitcher } from '@/components/BrandSwitcher'
import { BrandNav } from '@/components/BrandNav'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="bg-brand-teal text-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="font-heading text-lg font-bold tracking-tight">CA Global SEO Intelligence</h1>
          <p className="text-xs text-brand-teal-faint mt-0.5">Keyword &amp; Content Planning System</p>
        </Link>
      </header>
      <BrandSwitcher />
      <BrandNav />
      <main className="max-w-7xl mx-auto px-6 py-6">
        {children}
      </main>
    </>
  )
}
