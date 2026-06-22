import { chromium } from 'playwright'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

// Load .env.local from project root
config({ path: path.resolve(process.cwd(), '.env.local') })

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PAGES_TO_SCRAPE = [
  'https://www.caglobalint.com/about-us/',
  'https://www.caglobalint.com/blog/',
  'https://www.caglobalint.com/our-services/',
  'https://camining.com/about/',
  'https://www.ca-finance.com/about/',
]

async function scrapeText(url: string): Promise<string> {
  const browser = await chromium.launch()
  const page    = await browser.newPage()
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
    const text = await page.evaluate(() => {
      const body = document.body.cloneNode(true) as HTMLElement
      body.querySelectorAll('nav,footer,script,style,header').forEach(el => el.remove())
      return body.innerText.replace(/\s+/g, ' ').slice(0, 3000)
    })
    return `--- ${url} ---\n${text}`
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log('Scraping brand content...')
  const texts: string[] = []
  for (const url of PAGES_TO_SCRAPE) {
    try {
      console.log(`  ${url}`)
      texts.push(await scrapeText(url))
    } catch (e) {
      console.warn(`  Failed: ${url} — retrying...`)
      try {
        texts.push(await scrapeText(url))
        console.log(`  Retry succeeded: ${url}`)
      } catch (e2) {
        console.warn(`  Skipping after second failure: ${url}`)
      }
    }
  }
  const combined = texts.join('\n\n')

  const msg = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 4000,
    messages:   [{
      role:    'user',
      content: `Analyse the following website content from CA Global, CA Mining, and CA Finance — three specialist executive recruitment firms operating across Africa.

${combined}

Write a comprehensive brand voice guide in Markdown covering:
1. Overall tone and register (formal vs casual, authoritative vs approachable)
2. Writing style characteristics (sentence length, structure, vocabulary level)
3. Candidate-facing communication style
4. Client-facing communication style
5. Use of industry terminology
6. Typical content structure patterns
7. What to avoid
8. 3-5 example phrases that capture the voice

Format as a Markdown document with clear headings. Be specific and actionable — this will be used to train an AI content generator.`,
    }],
  })

  const voice = msg.content[0].type === 'text' ? msg.content[0].text : ''
  fs.writeFileSync('knowledge-base/voice.md', voice)
  console.log('✓ voice.md written')
}

main().catch(console.error)
