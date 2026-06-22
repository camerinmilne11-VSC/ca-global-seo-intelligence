import type { SemrushKeyword, PriorityScoreInput, SearchIntent } from '@/types'

const SEMRUSH_BASE = 'https://api.semrush.com'
const DATABASE     = 'us'

// ─── CSV Parser ──────────────────────────────────────────────────────────────

const COLUMN_MAP: Record<string, string> = {
  'Keyword':                    'keyword',
  'Search Volume':              'volume',
  'CPC':                        'cpc',
  'Keyword Difficulty Index':   'difficulty',
  'Intent':                     'intent',
  'Competition':                'competition',
}

export function parseSemrushCsv(text: string): SemrushKeyword[] {
  if (!text || text.startsWith('ERROR') || text.trim() === '') return []
  const lines = text.trim().split('\n').filter(Boolean)
  if (lines.length < 2) return []

  const headers = lines[0].split(';')
  return lines.slice(1).reduce<SemrushKeyword[]>((acc, line) => {
    const values = line.split(';')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      const key = COLUMN_MAP[h.trim()] || h.trim()
      row[key] = values[i]?.trim() || ''
    })
    const volume = parseInt(row.volume || '0', 10)
    if (!row.keyword || volume === 0) return acc
    acc.push({
      keyword:    row.keyword,
      volume,
      difficulty: parseFloat(row.difficulty || '50'),
      cpc:        parseFloat(row.cpc || '0'),
      intent:     (row.intent as SearchIntent) || 'I',
    })
    return acc
  }, [])
}

// ─── API Calls ───────────────────────────────────────────────────────────────

function buildUrl(params: Record<string, string>): string {
  const url = new URL(SEMRUSH_BASE)
  const key = process.env.SEMRUSH_API_KEY
  if (!key) throw new Error('SEMRUSH_API_KEY not set')
  Object.entries({ ...params, key, database: DATABASE }).forEach(([k, v]) =>
    url.searchParams.set(k, v)
  )
  return url.toString()
}

export async function getKeywordData(keyword: string): Promise<SemrushKeyword | null> {
  const url = buildUrl({
    type:           'phrase_this',
    phrase:         keyword,
    export_columns: 'Ph,Nq,Cp,Co,Kd,In',
  })
  const res  = await fetch(url)
  const text = await res.text()
  const rows = parseSemrushCsv(text)
  return rows[0] ?? null
}

export async function getRelatedKeywords(keyword: string, limit = 40): Promise<SemrushKeyword[]> {
  const url = buildUrl({
    type:           'phrase_related',
    phrase:         keyword,
    export_columns: 'Ph,Nq,Cp,Co,Kd,In',
    display_limit:  String(limit),
    display_sort:   'nq_desc',
  })
  const res  = await fetch(url)
  const text = await res.text()
  return parseSemrushCsv(text)
}

export async function getDomainKeywords(domain: string, limit = 100): Promise<(SemrushKeyword & { position: number })[]> {
  const url = buildUrl({
    type:           'domain_organic',
    domain,
    export_columns: 'Ph,Nq,Cp,Co,Kd,In,Po',
    display_limit:  String(limit),
    display_sort:   'nq_desc',
  })
  const res  = await fetch(url)
  const text = await res.text()

  // Build a keyword → position map from the raw CSV (Position column not in COLUMN_MAP)
  const positionMap = new Map<string, number>()
  if (text && !text.startsWith('ERROR') && text.trim() !== '') {
    const lines = text.trim().split('\n').filter(Boolean)
    if (lines.length >= 2) {
      const headers = lines[0].split(';').map(h => h.trim())
      const kwIdx  = headers.indexOf('Keyword')
      const posIdx = headers.indexOf('Position')
      if (kwIdx !== -1 && posIdx !== -1) {
        lines.slice(1).forEach(line => {
          const values = line.split(';')
          const kw  = values[kwIdx]?.trim()
          const pos = parseInt(values[posIdx]?.trim() || '100', 10)
          if (kw) positionMap.set(kw, pos)
        })
      }
    }
  }

  // Reuse parseSemrushCsv for all core keyword fields
  return parseSemrushCsv(text).map(kw => ({
    ...kw,
    position: positionMap.get(kw.keyword) ?? 100,
  }))
}

// ─── Priority Scoring ────────────────────────────────────────────────────────

const RECRUITMENT_TERMS = [
  'recruit','recruiter','recruitment','hire','hiring','job','jobs','career',
  'careers','talent','executive','headhunt','headhunting','candidate','vacancy',
  'vacancies','staffing','placement','search','workforce','c-suite','director',
  'manager','officer','engineer','analyst',
]

const AFRICA_TERMS = [
  'africa','african','south africa','nigeria','kenya','ghana','botswana',
  'zambia','zimbabwe','tanzania','mozambique','namibia','angola','drc','congo',
  'cameroon','ethiopia','global','international','worldwide',
]

function scoreVolume(v: number): number {
  if (v >= 10000) return 100
  if (v <= 10)    return 0
  return Math.round((Math.log10(v) - 1) / (Math.log10(10000) - 1) * 100)
}

function scoreCpc(cpc: number): number {
  if (cpc >= 3) return 100
  if (cpc >= 1) return 60
  return 20
}

function intentScore(intent: SearchIntent): number {
  return { T: 100, C: 85, I: 50, N: 20 }[intent] ?? 50
}

export function calculatePriorityScore(input: PriorityScoreInput): number {
  const kw = input.keyword.toLowerCase()

  const volumeScore      = scoreVolume(input.volume)
  const easeScore        = 100 - input.difficulty
  const commercialScore  = Math.round((scoreCpc(input.cpc) + intentScore(input.intent)) / 2)
  const recruitmentScore = RECRUITMENT_TERMS.some(t => kw.includes(t)) ? 100 : 30
  const geoScore         = AFRICA_TERMS.some(t => kw.includes(t)) ? 100 : 50
  const dualScore        = 70  // most recruitment keywords serve both audiences
  const gapScore         = input.hasContentGap ? 100 : 0

  const raw = (
    volumeScore      * 0.25 +
    easeScore        * 0.20 +
    commercialScore  * 0.15 +
    recruitmentScore * 0.15 +
    geoScore         * 0.10 +
    dualScore        * 0.10 +
    gapScore         * 0.05
  )

  return Math.min(100, Math.max(0, Math.round(raw)))
}

export function buildOpportunityRationale(kw: SemrushKeyword & { hasContentGap: boolean }): string {
  const parts: string[] = []
  if (kw.volume >= 1000) parts.push(`${kw.volume.toLocaleString()} monthly searches`)
  if (kw.difficulty < 40) parts.push(`low competition (KD ${kw.difficulty})`)
  if (kw.intent === 'C' || kw.intent === 'T') parts.push('commercial/transactional intent')
  if (kw.hasContentGap) parts.push('competitor ranks, we do not')
  if (kw.cpc >= 2) parts.push(`high CPC ($${kw.cpc.toFixed(2)}) signals commercial value`)
  return parts.length > 0 ? parts.join(' · ') : 'Relevant keyword opportunity'
}
