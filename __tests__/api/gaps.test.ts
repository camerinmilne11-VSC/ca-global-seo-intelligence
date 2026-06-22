import { describe, it, expect, vi, beforeEach } from 'vitest'

// Brand domain keywords — what our brand already ranks for
const brandKeywords = [
  { keyword: 'executive recruitment africa', volume: 1900, difficulty: 35, cpc: 3.50, intent: 'C', position: 4 },
]

// Competitor keywords — includes one gap (brand doesn't rank for it)
const competitorKeywords = [
  { keyword: 'executive recruitment africa', volume: 1900, difficulty: 35, cpc: 3.50, intent: 'C', position: 2 },
  { keyword: 'headhunting south africa', volume: 880, difficulty: 42, cpc: 2.80, intent: 'C', position: 1 },
]

vi.mock('@/lib/semrush', () => ({
  getDomainKeywords: vi.fn().mockImplementation((domain: string) => {
    if (domain === 'caglobalint.com') return Promise.resolve(brandKeywords)
    return Promise.resolve(competitorKeywords)
  }),
}))

const mockUpsert = vi.fn().mockResolvedValue({ error: null })
vi.mock('@/lib/supabase-service', () => ({
  createServiceClient: vi.fn(() => ({
    from: vi.fn((_table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { id: 'brand-uuid', name: 'CA Global', slug: 'ca-global', domain: 'caglobalint.com' },
        error: null,
      }),
      upsert: mockUpsert,
    })),
  })),
}))

import { POST } from '@/app/api/semrush/gaps/route'

describe('POST /api/semrush/gaps', () => {
  beforeEach(() => {
    mockUpsert.mockClear()
  })

  it('returns 400 when brand param is missing', async () => {
    const req = new Request('http://localhost/api/semrush/gaps', { method: 'POST' })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toHaveProperty('error')
  })

  it('returns 400 when brand param is invalid', async () => {
    const req = new Request('http://localhost/api/semrush/gaps?brand=unknown-brand', { method: 'POST' })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('returns 200 with competitors array on success', async () => {
    const req = new Request('http://localhost/api/semrush/gaps?brand=ca-global', { method: 'POST' })
    const res = await POST(req as any)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty('brand', 'ca-global')
    expect(json).toHaveProperty('competitors')
    expect(Array.isArray(json.competitors)).toBe(true)
  })

  it('reports correct gapCount — excludes keywords brand already ranks for', async () => {
    const req = new Request('http://localhost/api/semrush/gaps?brand=ca-global', { method: 'POST' })
    const res = await POST(req as any)
    const json = await res.json()
    // ca-global has 3 competitors; each should report gapCount=1 (headhunting south africa is the gap)
    for (const competitor of json.competitors) {
      expect(competitor.gapCount).toBe(1)
    }
  })

  it('upserts one record per competitor', async () => {
    const req = new Request('http://localhost/api/semrush/gaps?brand=ca-global', { method: 'POST' })
    await POST(req as any)
    // ca-global has 3 competitors in COMPETITORS map
    expect(mockUpsert).toHaveBeenCalledTimes(3)
  })

  it('upserted record contains gap_keywords array', async () => {
    const req = new Request('http://localhost/api/semrush/gaps?brand=ca-global', { method: 'POST' })
    await POST(req as any)
    const firstCall = mockUpsert.mock.calls[0][0]
    expect(firstCall).toHaveProperty('gap_keywords')
    expect(Array.isArray(firstCall.gap_keywords)).toBe(true)
    expect(firstCall.gap_keywords).toContain('headhunting south africa')
  })
})
