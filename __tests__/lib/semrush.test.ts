import { describe, it, expect } from 'vitest'
import { calculatePriorityScore, parseSemrushCsv } from '@/lib/semrush'
import type { PriorityScoreInput } from '@/types'

describe('calculatePriorityScore', () => {
  it('scores high-volume, low-difficulty, commercial keyword near 100', () => {
    const input: PriorityScoreInput = {
      keyword: 'executive recruitment africa',
      volume: 12000,
      difficulty: 15,
      cpc: 4.50,
      intent: 'C',
      hasContentGap: true,
    }
    expect(calculatePriorityScore(input)).toBeGreaterThan(80)
  })

  it('scores zero-volume keyword near 0', () => {
    const input: PriorityScoreInput = {
      keyword: 'obscure unrelated term',
      volume: 0,
      difficulty: 80,
      cpc: 0,
      intent: 'I',
      hasContentGap: false,
    }
    expect(calculatePriorityScore(input)).toBeLessThan(30)
  })

  it('gives content gap bonus', () => {
    const base: PriorityScoreInput = {
      keyword: 'mining recruitment botswana',
      volume: 500,
      difficulty: 30,
      cpc: 2.00,
      intent: 'C',
      hasContentGap: false,
    }
    const withGap = { ...base, hasContentGap: true }
    expect(calculatePriorityScore(withGap)).toBeGreaterThan(calculatePriorityScore(base))
  })

  it('returns a value between 0 and 100', () => {
    const input: PriorityScoreInput = {
      keyword: 'finance director recruitment',
      volume: 1900,
      difficulty: 45,
      cpc: 3.20,
      intent: 'T',
      hasContentGap: false,
    }
    const score = calculatePriorityScore(input)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('parseSemrushCsv', () => {
  it('parses semicolon-separated SEMrush response', () => {
    const csv = `Keyword;Search Volume;CPC;Competition;Keyword Difficulty Index;Intent\nexecutive recruitment;1900;3.50;0.80;42;C`
    const result = parseSemrushCsv(csv)
    expect(result).toHaveLength(1)
    expect(result[0].keyword).toBe('executive recruitment')
    expect(result[0].volume).toBe(1900)
    expect(result[0].difficulty).toBe(42)
    expect(result[0].cpc).toBe(3.50)
    expect(result[0].intent).toBe('C')
  })

  it('returns empty array on SEMrush error response', () => {
    const csv = `ERROR 50 :: NOTHING_FOUND`
    expect(parseSemrushCsv(csv)).toEqual([])
  })

  it('skips rows with zero volume', () => {
    const csv = `Keyword;Search Volume;CPC;Competition;Keyword Difficulty Index;Intent\nreal keyword;500;1.00;0.50;30;I\nzero keyword;0;0.00;0.00;0;I`
    const result = parseSemrushCsv(csv)
    expect(result).toHaveLength(1)
    expect(result[0].keyword).toBe('real keyword')
  })
})
