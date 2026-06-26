# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Run all tests (Vitest)
npm run test:coverage  # Tests with coverage report
```

Run a single test file:
```bash
npx vitest run __tests__/lib/semrush.test.ts
```

Deploy: push to `main` — Vercel auto-deploys in ~35 seconds.

Schema changes: use Supabase SQL Editor directly (Vercel encrypts env vars, so `vercel env pull` returns empty strings — local migration scripts won't connect).

---

## Stack

- **Next.js 16** (App Router) — newer than training data, read `node_modules/next/dist/docs/` before writing route/layout code
- **React 19** — concurrent features, Server Components by default
- **Supabase** — PostgreSQL + Row Level Security + Auth
- **Tailwind v4** + shadcn/ui (`components/ui/`)
- **Anthropic SDK** (`@anthropic-ai/sdk`) — model pinned to `claude-sonnet-4-6` in `lib/claude.ts`
- **Vitest** for unit tests (not Jest)

---

## Architecture

### Routing

```
app/
  page.tsx               → redirects to /ca-global/keywords
  layout.tsx             → root layout, Supabase session hydration, BrandSwitcher + BrandNav
  (auth)/login/          → login page (server wrapper + client LoginForm.tsx — split to prevent SSR crash)
  [brand]/               → dynamic brand segment (slug: ca-global | ca-mining | ca-finance | vogue-hygiene | ca-global-hr)
    page.tsx             → redirects to /[brand]/keywords
    keywords/page.tsx    → SEMrush-sourced keywords table (source='semrush' only)
    topics/page.tsx      → manually-added topics (source='manual'), with add-topic form
    briefs/page.tsx      → content briefs list
    drafts/page.tsx      → article drafts list
    socials/page.tsx     → social captions list
    carousels/page.tsx   → carousel slide text (not shown for vogue-hygiene)
    scripts/page.tsx     → 45-second video scripts (not shown for vogue-hygiene)
  api/
    ai/brief/route.ts    → POST: generate content brief via Claude
    ai/draft/route.ts    → POST: generate full article via Claude
    ai/social/route.ts   → POST: generate social caption via Claude
    ai/carousel/route.ts → POST: generate carousel slides from draft (requires draft to exist)
    ai/script/route.ts   → POST: generate 45s video script from draft (requires draft to exist)
    keywords/status/route.ts  → PATCH: update keyword content_status
    keywords/reset/route.ts   → DELETE: clear all generated content for a keyword (brief/draft/social/carousel/script)
    keywords/add/route.ts     → POST: add a manual topic (no SEMrush data)
    semrush/sync/route.ts     → POST: pull fresh keywords from SEMrush for a brand
    semrush/gaps/route.ts     → POST: competitor gap analysis (built, not yet surfaced in UI)
```

### Data flow

1. Keywords are seeded per brand via `supabase/seed-{brand}.sql` or synced live from SEMrush (`/api/semrush/sync`). Manual topics use `/api/keywords/add` and are stored with `source='manual'`.
2. Each keyword/topic row can have one of each: brief → draft → social → carousel → script (1:1 FK, all cascade-delete on keyword delete)
3. Carousel and Script generation require a draft to exist — the API routes enforce this
4. AI generation routes call `lib/claude.ts` functions (`generateBrief`, `generateDraft`, `generateSocial`, `generateCarousel`, `generateVideoScript`)
5. `lib/claude.ts` builds a system prompt by loading `knowledge-base/` files — brand-specific industry file auto-selected via `loadKnowledgeBase(brandSlug)`

### Supabase clients

Three separate clients to avoid cookie/server context issues:
- `lib/supabase-browser.ts` — client components
- `lib/supabase-server.ts` — Server Components (uses `cookies()` from `next/headers`)
- `lib/supabase-service.ts` — API routes that need to bypass RLS (uses `SUPABASE_SERVICE_ROLE_KEY`)

Auth is enforced in `middleware.ts` — all routes except `/login` and `/api/*` require a valid Supabase session.

### Priority scoring

`lib/semrush.ts:calculatePriorityScore()` — weighted composite of volume (25%), keyword difficulty inverted as ease (20%), commercial intent (15%), recruitment term match (15%), Africa geo match (10%), dual-audience (10%), content gap (5%). Returns 0–100.

---

## Components

`components/` has two layers:
- **Feature components** (`BrandNav.tsx`, `BrandSwitcher.tsx`, `KeywordRow.tsx`, `KeywordTable.tsx`, `TopicsTable.tsx`, `*Viewer.tsx`, etc.) — client components consumed by page.tsx files
- **`components/ui/`** — shadcn primitives (don't modify directly)

`lib/component-utils.ts` — pure logic helpers extracted from UI components so they can be unit-tested without jsdom. Add display/filter/sort logic here, not inline in components.

---

## Types

All shared types are in `types/index.ts`. Two gotchas:
- `Draft` has legacy fields (`proposed_title`, `h1`, `h2_structure`, etc.) kept only for DB compatibility — ignore these in new code, use `seo_title`, `meta_description`, `content`
- `VideoScript` has two fields: `hook_line` (standalone opening line) and `script` (full body) — they're rendered separately in `ScriptViewer.tsx`

---

## Key conventions

- **SEMrush intent codes**: SEMrush returns `0,2,3` not `I/N/C/T`. `mapIntent()` in `lib/semrush.ts` converts before DB insert. The DB has a `keywords_search_intent_check` constraint — always go through `mapIntent()`.
- **Dash stripping**: Claude often produces em/en dashes. `stripDashes()` in `lib/claude.ts` post-processes all AI outputs. The prompt also instructs Claude not to use dashes.
- **JSON fence stripping**: `stripFences()` in `lib/claude.ts` removes markdown code fences from Claude's JSON responses.
- **AI route timeouts**: set to 60s in `vercel.json` for `app/api/semrush/**` and `app/api/ai/**`.
- **Knowledge base injection**: every Claude call injects all `knowledge-base/*.md` files. Brand-specific industry files (`vogue-hygiene-industry.md`, `ca-global-hr-industry.md`) override `industry.md` when the brand slug matches.
- **Content guardrails** (enforced in prompts + post-processing): no em/en dashes anywhere; no emojis except `🔗` on the social caption link line; social captions use `🔗 [INSERT LINK]` (not "Read the full article here:"); carousel slide 5 always ends with `Read the full article — link in bio`; video scripts always end with a CTA to the link in bio/comments.

---

## Security

Auth is checked in all new routes via `supabase.auth.getUser()`. **Known gap**: the original AI routes (`/api/ai/brief`, `/api/ai/draft`, `/api/ai/social`) and SEMrush routes (`/api/semrush/sync`, `/api/semrush/gaps`) predate this pattern and have no explicit auth check — low risk given no public traffic, but add auth before exposing externally.

---

## Database tables

`brands` → `keywords` → `briefs` / `drafts` / `socials` / `carousels` / `video_scripts` (all FK to `keyword_id`, cascade delete)

`keywords.source` — `'semrush'` (default) or `'manual'`. Keywords page filters to `semrush`; Topics page filters to `manual`.

`clusters` — topic pillars, FK to `brand_id`, FK from `keywords.cluster_id`

`competitors` — competitor domains per brand, used by `/api/semrush/gaps`

Migrations are in `supabase/migrations/`. Run new migrations via Supabase SQL Editor, not CLI (env var encryption issue above).

---

## Tests

Tests live in `__tests__/` mirroring the source tree:
- `__tests__/lib/` — unit tests for `semrush.ts`, `claude.ts`, component utils
- `__tests__/api/` — tests for each API route handler

Vitest uses `globals: true` and path alias `@` → project root.
