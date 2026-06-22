export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-service'
import type { ContentStatus } from '@/types'

const VALID: ContentStatus[] = ['opportunity', 'in_progress', 'published', 'paused']

export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { keywordId, status } = body as { keywordId?: string; status?: ContentStatus }

  if (!keywordId || !VALID.includes(status as ContentStatus)) {
    return NextResponse.json(
      { error: 'keywordId and valid status required' },
      { status: 400 },
    )
  }

  const db = createServiceClient()
  const { error } = await db
    .from('keywords')
    .update({ content_status: status })
    .eq('id', keywordId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
