export const runtime     = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { generateSocial } from '@/lib/claude'
import { createServiceClient } from '@/lib/supabase-service'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!body?.keywordId) {
    return NextResponse.json({ error: 'keywordId required' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: kw, error: kwErr } = await db
    .from('keywords')
    .select('*, brand:brands(name,slug), draft:drafts(seo_title, content)')
    .eq('id', body.keywordId)
    .single()

  if (kwErr || !kw) {
    return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
  }

  let social: Awaited<ReturnType<typeof generateSocial>>
  try {
    social = await generateSocial({
      keyword:         kw.keyword,
      brandName:       kw.brand?.name ?? 'CA Global',
      brandSlug:       kw.brand?.slug,
      articleTitle:    kw.draft?.seo_title ?? undefined,
      articleContent:  kw.draft?.content ?? undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Social generation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const { data, error } = await db
    .from('socials')
    .upsert(
      { keyword_id: body.keywordId, ...social, generated_at: new Date().toISOString() },
      { onConflict: 'keyword_id' },
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
