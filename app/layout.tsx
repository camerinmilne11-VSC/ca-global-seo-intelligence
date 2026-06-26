import type { Metadata } from 'next'
import { BrandSwitcher } from '@/components/BrandSwitcher'
import { BrandNav } from '@/components/BrandNav'
import './globals.css'

export const metadata: Metadata = {
  title: 'CA Global SEO Intelligence',
  description: 'Keyword intelligence and content planning for CA Global, CA Mining, CA Finance',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white font-body antialiased">
        <header className="bg-brand-teal text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-lg font-bold tracking-tight">CA Global SEO Intelligence</h1>
            <p className="text-xs text-brand-teal-faint mt-0.5">Keyword &amp; Content Planning System</p>
          </div>
        </header>
        <BrandSwitcher />
        <BrandNav />
        <main className="max-w-7xl mx-auto px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
