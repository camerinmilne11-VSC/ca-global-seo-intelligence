# Project Context — SEO Intelligence Dashboard

Last updated: 2026-06-24

---

## What this is

An internal SEO content management dashboard for CA Global, CA Mining, CA Finance, Vogue Hygiene, and CA Global HR. It gives the content team a prioritised keyword queue, AI-generated content briefs, full article drafts, and Instagram/LinkedIn social posts — all from one URL.

Built by Neil and Claude, June 2026.

---

## Live details

| Thing | Value |
|---|---|
| Live URL | https://ca-global-seo-intelligence-ya76.vercel.app |
| Vercel project | ca-global-seo-intelligence-ya76 |
| GitHub repo | https://github.com/camerinmilne11-VSC/ca-global-seo-intelligence |
| Supabase project | wwbojuwmkfaiyktcjdds.supabase.co |
| Branch | main (auto-deploys to Vercel on push) |

---

## Stack

- **Frontend/Backend:** Next.js 16 App Router, deployed to Vercel
- **Database + Auth:** Supabase (PostgreSQL + Row Level Security)
- **AI generation:** Claude Sonnet 4.6 via Anthropic SDK
- **Keyword data:** SEMrush REST API
- **Styling:** Tailwind v4 + shadcn/ui

---

## Project directory

```
/Users/neil/Desktop/CA Global/Dev & SEO Tools/seo-content-intelligence/
```

---

## Brands in the database

| Brand | Slug | Domain | Industry |
|---|---|---|---|
| CA Global | ca-global | caglobalint.com | Executive recruitment, Africa & global |
| CA Mining | ca-mining | caminingjobs.com | Mining recruitment, Africa & global |
| CA Finance | ca-finance | cafinance.com | Finance recruitment, Africa & global |
| Vogue Hygiene | vogue-hygiene | vogue-hygiene.co.za | Commercial cleaning & hygiene, South Africa |
| CA Global HR | ca-global-hr | caglobalhr.com | HR outsourcing, EOR/PEO, Africa |

---

## Database tables

| Table | Purpose |
|---|---|
| brands | All five brands |
| keywords | ~230 keywords total across all brands (seeded + SEMrush synced) |
| clusters | Topic pillars each keyword belongs to |
| briefs | AI-generated content briefs (one per keyword) |
| drafts | AI-generated full articles (one per keyword) |
| socials | AI-generated social captions (one per keyword) |
| competitors | Competitor domains for gap analysis per brand |

Approximate keyword counts: CA Global ~44, CA Mining ~35, CA Finance ~31, Vogue Hygiene ~71, CA Global HR ~49.

---

## What the dashboard does

1. **Keywords page** — Table of all keywords per brand, scored 0-100 by priority. Columns: keyword, score, volume, KD, intent, status.
2. **Status dropdown** — Each keyword can be set to Opportunity, In Progress, Published, or Paused directly from the table.
3. **+ Brief** — Generates a structured SEO content brief using the knowledge base files. Takes ~45 seconds.
4. **+ Draft** — Generates a full 900-1200 word publication-ready article. Takes ~60 seconds.
5. **+ Social** — Generates an Instagram/LinkedIn caption that summarises the article and ends with "Read the full article here: [INSERT LINK]". Takes ~30 seconds.
6. **Reset** — Clears the brief, draft, and social for a keyword so it can be regenerated.
7. **Sync button** — Hits the SEMrush API live to pull fresh keyword data for that brand.

---

## Knowledge base files

Stored in `/knowledge-base/`. Injected into every Claude prompt. Brand-aware — each brand gets its own industry file where relevant.

| File | Used by | Purpose |
|---|---|---|
| voice.md | All brands | How CA Global writes — tone, register, personality |
| seo.md | All brands | SEO standards — on-page rules, meta, internal linking |
| industry.md | CA Global, CA Mining, CA Finance | Recruitment industry knowledge base |
| content-framework.md | All brands | Pillar/cluster content structure |
| humour.md | All brands | Appropriate use of humour |
| vogue-hygiene-industry.md | Vogue Hygiene only | Commercial cleaning sector SA, OHSA Act, HACCP, competitor landscape (Bidvest, Servest, Compass Group), eco/ESG angle |
| ca-global-hr-industry.md | CA Global HR only | EOR vs PEO distinction, BCEA, LRA, Employment Equity Act, UIF, PAYE, SDL, competitor landscape (Deel, Remote.com, Papaya Global) |

Brand-specific industry files are auto-selected in `lib/claude.ts` via `loadKnowledgeBase(brandSlug)`.

---

## Content guardrails (enforced in code)

- No em dashes, en dashes, or double dashes in drafts or social posts — replaced with commas
- No emojis in social captions
- Social posts always end with: Read the full article here: [INSERT LINK]

Applied in `lib/claude.ts` as both prompt instructions and post-processing strips.

---

## SEMrush configuration

Seed keywords (used to expand via phrase_related API) per brand — set in `app/api/semrush/sync/route.ts`.

Competitor domains for gap analysis — set in `app/api/semrush/gaps/route.ts`:
- Vogue Hygiene: bidvestservices.co.za, servest.co.za, compass-group.co.za
- CA Global HR: deel.com, remote.com, papayaglobal.com
- CA Global / CA Mining / CA Finance: existing recruitment competitors

---

## Known fixes already applied

- Claude wraps JSON in markdown fences — stripped with `stripFences()` in `lib/claude.ts`
- AI function timeout increased from 30s to 60s in route files and `vercel.json`
- Login page split into server wrapper + client form to prevent Supabase prerender crash
- Duplicate keywords in seed SQL caused ON CONFLICT errors — resolved per brand
- `NEXT_PUBLIC_SUPABASE_URL` was missing from Vercel env vars — added via CLI
- SEMrush returns intent as numeric codes (`0,2,3`) not letters — `mapIntent()` added to `lib/semrush.ts` to map to `I/N/C/T` before DB insert (was causing `keywords_search_intent_check` constraint violation on sync)

---

## Team with access

| Person | Role | Uses |
|---|---|---|
| Neil | Admin | Everything |
| Alexandra | Content creator | Keywords, briefs, drafts — primary user |
| Frazie | Social media | Social posts |
| Irene | Design | Reference only |

Add new users: Supabase dashboard → Authentication → Users → Add user.

---

## Environment variables (all set in Vercel production)

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- SEMRUSH_API_KEY

Note: Vercel encrypts sensitive vars — `vercel env pull` returns empty strings for these. Don't try to pull and run migration scripts locally; use Supabase SQL Editor directly for any schema changes.

---

## What still needs doing

### Do soon
- [ ] Review and refine the **knowledge base files** — especially `vogue-hygiene-industry.md` and `ca-global-hr-industry.md` once content is being generated and you can see if the tone/context is right
- [ ] Test content generation for Vogue Hygiene and CA Global HR — generate a brief and draft for one keyword each to confirm brand-specific knowledge base is injecting correctly (no recruitment language in Vogue output, EOR/PEO context present in CA Global HR output)
- [ ] Establish a publishing cadence with Alexandra (suggest 2 articles per week per brand as a starting target)

### Medium term
- [ ] As articles go live, paste their URLs into the keyword rows so internal links become trackable
- [ ] Expose the competitor gap analysis in the UI — the API route `/api/semrush/gaps` is built but not surfaced
- [ ] Expand CA Mining and CA Finance keyword coverage (fewer keywords than other brands)
- [ ] Consider adding a navigation link to the Socials page in the sidebar

### Longer term
- [ ] WordPress integration — auto-post drafts as a WordPress draft via the REST API
- [ ] Published article tracking — pull live ranking data from SEMrush to show how published articles are performing
- [ ] Email digest — weekly summary of what was published and new opportunities

---

## How to resume development

1. Open terminal: `cd "/Users/neil/Desktop/CA Global/Dev & SEO Tools/seo-content-intelligence"`
2. Make changes locally
3. `git add -A && git commit -m "your message" && git push origin main`
4. Vercel auto-deploys from main — live in ~35 seconds

For Supabase schema changes: Supabase dashboard → SQL Editor → paste and run SQL directly.
