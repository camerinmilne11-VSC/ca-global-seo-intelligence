import { describe, it, expect, vi } from 'vitest'

const { mockCreate } = vi.hoisted(() => ({ mockCreate: vi.fn() }))

// Mock Anthropic SDK — expose mockCreate so tests can override per call
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = { create: mockCreate }
  }
}))

// Mock fs for knowledge base
vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue('# Mock KB Content'),
}))

import { generateBrief, generateDraft } from '@/lib/claude'

describe('generateBrief', () => {
  it('returns a parsed Brief object', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{
        type: 'text',
        text: JSON.stringify({
          recommended_title: 'Test Title',
          alt_titles: ['Alt 1'],
          intent_analysis: 'Commercial intent targeting recruiters.',
          primary_keyword: 'executive recruitment africa',
          secondary_keywords: ['executive search africa'],
          related_queries: ['how to recruit executives in africa'],
          faqs: [{ question: 'Q?', answer: 'A.' }],
          internal_links: ['About Us → /about'],
          ctas: ['Contact our team'],
          article_length_words: 1500,
          heading_structure: { h1: 'H1', h2s: [{ heading: 'H2', h3s: [] }] },
          content_angle: 'Positioning CA Global as the expert.',
        }),
      }],
    })

    const result = await generateBrief({
      keyword: 'executive recruitment africa',
      volume: 1900,
      difficulty: 35,
      intent: 'C',
      clusterName: 'Executive Search',
      brandName: 'CA Global',
    })

    expect(result.recommended_title).toBe('Test Title')
    expect(result.secondary_keywords).toContain('executive search africa')
    expect(result.article_length_words).toBe(1500)
  })
})

describe('generateDraft', () => {
  it('returns a parsed Draft object', async () => {
    mockCreate.mockResolvedValueOnce({
      content: [{
        type: 'text',
        text: JSON.stringify({
          seo_title: 'Executive Recruitment Africa | CA Global',
          meta_description: 'Find the best executive recruitment services in Africa with CA Global.',
          content: '# Executive Recruitment in Africa\n\nAfrica has distinct talent pools.\n\n## Why It Matters\n\nCA Global operates across 54 countries.',
        }),
      }],
    })

    const result = await generateDraft({
      keyword: 'executive recruitment africa',
      volume: 1900,
      difficulty: 35,
      intent: 'C',
      clusterName: 'Executive Search',
      brandName: 'CA Global',
    })

    expect(result.seo_title).toBe('Executive Recruitment Africa | CA Global')
    expect(result.meta_description).toContain('CA Global')
    expect(result.content).toContain('# Executive Recruitment in Africa')
  })
})
