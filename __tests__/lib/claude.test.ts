import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => ({
  default: class MockAnthropic {
    messages = {
      create: vi.fn().mockResolvedValue({
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
          })
        }]
      })
    }
  }
}))

// Mock fs for knowledge base
vi.mock('fs', () => ({
  readFileSync: vi.fn().mockReturnValue('# Mock KB Content'),
}))

import { generateBrief } from '@/lib/claude'

describe('generateBrief', () => {
  it('returns a parsed Brief object', async () => {
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
