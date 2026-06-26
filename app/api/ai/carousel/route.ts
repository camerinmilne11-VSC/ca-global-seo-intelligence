export const runtime     = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { generateCarousel } from '@/lib/claude'
import { createClient } from '@/lib/supabase-server'
import { createServiceClient } from '@/lib/supabase-service'

export async function POST(req: Request) {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  if (!body?.keywordId) {
    return NextResponse.json({ error: 'keywordId required' }, { status: 400 })
  }

  const db = createServiceClient()

  const { data: kw, error: kwErr } = await db
    .from('keywords')
    .select('*, brand:brands(name,slug), draft:drafts(seo_title,content)')
    .eq('id', body.keywordId)
    .single()

  if (kwErr || !kw) {
    return NextResponse.json({ error: 'Keyword not found' }, { status: 404 })
  }

  if (!kw.draft?.content) {
    return NextResponse.json({ error: 'Generate a draft first before creating a carousel' }, { status: 400 })
  }

  let carousel: Awaited<ReturnType<typeof generateCarousel>>
  try {
    carousel = await generateCarousel({
      keyword:        kw.keyword,
      brandName:      kw.brand?.name ?? 'CA Global',
      brandSlug:      kw.brand?.slug,
      articleTitle:   kw.draft.seo_title,
      articleContent: kw.draft.content,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Carousel generation failed'
    return NextResponse.json({ error: message }, { status: 502 })
  }

  const { data, error } = await db
    .from('carousels')
    .upsert(
      { keyword_id: body.keywordId, slides: carousel.slides, generated_at: new Date().toISOString() },
      { onConflict: 'keyword_id' },
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
