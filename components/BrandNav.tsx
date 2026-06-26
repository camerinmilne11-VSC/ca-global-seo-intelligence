'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getActiveBrand } from '@/lib/component-utils'

const BASE_TABS = [
  { label: 'Keywords', path: 'keywords' },
  { label: 'Topics',   path: 'topics'   },
  { label: 'Briefs',   path: 'briefs'   },
  { label: 'Drafts',   path: 'drafts'   },
  { label: 'Socials',  path: 'socials'  },
] as const

const CONTENT_ONLY_TABS = [
  { label: 'Carousels', path: 'carousels' },
  { label: 'Scripts',   path: 'scripts'   },
] as const

const CAROUSEL_EXCLUDED_BRANDS = new Set(['vogue-hygiene'])

export function BrandNav() {
  const pathname    = usePathname()
  const activeBrand = getActiveBrand(pathname)

  if (!activeBrand) return null

  const tabs = CAROUSEL_EXCLUDED_BRANDS.has(activeBrand)
    ? BASE_TABS
    : [...BASE_TABS, ...CONTENT_ONLY_TABS]

  return (
    <nav className="flex gap-0.5 border-b border-gray-100 px-6 bg-gray-50">
      {tabs.map(tab => {
        const href    = `/${activeBrand}/${tab.path}`
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              'px-3 py-2 text-xs font-medium border-b-2 transition-colors',
              isActive
                ? 'border-brand-teal text-brand-teal'
                : 'border-transparent text-gray-400 hover:text-brand-neutral-dark hover:border-gray-300'
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
