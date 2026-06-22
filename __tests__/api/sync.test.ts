import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/semrush', () => ({
  getRelatedKeywords:       vi.fn().mockResolvedValue([
    { keyword: 'executive recruitment africa', volume: 1900, difficulty: 35, cpc: 3.50, intent: 'C' },
  ]),
  getDomainKeywords:        vi.fn().mockResolvedValue([]),
  calculatePriorityScore:   vi.fn().mockReturnValue(82),
  buildOpportunityRationale: vi.fn().mockReturnValue('1,900 searches · low KD'),
}))

const mockUpsert = vi.fn().mockResolvedValue({ error: null })
vi.mock('@/lib/supabase-service', () => ({
  createServiceClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq:     vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'brand-uuid', name: 'CA Global', slug: 'ca-global', domain: 'caglobalint.com' }, error: null }),
      upsert: mockUpsert,
    })),
  })),
}))

import { POST } from '@/app/api/semrush/sync/route'

describe('POST /api/semrush/sync', () => {
  it('returns 400 when brand param missing', async () => {
    const req = new Request('http://localhost/api/semrush/sync', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 200 with synced count on success', async () => {
    const req = new Request('http://localhost/api/semrush/sync?brand=ca-global', { method: 'POST' })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty('synced')
  })
})
