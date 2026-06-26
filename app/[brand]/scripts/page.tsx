export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase-server'
import { ScriptViewer } from '@/components/ScriptViewer'
import { notFound } from 'next/navigation'
import type { VideoScript } from '@/types'

const BRAND_NAMES: Record<string, string> = {
  'ca-global': 'CA Global', 'ca-mining': 'CA Mining', 'ca-finance': 'CA Finance',
  'vogue-hygiene': 'Vogue Hygiene', 'ca-global-hr': 'CA Global HR',
}

type Props = { params: Promise<{ brand: string }> }

export default async function ScriptsPage({ params }: Props) {
  const { brand } = await params
  if (!BRAND_NAMES[brand]) notFound()

  let scripts: Array<VideoScript & { keyword?: { keyword: string } | null }> = []

  try {
    const db = await createClient()
    const { data: brandRow } = await db.from('brands').select('id').eq('slug', brand).single()

    if (brandRow?.id) {
      const { data: kwIds } = await db.from('keywords').select('id').eq('brand_id', brandRow.id)
      const ids = kwIds?.map((k: { id: string }) => k.id) ?? []

      const { data } = await db
        .from('video_scripts')
        .select('*, keyword:keywords(keyword)')
        .in('keyword_id', ids.length > 0 ? ids : ['00000000-0000-0000-0000-000000000000'])
        .order('generated_at', { ascending: false })

      scripts = (data ?? []) as typeof scripts
    }
  } catch {
    // Supabase not configured
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-heading font-bold text-brand-teal-dark">
        {BRAND_NAMES[brand]} — Video Scripts
      </h2>
      {scripts.map(script => (
        <div key={script.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-teal-dark">{script.keyword?.keyword}</h3>
            <span className="text-xs text-gray-400">
              Generated {new Date(script.generated_at).toLocaleDateString()}
            </span>
          </div>
          <ScriptViewer script={script as VideoScript} />
        </div>
      ))}
      {scripts.length === 0 && (
        <p className="text-gray-400 text-center py-12">
          No scripts generated yet. Go to Keywords, generate a draft, then click &quot;+ Script&quot;.
        </p>
      )}
    </div>
  )
}
