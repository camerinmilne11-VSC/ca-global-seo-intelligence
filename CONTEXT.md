# Project Context — SEO Intelligence Dashboard

Last updated: 2026-06-23

---

## What this is

An internal SEO content management dashboard built for CA Global, CA Mining, and CA Finance. It gives the content team a prioritised keyword queue, AI-generated content briefs, full article drafts, and Instagram/LinkedIn social posts — all from one URL.

Built by Neil and Claude over a single session in June 2026.

---

## Live details

| Thing | Value |
|---|---|
| Live URL | Your Vercel project URL (check Vercel dashboard) |
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

## What is in the database

| Table | Purpose |
|---|---|
| brands | CA Global, CA Mining, CA Finance |
| keywords | 106 keywords seeded from SEMrush research |
| clusters | Topic pillars each keyword belongs to |
| briefs | AI-generated content briefs (one per keyword) |
| drafts | AI-generated full articles (one per keyword) |
| socials | AI-generated social captions (one per keyword) |
| competitors | Competitor domains for gap analysis |

Keyword counts: CA Global 44, CA Mining 35, CA Finance 31.

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

Stored in `/knowledge-base/` in the repo. Injected into every Claude prompt.

| File | Purpose |
|---|---|
| voice.md | How CA Global writes — tone, register, personality |
| seo.md | SEO standards — on-page rules, meta, internal linking |
| industry.md | Recruitment industry knowledge base |
| content-framework.md | Pillar/cluster content structure |
| humour.md | Appropriate use of humour across brands |

These files were generated from existing blog content. They should be reviewed and refined over time — they directly shape the quality of every brief and draft.

---

## Content guardrails (enforced in code)

- No em dashes, en dashes, or double dashes in drafts or social posts — replaced with commas
- No emojis in social captions
- Social posts always end with: Read the full article here: [INSERT LINK]

These are applied in `lib/claude.ts` as both prompt instructions and post-processing strips.

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

---

## Known fixes already applied

- Claude wraps JSON in markdown fences — stripped with `stripFences()` in `lib/claude.ts`
- AI function timeout increased from 30s to 60s in route files and `vercel.json`
- Login page split into server wrapper + client form to prevent Supabase prerender crash
- Duplicate keywords in seed SQL caused ON CONFLICT errors — resolved per brand
- `NEXT_PUBLIC_SUPABASE_URL` was missing from Vercel env vars — added via CLI

---

## What still needs doing

### Do soon
- [ ] Run the **Sync button** for each brand to pull live SEMrush data on top of seeded keywords
- [ ] Review and refine the **knowledge base files** — especially voice.md and tone.md
- [ ] Establish a publishing cadence with Alexandra (suggest 2 articles per week per brand as a starting target)

### Medium term
- [ ] As articles go live, paste their URLs into the keyword rows so internal links become trackable
- [ ] Expose the competitor gap analysis in the UI — the API route `/api/semrush/gaps` is built but not surfaced
- [ ] Expand CA Mining and CA Finance keyword coverage (fewer keywords than CA Global currently)
- [ ] Consider adding a navigation link to the Socials page in the sidebar

### Longer term
- [ ] WordPress integration — auto-post drafts as a WordPress draft via the REST API
- [ ] Published article tracking — pull live ranking data from SEMrush to show how published articles are performing
- [ ] Email digest — weekly summary of what was published and new opportunities

---

## How to resume development

1. Open terminal, `cd "/Users/neil/Desktop/CA Global/Dev & SEO Tools/seo-content-intelligence"`
2. Make changes locally
3. `git add -A && git commit -m "your message" && git push origin main`
4. Vercel auto-deploys from main — live in ~1 minute

For Supabase schema changes, run SQL in: Supabase dashboard → SQL Editor.
