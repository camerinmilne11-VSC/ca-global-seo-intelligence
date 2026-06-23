export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-service'

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!body?.keywordId) {
    return NextResponse.json({ error: 'keywordId required' }, { status: 400 })
  }

  const db = createServiceClient()

  await db.from('briefs').delete().eq('keyword_id', body.keywordId)
  await db.from('drafts').delete().eq('keyword_id', body.keywordId)
  await db.from('socials').delete().eq('keyword_id', body.keywordId)

  return NextResponse.json({ ok: true })
}
