export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-service'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { topic, brandSlug, intent } = body

  if (!topic?.trim() || !brandSlug) {
    return NextResponse.json({ error: 'topic and brandSlug required' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: brand, error: brandErr } = await db
    .from('brands')
    .select('id')
    .eq('slug', brandSlug)
    .single()

  if (brandErr || !brand) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  const { data, error } = await db
    .from('keywords')
    .insert({
      brand_id:             brand.id,
      keyword:              topic.trim(),
      volume:               0,
      difficulty:           0,
      search_intent:        intent ?? 'I',
      priority_score:       0,
      opportunity_rationale: 'Manually added topic',
      content_status:       'opportunity',
      source:               'manual',
      last_synced:          new Date().toISOString(),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
