import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import type { Brief, Draft, Social, Carousel, VideoScript, SearchIntent } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const MODEL  = 'claude-sonnet-4-6'

const BRAND_CONTEXT: Record<string, string> = {
  'ca-global':    'a specialist executive recruitment firm operating across Africa and globally',
  'ca-mining':    'a specialist mining recruitment firm operating across Africa and globally',
  'ca-finance':   'a specialist finance recruitment firm operating across Africa and globally',
  'vogue-hygiene':'a commercial cleaning and hygiene solutions company serving corporate and industrial clients across South Africa',
  'ca-global-hr': 'a specialist HR outsourcing firm offering Employer of Record (EOR) and Professional Employer Organisation (PEO) services across Africa',
}

function loadKnowledgeBase(brandSlug?: string) {
  const kbDir = path.join(process.cwd(), 'knowledge-base')
  const read  = (file: string) => {
    try   { return fs.readFileSync(path.join(kbDir, file), 'utf-8') }
    catch { return `# ${file} not yet written` }
  }
  const brandIndustryFile = brandSlug ? `${brandSlug}-industry.md` : null
  const industryFile = brandIndustryFile && fs.existsSync(path.join(kbDir, brandIndustryFile))
    ? brandIndustryFile
    : 'industry.md'
  return {
    voice:            read('voice.md'),
    seo:              read('seo.md'),
    industry:         read(industryFile),
    contentFramework: read('content-framework.md'),
  }
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
}

function systemPrompt(brandName: string, brandSlug?: string): string {
  const context = (brandSlug && BRAND_CONTEXT[brandSlug]) ?? 'a company operating across Africa'
  const kb = loadKnowledgeBase(brandSlug)
  return `You are a senior SEO content strategist for ${brandName}, ${context}.

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
  brandSlug?: string
}): Promise<Omit<Brief, 'id' | 'keyword_id' | 'generated_at'>> {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 2000,
    system:     systemPrompt(params.brandName, params.brandSlug),
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
  brandSlug?: string
  brief?: Pick<Brief, 'recommended_title' | 'content_angle' | 'heading_structure'> | null
}): Promise<Pick<Draft, 'seo_title' | 'meta_description' | 'content'>> {
  const briefCtx = params.brief
    ? `\nBrief context:\nTitle: ${params.brief.recommended_title}\nAngle: ${params.brief.content_angle}\nH2s: ${params.brief.heading_structure.h2s.map(h => h.heading).join(', ')}`
    : ''

  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 4000,
    system:     systemPrompt(params.brandName, params.brandSlug),
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
- No dashes of any kind (no hyphens used as punctuation, no em dashes, no en dashes) — use commas or full stops instead

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
  let parsed: { seo_title: string; meta_description: string; content: string }
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }

  const stripDashes = (s: string) => s
    .replace(/—|–|--+/g, ',')
    .replace(/ - /g, ', ')
    .replace(/  +/g, ' ')

  return {
    seo_title:        stripDashes(parsed.seo_title),
    meta_description: stripDashes(parsed.meta_description),
    content:          stripDashes(parsed.content),
  }
}

export async function generateCarousel(params: {
  keyword: string
  brandName: string
  brandSlug?: string
  articleTitle?: string
  articleContent: string
}): Promise<Omit<Carousel, 'id' | 'keyword_id' | 'generated_at'>> {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 1000,
    system:     systemPrompt(params.brandName, params.brandSlug),
    messages:   [{
      role:    'user',
      content: `Create a LinkedIn/Instagram carousel post from this article. The carousel will be designed as static slides by a graphic designer — you are providing the text only.

Keyword/Topic: "${params.keyword}"
Brand: "${params.brandName}"
Article title: "${params.articleTitle ?? params.keyword}"

Full article:
${params.articleContent.slice(0, 4000)}

Requirements:
- Maximum 5 slides
- Slide 1: a bold hook statement (the single most compelling takeaway, 10-15 words max)
- Slides 2-4: one key insight per slide, written as a punchy standalone statement (15-25 words each)
- Slide 5: a call-to-action ending with "Read the full article — link in bio"
- No bullet points, no dashes, no emojis
- Professional but direct tone — each slide must work as a standalone statement
- Do not number the slides in the text itself

Return ONLY this JSON:
{
  "slides": [
    { "slide_number": 1, "text": "string" },
    { "slide_number": 2, "text": "string" },
    { "slide_number": 3, "text": "string" },
    { "slide_number": 4, "text": "string" },
    { "slide_number": 5, "text": "string" }
  ]
}`,
    }],
  })

  const raw  = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const text = stripFences(raw)
  let parsed: { slides: Carousel['slides'] }
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }

  const stripDashes = (s: string) => s
    .replace(/—|–|--+/g, ',')
    .replace(/ - /g, ', ')
    .replace(/  +/g, ' ')

  return {
    slides: parsed.slides.slice(0, 5).map(s => ({
      slide_number: s.slide_number,
      text: stripDashes(s.text),
    })),
  }
}

export async function generateVideoScript(params: {
  keyword: string
  brandName: string
  brandSlug?: string
  articleTitle?: string
  articleContent: string
}): Promise<Omit<VideoScript, 'id' | 'keyword_id' | 'generated_at'>> {
  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 1200,
    system:     systemPrompt(params.brandName, params.brandSlug),
    messages:   [{
      role:    'user',
      content: `Write a 45-second talking-head video script from this article. This is for a recruiter or brand spokesperson speaking directly to camera on LinkedIn or Instagram.

Keyword/Topic: "${params.keyword}"
Brand: "${params.brandName}"
Article title: "${params.articleTitle ?? params.keyword}"

Full article:
${params.articleContent.slice(0, 4000)}

Requirements:
- Total spoken length: approximately 45 seconds (roughly 110-120 words at a natural speaking pace)
- The HOOK must be the first 7 seconds (approximately 15-20 words) — it must stop the scroll immediately. Make it a bold statement, a surprising fact, or a direct question. Do NOT start with "Hi" or the brand name.
- After the hook: deliver 2-3 punchy insights from the article
- End with a clear call to action: tell viewers to read the full article (link in bio / link in comments)
- Write in spoken English — contractions, short sentences, natural rhythm
- No dashes of any kind, no emojis, no bullet points in the script text
- The script should sound like a real person talking, not a press release

Return ONLY this JSON:
{
  "hook_line": "string (the first 7 seconds — 15-20 words)",
  "script": "string (full 45-second script including the hook, use \\n for paragraph breaks between sections)"
}`,
    }],
  })

  const raw  = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const text = stripFences(raw)
  let parsed: { hook_line: string; script: string }
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }

  const stripDashes = (s: string) => s
    .replace(/—|–|--+/g, ',')
    .replace(/ - /g, ', ')
    .replace(/  +/g, ' ')

  return {
    hook_line: stripDashes(parsed.hook_line),
    script:    stripDashes(parsed.script),
  }
}

export async function generateSocial(params: {
  keyword: string
  brandName: string
  brandSlug?: string
  articleTitle?: string
  articleContent?: string
}): Promise<Omit<Social, 'id' | 'keyword_id' | 'generated_at'>> {
  const articleCtx = params.articleTitle
    ? `\nArticle title: "${params.articleTitle}"${params.articleContent ? `\n\nFull article:\n${params.articleContent.slice(0, 3000)}` : ''}`
    : ''

  const msg = await client.messages.create({
    model:      MODEL,
    max_tokens: 800,
    system:     systemPrompt(params.brandName, params.brandSlug),
    messages:   [{
      role:    'user',
      content: `Write an Instagram and LinkedIn social media post promoting this article. Match this style exactly.

Keyword/Topic: "${params.keyword}"
Brand: "${params.brandName}"${articleCtx}

STYLE EXAMPLES (follow this format closely):

Example A:
image_text: This is the rarest skill in Islamic finance right now
caption: Islamic finance is expanding rapidly across the GCC but the real constraint is talent.\n\nProfessionals who combine Sharia expertise with modern financial capability are extremely scarce globally.\n\nFrom sukuk structuring to Islamic treasury and compliance roles, demand is now outpacing supply at every level.\n\n🔗 [INSERT LINK]
hashtags: ["#IslamicFinance","#ShariaCompliance","#GCCBanking","#ExecutiveSearch","#MiddleEastRecruitment"]

Example B:
image_text: How to Successfully Adapt to a New Executive Role
caption: Just landed a new executive role? Success starts with building trust.\n\nA C-level promotion looks like success on paper until you realise the real challenge starts after day one.\n\nThe first 90 days of a new executive role quietly define everything and most people get it wrong by trying to prove themselves too fast. Here's what actually matters when stepping into a new leadership environment.\n\n🔗 [INSERT LINK]\n\nThoughts?
hashtags: ["#ExecutiveSearch","#CLevel","#LeadershipDevelopment"]

Example C:
image_text: How to Hire and Relocate Skilled Talent to Australia
caption: How Australia is solving its mining skills shortage through global hiring.\n\nAustralia's mining and renewables sectors are facing a persistent skills shortage. Engineers, tradespeople and technical specialists are in short supply and international hiring is becoming a core workforce strategy.\n\nBut bringing skilled talent into the country involves a structured visa and relocation process that many employers still underestimate.\n\n🔗 [INSERT LINK]
hashtags: ["#CAMining","#SkillsMigration","#MiningJobs","#AustraliaJobs","#VisaSponsorship"]

REQUIREMENTS:
- image_text: Short phrase for the image overlay graphic. Either the article title or the single sharpest takeaway. Max 12 words.
- caption structure:
  1. Hook — punchy opening line or question (8-12 words). Can stand alone or lead into the body.
  2. 2-3 short paragraphs (2-4 sentences each). Punchy, direct, adds real value.
  3. On its own line: "🔗 [INSERT LINK]"
  4. Optional — include "Thoughts?" on its own line ONLY for opinion or discussion pieces. Omit for factual/how-to content.
- hashtags: 3-8 tightly targeted tags. No more.
- No emojis except 🔗 on the link line
- No dashes of any kind — use commas or full stops instead
- Do NOT write "Read the full article here:" — use 🔗 [INSERT LINK] only

Return ONLY this JSON:
{
  "image_text": "string",
  "caption": "string (use \\n for line breaks)",
  "hashtags": ["string"]
}`,
    }],
  })

  const raw  = msg.content[0].type === 'text' ? msg.content[0].text : '{}'
  const text = stripFences(raw)
  let parsed: { image_text: string; caption: string; hashtags: string[] }
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Claude returned malformed JSON: ' + text.slice(0, 200))
  }

  const stripDashes = (s: string) => s
    .replace(/—|–|--+/g, ',')
    .replace(/ - /g, ', ')
    .replace(/  +/g, ' ')

  // Strip emojis from caption body but preserve 🔗 (U+1F517) used on link line.
  // 🔗 is excluded by splitting the 1F000-1FFFF range around U+1F517.
  const cleanCaption = parsed.caption
    .replace(/[\u{1F000}-\u{1F516}\u{1F518}-\u{1FFFF}]/gu, '')
    .replace(/[\u{2600}-\u{27BF}]/gu, '')
    .replace(/[\u{FE00}-\u{FEFF}]/gu, '')
    .replace(/^- /gm, '')
    .replace(/  +/g, ' ')
    .trim()

  return {
    image_text: parsed.image_text ? stripDashes(parsed.image_text) : null,
    caption:    stripDashes(cleanCaption),
    hashtags:   parsed.hashtags,
  }
}
