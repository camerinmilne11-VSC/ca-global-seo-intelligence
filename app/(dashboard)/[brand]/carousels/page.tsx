export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { CarouselViewer } from '@/components/CarouselViewer'
import { notFound } from 'next/navigation'
import type { Carousel } from '@/types'

const BRAND_NAMES: Record<string, string> = {
  'ca-global': 'CA Global', 'ca-mining': 'CA Mining', 'ca-finance': 'CA Finance',
  'vogue-hygiene': 'Vogue Hygiene', 'ca-global-hr': 'CA Global HR',
}

type Props = { params: Promise<{ brand: string }> }

export default async function CarouselsPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()

  let carousels: Array<Carousel & { keyword?: { keyword: string } | null }> = []

  try {
    const db = await createClient()
    const { data: brandRow } = await db.from('brands').select('id').eq('slug', brand).single()

    if (brandRow?.id) {
      const { data: kwIds } = await db.from('keywords').select('id').eq('brand_id', brandRow.id)
      const ids = kwIds?.map((k: { id: string }) => k.id) ?? []

      const { data } = await db
        .from('carousels')
        .select('*, keyword:keywords(keyword)')
        .in('keyword_id', ids.length > 0 ? ids : ['00000000-0000-0000-0000-000000000000'])
        .order('generated_at', { ascending: false })

      carousels = (data ?? []) as typeof carousels
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold text-brand-teal-dark">
        {BRAND_NAMES[brand]} — Carousel Slides
      </h2>
      {carousels.map(carousel => (
        <div key={carousel.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-teal-dark">{carousel.keyword?.keyword}</h3>
            <span className="text-xs text-gray-400">
              Generated {new Date(carousel.generated_at).toLocaleDateString()}
            </span>
          </div>
          <CarouselViewer carousel={carousel as Carousel} />
        </div>
      ))}
      {carousels.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No carousels generated yet. Go to Keywords, generate a draft, then click &quot;+ Carousel&quot;.
        </p>
      )}
    </div>
  )
}
