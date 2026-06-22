import { createClient } from '@/lib/supabase-server'
import { BriefViewer } from '@/components/BriefViewer'
import { notFound } from 'next/navigation'
import type { Brief } from '@/types'

const BRAND_NAMES: Record<string, string> = {
  'ca-global': 'CA Global', 'ca-mining': 'CA Mining', 'ca-finance': 'CA Finance',
}

type Props = { params: Promise<{ brand: string }> }

export default async function BriefsPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()

  let briefs: Array<Brief & { keyword?: { keyword: string; priority_score: number } | null }> = []

  try {
    const db = await createClient()
    const { data: brandRow } = await db.from('brands').select('id').eq('slug', brand).single()

    if (brandRow?.id) {
      const { data: kwIds } = await db.from('keywords').select('id').eq('brand_id', brandRow.id)
      const ids = kwIds?.map((k: { id: string }) => k.id) ?? []

      const { data } = await db
        .from('briefs')
        .select('*, keyword:keywords(keyword, priority_score)')
        .in('keyword_id', ids.length > 0 ? ids : ['00000000-0000-0000-0000-000000000000'])
        .order('generated_at', { ascending: false })

      briefs = (data ?? []) as typeof briefs
    }
  } catch {
    // Supabase not configured — render empty state
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold text-brand-teal-dark">
        {BRAND_NAMES[brand]} — Content Briefs
      </h2>
      {briefs.map(brief => (
        <div key={brief.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-teal-dark">{brief.keyword?.keyword}</h3>
            <span className="text-xs text-gray-400">
              Generated {new Date(brief.generated_at).toLocaleDateString()}
            </span>
          </div>
          <BriefViewer brief={brief as Brief} />
        </div>
      ))}
      {briefs.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No briefs generated yet. Go to Keywords and click &quot;Generate Brief&quot;.
        </p>
      )}
    </div>
  )
}
