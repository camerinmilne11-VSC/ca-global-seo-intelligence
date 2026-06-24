export const runtime = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import {
  getRelatedKeywords, getDomainKeywords,
  calculatePriorityScore, buildOpportunityRationale,
} from '@/lib/semrush'
import { createServiceClient } from '@/lib/supabase-service'

const SEED_KEYWORDS: Record<string, string[]> = {
  'ca-global':  [
    'executive recruitment africa', 'headhunting africa',
    'talent acquisition africa', 'recruitment agency africa', 'c-suite recruitment',
  ],
  'ca-mining':  [
    'mining recruitment', 'mining jobs africa', 'mining executive search',
    'mining talent africa', 'commodities recruitment',
  ],
  'ca-finance': [
    'finance recruitment africa', 'banking recruitment africa', 'cfo recruitment',
    'financial services talent', 'investment recruitment africa',
  ],
  'vogue-hygiene': [
    'commercial cleaning services south africa', 'industrial cleaning cape town',
    'hygiene solutions gauteng', 'eco friendly cleaning company',
    'office cleaning services south africa',
  ],
  'ca-global-hr': [
    'employer of record south africa', 'peo services africa',
    'hr outsourcing south africa', 'payroll management south africa',
    'eor services africa',
  ],
}

export async function POST(req: NextRequest | Request) {
  const url = new URL(req.url)
  const brand = url.searchParams.get('brand')
  if (!brand || !SEED_KEYWORDS[brand]) {
    return NextResponse.json({ error: 'Valid brand param required' }, { status: 400 })
  }

  const db = createServiceClient()

  // Get brand row
  const { data: brandRow, error: brandErr } = await db
    .from('brands').select('*').eq('slug', brand).single()
  if (brandErr || !brandRow) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  // Fetch current domain keywords to detect gaps (non-fatal — augments seed data only)
  let rankedSet = new Set<string>()
  try {
    const domainKws = await getDomainKeywords(brandRow.domain, 200)
    rankedSet = new Set(domainKws.map(k => k.keyword.toLowerCase()))
  } catch (domainErr) {
    console.error('[sync] getDomainKeywords failed, continuing without domain data:', domainErr)
  }

  // Expand each seed keyword into related keywords; partial failures are tolerated
  const seeds    = SEED_KEYWORDS[brand]
  const settled  = await Promise.allSettled(seeds.map(s => getRelatedKeywords(s, 30)))
  settled
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .forEach(r => console.error('[sync] getRelatedKeywords failed for a seed:', r.reason))
  const flat     = settled
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getRelatedKeywords>>> => r.status === 'fulfilled')
    .flatMap(r => r.value)

  // Deduplicate
  const seen     = new Set<string>()
  const unique   = flat.filter(k => {
    const key = k.keyword.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Score and upsert
  const rows = unique.map(kw => {
    const hasGap  = !rankedSet.has(kw.keyword.toLowerCase())
    const score   = calculatePriorityScore({ ...kw, hasContentGap: hasGap })
    const rationale = buildOpportunityRationale({ ...kw, hasContentGap: hasGap })
    return {
      brand_id:             brandRow.id,
      keyword:              kw.keyword,
      volume:               kw.volume,
      difficulty:           Math.round(kw.difficulty),
      search_intent:        kw.intent,
      priority_score:       score,
      opportunity_rationale: rationale,
      content_status:       'opportunity' as const,
      last_synced:          new Date().toISOString(),
    }
  })

  const { error } = await db.from('keywords').upsert(rows, {
    onConflict:          'brand_id,keyword',
    ignoreDuplicates:    false,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ synced: rows.length, brand })
}
