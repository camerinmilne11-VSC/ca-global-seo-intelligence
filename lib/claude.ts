import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import type { Brief, Draft, SearchIntent } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL  = 'claude-sonnet-4-6'

function loadKnowledgeBase() {
  const kbDir = path.join(process.cwd(), 'knowledge-base')
  const read  = (file: string) => {
    try   { return fs.readFileSync(path.join(kbDir, file), 'utf-8') }
    catch { return `# ${file} not yet written` }
  }
  return {
    voice:            read('voice.md'),
    seo:              read('seo.md'),
    industry:         read('industry.md'),
    contentFramework: read('content-framework.md'),
  }
}

function systemPrompt(brandName: string): string {
  const kb = loadKnowledgeBase()
  return `You are a senior SEO content strategist for ${brandName}, a specialist recruitment firm operating across Africa and globally.

## Brand Voice
${kb.voice}

## SEO Standards
${kb.seo}

## Industry Knowledge
${kb.industry}

## Content Framework
${kb.contentFramework}

Always return valid JSON matching the exact schema requested. Do not wrap in markdown fences. Return only the JSON object.`
}

export async function generateBrief(params: {
  keyword: string
  volume: number
  difficulty: number
  intent: SearchIntent
  clusterName: string
  brandName: string
}): Promise<Omit<Brief, 'id' | 'keyword_id' | 'generated_at'>> {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 2000,
    system:     systemPrompt(params.brandName),
    messages:   [{
      role:    'user',
      content: `Generate a content brief for this keyword opportunity:

Keyword: "${params.keyword}"
Monthly Volume: ${params.volume.toLocaleString()}
Keyword Difficulty: ${params.difficulty}/100
Search Intent: ${params.intent} (I=informational, N=navigational, C=commercial, T=transactional)
Topic Cluster: ${params.clusterName}
Brand: ${params.brandName}

Return ONLY this JSON:
{
  "recommended_title": "string",
  "alt_titles": ["string", "string"],
  "intent_analysis": "2-3 sentences on what searchers want",
  "primary_keyword": "string",
  "secondary_keywords": ["string"],
  "related_queries": ["string"],
  "faqs": [{"question":"string","answer":"string"}],
  "internal_links": ["anchor text → suggested page/topic"],
  "ctas": ["string"],
  "article_length_words": number,
  "heading_structure": {"h1":"string","h2s":[{"heading":"string","h3s":["string"]}]},
  "content_angle": "2-3 sentences on the unique angle and positioning"
}`,
    }],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  return JSON.parse(text)
}

export async function generateDraft(params: {
  keyword: string
  volume: number
  difficulty: number
  intent: SearchIntent
  clusterName: string
  brandName: string
  brief?: Pick<Brief, 'recommended_title' | 'content_angle' | 'heading_structure'> | null
}): Promise<Omit<Draft, 'id' | 'keyword_id' | 'generated_at'>> {
  const briefCtx = params.brief
    ? `\nExisting brief context:\nTitle: ${params.brief.recommended_title}\nAngle: ${params.brief.content_angle}\nH2s: ${params.brief.heading_structure.h2s.map(h => h.heading).join(', ')}`
    : ''

  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 2500,
    system:     systemPrompt(params.brandName),
    messages:   [{
      role:    'user',
      content: `Generate a first-draft framework for this keyword:

Keyword: "${params.keyword}"
Monthly Volume: ${params.volume.toLocaleString()}
Difficulty: ${params.difficulty}/100
Intent: ${params.intent}
Brand: ${params.brandName}${briefCtx}

Return ONLY this JSON:
{
  "proposed_title": "string",
  "seo_title": "string (max 60 chars)",
  "meta_description": "string (max 160 chars)",
  "h1": "string",
  "h2_structure": ["string"],
  "intro_suggestion": "2-3 sentence opening hook",
  "key_points": ["one talking point per H2 section"],
  "faq_section": [{"question":"string","answer":"2-3 sentence answer"}],
  "internal_links": ["anchor text → page/topic"],
  "cta": "string"
}`,
    }],
  })

  const text = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  return JSON.parse(text)
}
