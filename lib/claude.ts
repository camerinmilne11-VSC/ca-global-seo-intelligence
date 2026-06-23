import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import type { Brief, Draft, Social, SearchIntent } from '@/types'

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

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
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

  const raw  = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const text = stripFences(raw)
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }
}

export async function generateDraft(params: {
  keyword: string
  volume: number
  difficulty: number
  intent: SearchIntent
  clusterName: string
  brandName: string
  brief?: Pick<Brief, 'recommended_title' | 'content_angle' | 'heading_structure'> | null
}): Promise<Pick<Draft, 'seo_title' | 'meta_description' | 'content'>> {
  const briefCtx = params.brief
    ? `\nBrief context:\nTitle: ${params.brief.recommended_title}\nAngle: ${params.brief.content_angle}\nH2s: ${params.brief.heading_structure.h2s.map(h => h.heading).join(', ')}`
    : ''

  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 4000,
    system:     systemPrompt(params.brandName),
    messages:   [{
      role:    'user',
      content: `Write a complete, publication-ready SEO article.

Keyword: "${params.keyword}"
Monthly Volume: ${params.volume.toLocaleString()}
Difficulty: ${params.difficulty}/100
Intent: ${params.intent}
Brand: ${params.brandName}${briefCtx}

Requirements:
- 900–1200 words of fully written, publication-ready prose
- Start the content field with # followed by the H1 title
- Use ## for H2 headings, ### for H3 if needed
- Write complete paragraphs under each heading — NOT bullets or outlines
- Include the primary keyword in the first paragraph and naturally throughout
- Include a FAQ section (3–5 questions with full paragraph answers)
- End with a strong conclusion paragraph and call-to-action

Return ONLY this JSON (content must be a single string with \\n for line breaks):
{
  "seo_title": "string (max 60 chars, keyword included)",
  "meta_description": "string (max 160 chars, compelling, keyword included)",
  "content": "string (complete markdown article, 900–1200 words)"
}`,
    }],
  })

  const raw  = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const text = stripFences(raw)
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }
}

export async function generateSocial(params: {
  keyword: string
  brandName: string
  articleTitle?: string
}): Promise<Omit<Social, 'id' | 'keyword_id' | 'generated_at'>> {
  const articleCtx = params.articleTitle ? `\nArticle title: "${params.articleTitle}"` : ''

  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 800,
    system:     systemPrompt(params.brandName),
    messages:   [{
      role:    'user',
      content: `Write an Instagram and LinkedIn social media post for this topic.

Keyword/Topic: "${params.keyword}"
Brand: "${params.brandName}"${articleCtx}

Requirements:
- Hook in the first line (punchy, 5–10 words, no hashtags on line 1)
- Professional but conversational tone — sounds like a real person, not a brand account
- 150–250 words for the caption body
- Tasteful emojis (2–4 total, meaningful not decorative)
- End with a clear call-to-action (visit link in bio, comment below, etc.)
- 8–12 relevant hashtags in a separate block at the end

Return ONLY this JSON:
{
  "caption": "string (full post text, use \\n for line breaks, hashtags on separate lines at end)",
  "hashtags": ["string"]
}`,
    }],
  })

  const raw  = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const text = stripFences(raw)
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }
}
