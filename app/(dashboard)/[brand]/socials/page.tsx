export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { SocialViewer } from '@/components/SocialViewer'
import { notFound } from 'next/navigation'
import type { Social } from '@/types'

const BRAND_NAMES: Record<string, string> = {
  'ca-global': 'CA Global', 'ca-mining': 'CA Mining', 'ca-finance': 'CA Finance',
  'vogue-hygiene': 'Vogue Hygiene', 'ca-global-hr': 'CA Global HR',
}

type Props = { params: Promise<{ brand: string }> }

export default async function SocialsPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()

  let socials: Array<Social & { keyword?: { keyword: string; priority_score: number } | null }> = []

  try {
    const db = await createClient()
    const { data: brandRow } = await db.from('brands').select('id').eq('slug', brand).single()

    if (brandRow?.id) {
      const { data: kwIds } = await db.from('keywords').select('id').eq('brand_id', brandRow.id)
      const ids = kwIds?.map((k: { id: string }) => k.id) ?? []

      const { data } = await db
        .from('socials')
        .select('*, keyword:keywords(keyword, priority_score)')
        .in('keyword_id', ids.length > 0 ? ids : ['00000000-0000-0000-0000-000000000000'])
        .order('generated_at', { ascending: false })

      socials = (data ?? []) as typeof socials
    }
  } catch {
    // Supabase not configured — render empty state
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold text-brand-teal-dark">
        {BRAND_NAMES[brand]} — Social Media Posts
      </h2>
      {socials.map(social => (
        <div key={social.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-teal-dark">{social.keyword?.keyword}</h3>
            <span className="text-xs text-gray-400">
              Generated {new Date(social.generated_at).toLocaleDateString()}
            </span>
          </div>
          <SocialViewer social={social as Social} />
        </div>
      ))}
      {socials.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No social posts generated yet. Go to Keywords and click &quot;+ Social&quot;.
        </p>
      )}
    </div>
  )
}
