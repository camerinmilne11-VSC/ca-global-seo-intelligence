import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/claude', () => ({
  generateBrief: vi.fn().mockResolvedValue({
    recommended_title: 'How to Recruit Executives in Africa',
    alt_titles: ['Executive Recruitment Africa Guide'],
    intent_analysis: 'Users want to understand the process.',
    primary_keyword: 'executive recruitment africa',
    secondary_keywords: ['c-suite africa'],
    related_queries: ['how to hire executives'],
    faqs: [{ question: 'Q?', answer: 'A.' }],
    internal_links: ['About → /about'],
    ctas: ['Contact us'],
    article_length_words: 1500,
    heading_structure: { h1: 'H1', h2s: [] },
    content_angle: 'Expert guide positioning.',
  }),
}))

vi.mock('@/lib/supabase-service', () => ({
  createServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          id: 'kw-uuid', keyword: 'executive recruitment africa',
          volume: 1900, difficulty: 35, search_intent: 'C', cluster_id: null,
          brand: { name: 'CA Global', slug: 'ca-global' },
          cluster: null,
        },
        error: null,
      }),
      upsert: vi.fn().mockResolvedValue({ data: [{ id: 'brief-uuid' }], error: null }),
    })),
  })),
}))

import { POST } from '@/app/api/ai/brief/route'

describe('POST /api/ai/brief', () => {
  it('returns 400 when keywordId missing', async () => {
    const req = new Request('http://localhost/api/ai/brief', {
      method: 'POST', body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns generated brief on success', async () => {
    const req = new Request('http://localhost/api/ai/brief', {
      method: 'POST', body: JSON.stringify({ keywordId: 'kw-uuid' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res  = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.recommended_title).toBe('How to Recruit Executives in Africa')
  })
})
