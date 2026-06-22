/**
 * Shared pure-logic helpers extracted from UI components.
 * Kept in lib/ so they can be unit-tested without a browser/jsdom environment.
 */

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
