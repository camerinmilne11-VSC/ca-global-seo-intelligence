export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { KeywordTable } from '@/components/KeywordTable'
import { SyncButton } from '@/components/SyncButton'
import { notFound } from 'next/navigation'
import type { KeywordWithRelations } from '@/types'

const BRAND_NAMES: Record<string, string> = {
  'ca-global':  'CA Global',
  'ca-mining':  'CA Mining',
  'ca-finance': 'CA Finance',
}

type Props = { params: Promise<{ brand: string }> }

export default async function KeywordsPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()

  let keywords: KeywordWithRelations[] = []

  try {
    const db = await createClient()
    const { data: brandRow } = await db
      .from('brands')
      .select('id')
      .eq('slug', brand)
      .single()

    if (brandRow?.id) {
      const { data } = await db
        .from('keywords')
        .select('*, brief:briefs(id), draft:drafts(id), cluster:clusters(pillar_name)')
        .eq('brand_id', brandRow.id)
        .order('priority_score', { ascending: false })
      keywords = (data ?? []) as KeywordWithRelations[]
    }
  } catch {
    // Supabase not configured — render empty state
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-brand-teal-dark">
          {BRAND_NAMES[brand]} — Keyword Hub
        </h2>
        <SyncButton brand={brand} />
      </div>
      <KeywordTable keywords={keywords} brand={brand} />
    </div>
  )
}
