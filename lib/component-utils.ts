/**
 * Shared pure-logic helpers extracted from UI components.
 * Kept in lib/ so they can be unit-tested without a browser/jsdom environment.
 */
import type { KeywordWithRelations, ContentStatus } from '@/types'

// ─── BrandSwitcher ────────────────────────────────────────────────────────────

export const BRANDS = [
  { label: 'CA Global',  slug: 'ca-global' },
  { label: 'CA Mining',  slug: 'ca-mining' },
  { label: 'CA Finance', slug: 'ca-finance' },
] as const

export type BrandSlug = (typeof BRANDS)[number]['slug']

/** Returns the slug of the active brand based on the current pathname. */
export function getActiveBrand(pathname: string): BrandSlug | undefined {
  return BRANDS.find(b => pathname.includes(b.slug))?.slug
}

/** Returns the keywords page href for a given brand slug. */
export function getBrandHref(slug: BrandSlug): string {
  return `/${slug}/keywords`
}

// ─── OpportunityScore ─────────────────────────────────────────────────────────

/**
 * Returns the Tailwind colour classes for an opportunity score.
 * green 80–100 | amber 50–79 | grey 0–49
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
  if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200'
  return 'bg-gray-100 text-gray-600 border-gray-200'
}

// ─── SyncButton ───────────────────────────────────────────────────────────────

// ─── KeywordRow helpers ───────────────────────────────────────────────────────

const STATUS_COLORS: Record<ContentStatus, string> = {
  opportunity: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-yellow-50 text-yellow-700',
  published:   'bg-green-50 text-green-700',
  paused:      'bg-gray-50 text-gray-500',
}

/** Returns Tailwind classes for a content status badge. */
export function getStatusColor(status: ContentStatus): string {
  return STATUS_COLORS[status] ?? 'bg-gray-50 text-gray-500'
}

const INTENT_LABELS: Record<string, string> = {
  I: 'Informational',
  N: 'Navigational',
  C: 'Commercial',
  T: 'Transactional',
}

/** Returns the human-readable label for a search intent code. */
export function getIntentLabel(intent: string): string {
  return INTENT_LABELS[intent] ?? intent
}

/** Converts a ContentStatus value to display text (replaces underscore with space). */
export function formatStatusLabel(status: ContentStatus): string {
  return status.replace('_', ' ')
}

// ─── KeywordTable helpers ─────────────────────────────────────────────────────

export type SortField = 'priority_score' | 'volume' | 'difficulty' | 'keyword'

/**
 * Filters a keyword list by search term (case-insensitive) and status.
 * statusFilter === 'all' skips status filtering.
 */
export function filterKeywords(
  keywords: KeywordWithRelations[],
  search: string,
  statusFilter: ContentStatus | 'all',
): KeywordWithRelations[] {
  const term = search.toLowerCase()
  return keywords.filter(k => {
    const matchSearch = term === '' || k.keyword.toLowerCase().includes(term)
    const matchStatus = statusFilter === 'all' || k.content_status === statusFilter
    return matchSearch && matchStatus
  })
}

/**
 * Sorts a keyword list by the given field and direction.
 * Returns a new array — does not mutate the input.
 */
export function sortKeywords(
  keywords: KeywordWithRelations[],
  field: SortField,
  dir: 'asc' | 'desc',
): KeywordWithRelations[] {
  return [...keywords].sort((a, b) => {
    const av = a[field]
    const bv = b[field]
    const cmp = typeof av === 'string'
      ? (av as string).localeCompare(bv as string)
      : (av as number) - (bv as number)
    return dir === 'asc' ? cmp : -cmp
  })
}

// ─── SyncButton ───────────────────────────────────────────────────────────────

/** Builds the SEMrush sync API URL for a given brand slug. */
export function buildSyncUrl(brand: string): string {
  return `/api/semrush/sync?brand=${brand}`
}

/** Formats the status message displayed after a sync attempt. */
export function parseSyncResponse(
  json: Record<string, unknown>,
  ok: boolean,
): string {
  if (ok) {
    const count = typeof json.synced === 'number' ? json.synced : 0
    return `Synced ${count} keywords`
  }
  return `Error: ${typeof json.error === 'string' ? json.error : 'Unknown error'}`
}
