import { describe, it, expect } from 'vitest'
import {
  getScoreColor, BRANDS, getActiveBrand, getBrandHref, buildSyncUrl, parseSyncResponse,
  getStatusColor, getIntentLabel, formatStatusLabel,
  filterKeywords, sortKeywords,
} from '@/lib/component-utils'
import type { KeywordWithRelations, ContentStatus } from '@/types'

// ─── OpportunityScore colour logic ────────────────────────────────────────────────

describe('OpportunityScore colour logic', () => {
  it('returns green classes for score >= 80', () => {
    expect(getScoreColor(80)).toContain('bg-green-100')
    expect(getScoreColor(100)).toContain('bg-green-100')
    expect(getScoreColor(99)).toContain('text-green-800')
  })

  it('returns amber classes for score 50–79', () => {
    expect(getScoreColor(50)).toContain('bg-amber-100')
    expect(getScoreColor(79)).toContain('bg-amber-100')
    expect(getScoreColor(65)).toContain('text-amber-800')
  })

  it('returns grey classes for score < 50', () => {
    expect(getScoreColor(0)).toContain('bg-gray-100')
    expect(getScoreColor(49)).toContain('bg-gray-100')
    expect(getScoreColor(10)).toContain('text-gray-600')
  })

  it('boundary: 79 is amber, 80 is green', () => {
    expect(getScoreColor(79)).toContain('bg-amber-100')
    expect(getScoreColor(80)).toContain('bg-green-100')
  })

  it('boundary: 49 is grey, 50 is amber', () => {
    expect(getScoreColor(49)).toContain('bg-gray-100')
    expect(getScoreColor(50)).toContain('bg-amber-100')
  })
})

// ─── BrandSwitcher logic ───────────────────────────────────────────────────

describe('BrandSwitcher logic', () => {
  it('identifies active brand from pathname', () => {
    expect(getActiveBrand('/ca-global/keywords')).toBe('ca-global')
    expect(getActiveBrand('/ca-mining/keywords')).toBe('ca-mining')
    expect(getActiveBrand('/ca-finance/keywords')).toBe('ca-finance')
  })

  it('returns undefined when no brand matches', () => {
    expect(getActiveBrand('/')).toBeUndefined()
    expect(getActiveBrand('/unknown/page')).toBeUndefined()
  })

  it('generates correct hrefs for each brand', () => {
    expect(getBrandHref('ca-global')).toBe('/ca-global/keywords')
    expect(getBrandHref('ca-mining')).toBe('/ca-mining/keywords')
    expect(getBrandHref('ca-finance')).toBe('/ca-finance/keywords')
  })

  it('exposes all three brand slugs', () => {
    const slugs = BRANDS.map(b => b.slug)
    expect(slugs).toContain('ca-global')
    expect(slugs).toContain('ca-mining')
    expect(slugs).toContain('ca-finance')
    expect(slugs).toHaveLength(3)
  })

  it('exposes correct brand labels', () => {
    expect(BRANDS.find(b => b.slug === 'ca-global')?.label).toBe('CA Global')
    expect(BRANDS.find(b => b.slug === 'ca-mining')?.label).toBe('CA Mining')
    expect(BRANDS.find(b => b.slug === 'ca-finance')?.label).toBe('CA Finance')
  })
})

// ─── SyncButton logic ──────────────────────────────────────────────────────

describe('SyncButton logic', () => {
  it('builds correct sync URL for each brand', () => {
    expect(buildSyncUrl('ca-global')).toBe('/api/semrush/sync?brand=ca-global')
    expect(buildSyncUrl('ca-mining')).toBe('/api/semrush/sync?brand=ca-mining')
    expect(buildSyncUrl('ca-finance')).toBe('/api/semrush/sync?brand=ca-finance')
  })

  it('formats success message with synced count', () => {
    expect(parseSyncResponse({ synced: 42 }, true)).toBe('Synced 42 keywords')
    expect(parseSyncResponse({ synced: 0 }, true)).toBe('Synced 0 keywords')
  })

  it('formats error message on failure', () => {
    expect(parseSyncResponse({ error: 'Rate limited' }, false)).toBe('Error: Rate limited')
  })
})

// ─── KeywordRow helpers ────────────────────────────────────────────────────────

describe('getStatusColor', () => {
  it('returns blue classes for opportunity', () => {
    expect(getStatusColor('opportunity')).toContain('text-blue-700')
  })
  it('returns yellow classes for in_progress', () => {
    expect(getStatusColor('in_progress')).toContain('text-yellow-700')
  })
  it('returns green classes for published', () => {
    expect(getStatusColor('published')).toContain('text-green-700')
  })
  it('returns gray classes for paused', () => {
    expect(getStatusColor('paused')).toContain('text-gray-500')
  })
})

describe('getIntentLabel', () => {
  it('maps I to Informational', () => expect(getIntentLabel('I')).toBe('Informational'))
  it('maps N to Navigational',  () => expect(getIntentLabel('N')).toBe('Navigational'))
  it('maps C to Commercial',    () => expect(getIntentLabel('C')).toBe('Commercial'))
  it('maps T to Transactional', () => expect(getIntentLabel('T')).toBe('Transactional'))
  it('returns the raw value for unknown intents', () => expect(getIntentLabel('X')).toBe('X'))
})

describe('formatStatusLabel', () => {
  it('replaces underscore with space in in_progress', () => {
    expect(formatStatusLabel('in_progress')).toBe('in progress')
  })
  it('leaves single-word statuses unchanged', () => {
    expect(formatStatusLabel('opportunity')).toBe('opportunity')
    expect(formatStatusLabel('published')).toBe('published')
    expect(formatStatusLabel('paused')).toBe('paused')
  })
})

// ─── KeywordTable helpers ──────────────────────────────────────────────────────

function makeKw(overrides: Partial<KeywordWithRelations> = {}): KeywordWithRelations {
  return {
    id: '1',
    brand_id: 'b1',
    keyword: 'mining jobs',
    cluster_id: null,
    volume: 1000,
    difficulty: 40,
    search_intent: 'I',
    opportunity_rationale: '',
    priority_score: 75,
    content_status: 'opportunity',
    publication_url: null,
    last_synced: '',
    created_at: '',
    brief: null,
    draft: null,
    ...overrides,
  }
}

describe('filterKeywords', () => {
  const kws: KeywordWithRelations[] = [
    makeKw({ id: '1', keyword: 'mining jobs',      content_status: 'opportunity' }),
    makeKw({ id: '2', keyword: 'finance careers',  content_status: 'published'   }),
    makeKw({ id: '3', keyword: 'mining engineer',  content_status: 'in_progress' }),
  ]

  it('returns all when search is empty and status is all', () => {
    expect(filterKeywords(kws, '', 'all')).toHaveLength(3)
  })

  it('filters by search term (case-insensitive)', () => {
    const result = filterKeywords(kws, 'Mining', 'all')
    expect(result).toHaveLength(2)
    expect(result.map(k => k.id)).toEqual(['1', '3'])
  })

  it('filters by status', () => {
    const result = filterKeywords(kws, '', 'published')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('2')
  })

  it('combines search and status filters', () => {
    const result = filterKeywords(kws, 'mining', 'opportunity')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('returns empty array when nothing matches', () => {
    expect(filterKeywords(kws, 'zzz', 'all')).toHaveLength(0)
  })
})

describe('sortKeywords', () => {
  const kws: KeywordWithRelations[] = [
    makeKw({ id: '1', keyword: 'banana', priority_score: 60, volume: 500,  difficulty: 30 }),
    makeKw({ id: '2', keyword: 'apple',  priority_score: 90, volume: 200,  difficulty: 70 }),
    makeKw({ id: '3', keyword: 'cherry', priority_score: 40, volume: 1000, difficulty: 50 }),
  ]

  it('sorts by priority_score descending', () => {
    const r = sortKeywords(kws, 'priority_score', 'desc')
    expect(r.map(k => k.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by priority_score ascending', () => {
    const r = sortKeywords(kws, 'priority_score', 'asc')
    expect(r.map(k => k.id)).toEqual(['3', '1', '2'])
  })

  it('sorts by volume descending', () => {
    const r = sortKeywords(kws, 'volume', 'desc')
    expect(r.map(k => k.id)).toEqual(['3', '1', '2'])
  })

  it('sorts by keyword ascending (alphabetical)', () => {
    const r = sortKeywords(kws, 'keyword', 'asc')
    expect(r.map(k => k.id)).toEqual(['2', '1', '3'])
  })

  it('sorts by keyword descending', () => {
    const r = sortKeywords(kws, 'keyword', 'desc')
    expect(r.map(k => k.id)).toEqual(['3', '1', '2'])
  })

  it('does not mutate the original array', () => {
    const original = [...kws]
    sortKeywords(kws, 'volume', 'desc')
    expect(kws.map(k => k.id)).toEqual(original.map(k => k.id))
  })
})
