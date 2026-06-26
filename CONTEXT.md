# Project Context — SEO Intelligence Dashboard

Last updated: 2026-06-26

---

## What this is

An internal SEO content management dashboard for CA Global, CA Mining, CA Finance, Vogue Hygiene, and CA Global HR. It gives the content team a prioritised keyword queue, AI-generated content briefs, full article drafts, Instagram/LinkedIn social posts, carousel slide text for graphic designers, and talking-head video scripts — all from one URL.

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
| keywords | ~230 keywords + manually added topics. `source` column: 'semrush' or 'manual' |
| clusters | Topic pillars each keyword belongs to |
| briefs | AI-generated content briefs (one per keyword/topic) |
| drafts | AI-generated full articles (one per keyword/topic) |
| socials | AI-generated social captions (one per keyword/topic) |
| carousels | AI-generated carousel slide text, max 5 slides (one per keyword/topic) |
| video_scripts | AI-generated 45-second talking-head scripts with isolated hook line (one per keyword/topic) |
| competitors | Competitor domains for gap analysis per brand |

All content tables (briefs, drafts, socials, carousels, video_scripts) cascade-delete when a keyword is deleted and have a UNIQUE constraint on keyword_id (one row per keyword).

Approximate keyword counts: CA Global ~44, CA Mining ~35, CA Finance ~31, Vogue Hygiene ~71, CA Global HR ~49.

---

## Navigation structure

A `BrandSwitcher` (top nav) lets users switch between the 5 brands. A `BrandNav` (secondary nav, below the brand switcher) provides per-brand page links:

**All brands:** Keywords · Topics · Briefs · Drafts · Socials

**Recruitment brands only (not Vogue Hygiene):** + Carousels · Scripts

---

## What the dashboard does

### Keywords page
Table of SEMrush-sourced keywords per brand, scored 0-100 by priority. Columns: keyword, score, volume, KD, intent, status.

Each row has action buttons that unlock in sequence:

| Button | Requires | Output | Time |
|---|---|---|---|
| + Brief | Nothing | Structured SEO content brief | ~45s |
| + Draft | Nothing (uses brief if exists) | Full 900-1200 word article | ~60s |
| + Social | Nothing (uses draft if exists) | Instagram/LinkedIn caption | ~30s |
| + Carousel | Draft must exist | 5 slides of text for graphic designer | ~20s |
| + Script | Draft must exist | 45-second talking-head video script | ~20s |
| Reset | Any content exists | Clears all generated content for that keyword | instant |

**Carousel and Script buttons are hidden for Vogue Hygiene.**

Each button regenerates (shown as `↻ Brief` etc.) if content already exists. View links appear inline after generation.

### Topics page
Manually-added ideas that didn't come from keyword research. Click `+ Add Topic`, type any title or question, and it gets added to the DB. Topics go through the exact same content generation chain as keywords (Brief → Draft → Social → Carousel → Script).

### Briefs / Drafts / Socials / Carousels / Scripts pages
List views of all generated content for the active brand, newest first.

### Status dropdown
Each keyword/topic can be set to: Opportunity · In Progress · Published · Paused

### Sync button (Keywords page only)
Hits the SEMrush API live to pull fresh keyword data for that brand.

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

- No em dashes, en dashes, or double dashes in any generated content — replaced with commas
- No emojis in social captions or carousel/script text
- Social posts always end with: Read the full article here: [INSERT LINK]
- Carousel slide 5 always ends with: Read the full article — link in bio
- Video scripts always end with a CTA directing viewers to the link in bio/comments

Applied in `lib/claude.ts` as both prompt instructions and post-processing `stripDashes()` strips.

---

## SEMrush configuration

Seed keywords (used to expand via phrase_related API) per brand — set in `app/api/semrush/sync/route.ts`.

Competitor domains for gap analysis — set in `app/api/semrush/gaps/route.ts`:
- Vogue Hygiene: bidvestservices.co.za, servest.co.za, compass-group.co.za
- CA Global HR: deel.com, remote.com, papayaglobal.com
- CA Global / CA Mining / CA Finance: existing recruitment competitors

---

## Security

All API routes that write to the DB or call Claude check `supabase.auth.getUser()` and return 401 if unauthenticated. The middleware protects all non-API page routes.

**Known gap:** The original AI routes (`/api/ai/brief`, `/api/ai/draft`, `/api/ai/social`) and SEMrush routes (`/api/semrush/sync`, `/api/semrush/gaps`) do not have explicit auth checks — they predate this pattern. Low risk given no public traffic, but worth adding if the app ever becomes more widely accessible.

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
| Alexandra | Content creator | Keywords, Topics, Briefs, Drafts — primary user |
| Frazie | Social media | Socials, Carousels |
| Irene | Design | Carousels (slide text for graphic design) |

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
- [ ] Test content generation for Vogue Hygiene and CA Global HR — generate a brief and draft for one keyword each to confirm brand-specific knowledge base is injecting correctly (no recruitment language in Vogue output, EOR/PEO context present in CA Global HR output)
- [ ] Test carousel and script generation end-to-end — generate a draft for a CA Global keyword then hit + Carousel and + Script to verify output quality
- [ ] Review and refine the **knowledge base files** once real content is being generated — especially `vogue-hygiene-industry.md` and `ca-global-hr-industry.md`
- [ ] Establish a publishing cadence with Alexandra (suggest 2 articles per week per brand)

### Medium term
- [ ] Add auth checks to the legacy API routes (`/api/ai/brief`, `/api/ai/draft`, `/api/ai/social`, `/api/semrush/*`) to match the pattern used in the new routes
- [ ] As articles go live, paste their URLs into the keyword rows so internal links become trackable
- [ ] Expose the competitor gap analysis in the UI — `/api/semrush/gaps` is built but not surfaced
- [ ] Expand CA Mining and CA Finance keyword coverage (fewer keywords than other brands)

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

For Supabase schema changes: Supabase dashboard → SQL Editor → paste and run SQL directly. Never use supabase CLI migration commands locally — Vercel encrypts env vars so the connection will fail.
