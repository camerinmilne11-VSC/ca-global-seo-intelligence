export const runtime     = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { generateBrief } from '@/lib/claude'
import { createServiceClient } from '@/lib/supabase-service'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!body?.keywordId) {
    return NextResponse.json({ error: 'keywordId required' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: kw, error: kwErr } = await db
    .from('keywords')
    .select('*, brand:brands(name,slug), cluster:clusters(pillar_name)')
    .eq('id', body.keywordId)
    .single()

  if (kwErr || !kw) {
    return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
  }

  let brief: Awaited<ReturnType<typeof generateBrief>>
  try {
    brief = await generateBrief({
      keyword:     kw.keyword,
      volume:      kw.volume,
      difficulty:  kw.difficulty,
      intent:      kw.search_intent,
      clusterName: kw.cluster?.pillar_name ?? 'General',
      brandName:   kw.brand?.name ?? 'CA Global',
      brandSlug:   kw.brand?.slug,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Brief generation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const { data, error } = await db
    .from('briefs')
    .upsert(
      { keyword_id: body.keywordId, ...brief, generated_at: new Date().toISOString() },
      { onConflict: 'keyword_id' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Merge upsert-returned row with the generated brief so all fields are present
  const row = Array.isArray(data) ? (data[0] ?? {}) : (data ?? {})
  return NextResponse.json({ keyword_id: body.keywordId, ...brief, ...row })
}
