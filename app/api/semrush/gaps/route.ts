export const runtime     = 'nodejs'
export const maxDuration = 30

import { NextRequest, NextResponse } from 'next/server'
import { getDomainKeywords } from '@/lib/semrush'
import { createServiceClient } from '@/lib/supabase-service'

const COMPETITORS: Record<string, string[]> = {
  'ca-global':    ['michaelpage.co.za', 'executivesearch.africa', 'humancapital.co.za'],
  'ca-mining':    ['miningpeople.com.au', 'mining-recruitment.com'],
  'ca-finance':   ['robertwalters.co.za', 'heidrick.com'],
  'vogue-hygiene':['bidvestservices.co.za', 'servest.co.za', 'compass-group.co.za'],
  'ca-global-hr': ['deel.com', 'remote.com', 'papayaglobal.com'],
}

export async function POST(req: NextRequest | Request) {
  const url   = new URL(req.url)
  const brand = url.searchParams.get('brand')

  if (!brand || !COMPETITORS[brand]) {
    return NextResponse.json({ error: 'Valid brand param required' }, { status: 400 })
  }

  const db = createServiceClient()
  const { data: brandRow, error: brandErr } = await db
    .from('brands').select('*').eq('slug', brand).single()
  if (brandErr || !brandRow) {
    return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
  }

  // Fetch keywords the brand already ranks for
  const brandKws = await getDomainKeywords(brandRow.domain, 300)
  const rankedSet = new Set(brandKws.map(k => k.keyword.toLowerCase()))

  const results: { domain: string; gapCount: number }[] = []

  for (const competitorDomain of COMPETITORS[brand]) {
    let competitorKws: Awaited<ReturnType<typeof getDomainKeywords>> = []
    try {
      competitorKws = await getDomainKeywords(competitorDomain, 300)
    } catch (err) {
      console.error(`[gaps] getDomainKeywords failed for ${competitorDomain}:`, err)
      continue
    }

    const gaps = competitorKws
      .filter(k => !rankedSet.has(k.keyword.toLowerCase()))
      .map(k => k.keyword)

    const { error } = await db.from('competitors').upsert({
      brand_id:          brandRow.id,
      competitor_domain: competitorDomain,
      gap_keywords:      gaps,
      tracked_since:     new Date().toISOString(),
    }, { onConflict: 'brand_id,competitor_domain' })

    if (!error) results.push({ domain: competitorDomain, gapCount: gaps.length })
  }

  return NextResponse.json({ brand, competitors: results })
}
