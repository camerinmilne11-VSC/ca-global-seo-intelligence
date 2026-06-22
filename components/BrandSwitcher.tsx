'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BRANDS, getActiveBrand, getBrandHref } from '@/lib/component-utils'

export function BrandSwitcher() {
  const pathname = usePathname()
  const activeBrand = getActiveBrand(pathname)

  return (
    <nav className="flex gap-1 border-b border-gray-200 px-6 bg-white">
      {BRANDS.map(brand => (
        <Link
          key={brand.slug}
          href={getBrandHref(brand.slug)}
          className={cn(
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeBrand === brand.slug
              ? 'border-brand-teal text-brand-teal'
              : 'border-transparent text-gray-500 hover:text-brand-teal hover:border-gray-300'
          )}
        >
          {brand.label}
        </Link>
      ))}
    </nav>
  )
}
