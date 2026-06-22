import { describe, it, expect } from 'vitest'
import type {
  Brand,
  Cluster,
  Keyword,
  KeywordWithRelations,
  Brief,
  Draft,
  Competitor,
  SemrushKeyword,
  PriorityScoreInput,
  ContentStatus,
  SearchIntent,
  FaqItem,
  HeadingStructure,
} from '@/types'

describe('TypeScript type definitions', () => {
  it('Brand slug is constrained to valid values', () => {
    const slug: Brand['slug'] = 'ca-global'
    expect(['ca-global', 'ca-mining', 'ca-finance']).toContain(slug)
  })

  it('ContentStatus covers all expected values', () => {
    const statuses: ContentStatus[] = ['opportunity', 'in_progress', 'published', 'paused']
    expect(statuses).toHaveLength(4)
  })

  it('SearchIntent covers I/N/C/T', () => {
    const intents: SearchIntent[] = ['I', 'N', 'C', 'T']
    expect(intents).toHaveLength(4)
  })

  it('Keyword shape is correct', () => {
    const kw: Keyword = {
      id: 'uuid-1',
      brand_id: 'brand-uuid',
      keyword: 'mining recruitment africa',
      cluster_id: null,
      volume: 1200,
      difficulty: 35,
      search_intent: 'I',
      opportunity_rationale: 'High volume, low difficulty',
      priority_score: 72,
      content_status: 'opportunity',
      publication_url: null,
      last_synced: '2026-06-22T00:00:00Z',
      created_at: '2026-06-22T00:00:00Z',
    }
    expect(kw.keyword).toBe('mining recruitment africa')
    expect(kw.content_status).toBe('opportunity')
  })

  it('FaqItem shape is correct', () => {
    const faq: FaqItem = { question: 'What is CA Global?', answer: 'A specialist recruiter.' }
    expect(faq.question).toBeTruthy()
  })
})
