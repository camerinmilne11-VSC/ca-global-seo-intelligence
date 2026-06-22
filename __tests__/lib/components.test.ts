import { describe, it, expect } from 'vitest'
import { getScoreColor, BRANDS, getActiveBrand, getBrandHref, buildSyncUrl, parseSyncResponse } from '@/lib/component-utils'

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
