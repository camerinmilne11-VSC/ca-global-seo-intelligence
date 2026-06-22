export const runtime     = 'nodejs'
export const maxDuration = 30

import { NextResponse } from 'next/server'
import { generateDraft } from '@/lib/claude'
import { createServiceClient } from '@/lib/supabase-service'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!body?.keywordId) {
    return NextResponse.json({ error: 'keywordId required' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: kw, error: kwErr } = await db
    .from('keywords')
    .select('*, brand:brands(name,slug), cluster:clusters(pillar_name), brief:briefs(*)')
    .eq('id', body.keywordId)
    .single()

  if (kwErr || !kw) {
    return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
  }

  let draft: Awaited<ReturnType<typeof generateDraft>>
  try {
    draft = await generateDraft({
      keyword:     kw.keyword,
      volume:      kw.volume,
      difficulty:  kw.difficulty,
      intent:      kw.search_intent,
      clusterName: kw.cluster?.pillar_name ?? 'General',
      brandName:   kw.brand?.name ?? 'CA Global',
      brief:       kw.brief ?? null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Draft generation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const { data, error } = await db
    .from('drafts')
    .upsert(
      { keyword_id: body.keywordId, ...draft, generated_at: new Date().toISOString() },
      { onConflict: 'keyword_id' },
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
