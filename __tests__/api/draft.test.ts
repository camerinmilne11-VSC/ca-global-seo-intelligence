import { describe, it, expect, vi } from 'vitest'

const { mockDraft, mockKeyword } = vi.hoisted(() => {
  const mockDraft = {
    proposed_title:   'How to Hire Executive Talent in Africa',
    seo_title:        'Executive Recruitment Africa | CA Global',
    meta_description: 'Find top executive talent across Africa with CA Global.',
    h1:               'Executive Recruitment in Africa',
    h2_structure:     ['Why Africa?', 'Our Process', 'FAQs'],
    intro_suggestion: 'Africa is a growing hub for executive talent.',
    key_points:       ['Market overview', 'Selection process', 'Onboarding'],
    faq_section:      [{ question: 'How long does it take?', answer: '4–8 weeks on average.' }],
    internal_links:   ['About → /about'],
    cta:              'Start your search today',
  }
  const mockKeyword = {
    id: 'kw-uuid',
    keyword: 'executive recruitment africa',
    volume: 1900,
    difficulty: 35,
    search_intent: 'C',
    cluster_id: null,
    brand:   { name: 'CA Global', slug: 'ca-global' },
    cluster: null,
    brief: {
      id: 'brief-uuid',
      recommended_title: 'How to Recruit Executives in Africa',
      content_angle: 'Expert guide positioning.',
      heading_structure: { h1: 'H1', h2s: [] },
    },
  }
  return { mockDraft, mockKeyword }
})

vi.mock('@/lib/claude', () => ({
  generateDraft: vi.fn().mockResolvedValue(mockDraft),
}))

vi.mock('@/lib/supabase-service', () => ({
  createServiceClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockKeyword, error: null }),
      upsert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data:  { id: 'draft-uuid', keyword_id: 'kw-uuid', ...mockDraft, generated_at: '2026-01-01T00:00:00Z' },
          error: null,
        }),
      }),
    })),
  })),
}))

import { POST } from '@/app/api/ai/draft/route'

describe('POST /api/ai/draft', () => {
  it('returns 400 when keywordId missing', async () => {
    const req = new Request('http://localhost/api/ai/draft', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toHaveProperty('error')
  })

  it('returns 404 when keyword not found', async () => {
    const { createServiceClient } = await import('@/lib/supabase-service')
    vi.mocked(createServiceClient).mockReturnValueOnce({
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq:     vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
      })),
    } as any)

    const req = new Request('http://localhost/api/ai/draft', {
      method: 'POST',
      body: JSON.stringify({ keywordId: 'nonexistent' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(404)
  })

  it('returns 502 when generateDraft throws', async () => {
    const { generateDraft } = await import('@/lib/claude')
    vi.mocked(generateDraft).mockRejectedValueOnce(new Error('Claude API error'))

    const req = new Request('http://localhost/api/ai/draft', {
      method: 'POST',
      body: JSON.stringify({ keywordId: 'kw-uuid' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res = await POST(req)
    expect(res.status).toBe(502)
    const json = await res.json()
    expect(json).toHaveProperty('error', 'Claude API error')
  })

  it('returns generated draft on success', async () => {
    const req = new Request('http://localhost/api/ai/draft', {
      method: 'POST',
      body: JSON.stringify({ keywordId: 'kw-uuid' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const res  = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.proposed_title).toBe('How to Hire Executive Talent in Africa')
    expect(json.id).toBe('draft-uuid')
  })

  it('passes brief to generateDraft when keyword has one', async () => {
    const { generateDraft } = await import('@/lib/claude')
    vi.mocked(generateDraft).mockClear()

    const req = new Request('http://localhost/api/ai/draft', {
      method: 'POST',
      body: JSON.stringify({ keywordId: 'kw-uuid' }),
      headers: { 'Content-Type': 'application/json' },
    })
    await POST(req)
    expect(vi.mocked(generateDraft)).toHaveBeenCalledWith(
      expect.objectContaining({ brief: expect.objectContaining({ recommended_title: 'How to Recruit Executives in Africa' }) }),
    )
  })
})
