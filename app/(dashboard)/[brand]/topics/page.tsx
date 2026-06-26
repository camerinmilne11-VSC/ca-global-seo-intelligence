export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { TopicsTable } from '@/components/TopicsTable'
import { notFound } from 'next/navigation'
import type { KeywordWithRelations } from '@/types'

const BRAND_NAMES: Record<string, string> = {
  'ca-global':     'CA Global',
  'ca-mining':     'CA Mining',
  'ca-finance':    'CA Finance',
  'vogue-hygiene': 'Vogue Hygiene',
  'ca-global-hr':  'CA Global HR',
}

type Props = { params: Promise<{ brand: string }> }

export default async function TopicsPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()

  let topics: KeywordWithRelations[] = []

  try {
    const db = await createClient()
    const { data: brandRow } = await db.from('brands').select('id').eq('slug', brand).single()

    if (brandRow?.id) {
      const { data } = await db
        .from('keywords')
        .select('*, brief:briefs(id), draft:drafts(id), social:socials(id), carousel:carousels(id), video_script:video_scripts(id), cluster:clusters(pillar_name)')
        .eq('brand_id', brandRow.id)
        .eq('source', 'manual')
        .order('created_at', { ascending: false })

      topics = (data ?? []) as KeywordWithRelations[]
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-brand-teal-dark">
            {BRAND_NAMES[brand]} — Manual Topics
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Ideas and inspiration that didn&apos;t come from keyword research. Generate full content from any topic below.
          </p>
        </div>
      </div>
      <TopicsTable topics={topics} brand={brand} />
    </div>
  )
}
