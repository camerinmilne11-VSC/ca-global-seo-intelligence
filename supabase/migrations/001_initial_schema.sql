-- =============================================================================
-- Migration: 001_initial_schema.sql
-- Project:   SEO Content & Keyword Intelligence System — CA Global
-- =============================================================================
-- HOW TO APPLY (no Supabase credentials configured locally):
--   1. Open Supabase Dashboard → SQL Editor
--   2. Paste and run this entire file
--   3. Then paste and run supabase/seed.sql
--   4. Verify in Table Editor: brands table has 3 rows, all other tables exist.
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Brands
create table brands (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  domain      text not null unique,
  slug        text not null unique check (slug in ('ca-global','ca-mining','ca-finance')),
  brand_color text not null default '#0d2137',
  created_at  timestamptz not null default now()
);

-- Topic clusters / pillar pages
create table clusters (
  id              uuid primary key default uuid_generate_v4(),
  brand_id        uuid not null references brands(id) on delete cascade,
  pillar_name     text not null,
  description     text not null default '',
  primary_keyword text not null,
  created_at      timestamptz not null default now()
);

-- Core keyword intelligence
create table keywords (
  id                    uuid primary key default uuid_generate_v4(),
  brand_id              uuid not null references brands(id) on delete cascade,
  keyword               text not null,
  cluster_id            uuid references clusters(id) on delete set null,
  volume                integer not null default 0,
  difficulty            integer not null default 50 check (difficulty between 0 and 100),
  search_intent         text not null default 'I' check (search_intent in ('I','N','C','T')),
  opportunity_rationale text not null default '',
  priority_score        numeric(5,2) not null default 0 check (priority_score between 0 and 100),
  content_status        text not null default 'opportunity'
                          check (content_status in ('opportunity','in_progress','published','paused')),
  publication_url       text,
  last_synced           timestamptz not null default now(),
  created_at            timestamptz not null default now(),
  unique (brand_id, keyword)
);

-- Content briefs
create table briefs (
  id                   uuid primary key default uuid_generate_v4(),
  keyword_id           uuid not null references keywords(id) on delete cascade unique,
  recommended_title    text not null,
  alt_titles           text[] not null default '{}',
  intent_analysis      text not null default '',
  primary_keyword      text not null,
  secondary_keywords   text[] not null default '{}',
  related_queries      text[] not null default '{}',
  faqs                 jsonb not null default '[]',
  internal_links       text[] not null default '{}',
  ctas                 text[] not null default '{}',
  article_length_words integer not null default 1200,
  heading_structure    jsonb not null default '{}',
  content_angle        text not null default '',
  generated_at         timestamptz not null default now()
);

-- Draft previews
create table drafts (
  id               uuid primary key default uuid_generate_v4(),
  keyword_id       uuid not null references keywords(id) on delete cascade unique,
  proposed_title   text not null,
  seo_title        text not null,
  meta_description text not null,
  h1               text not null,
  h2_structure     text[] not null default '{}',
  intro_suggestion text not null,
  key_points       text[] not null default '{}',
  faq_section      jsonb not null default '[]',
  internal_links   text[] not null default '{}',
  cta              text not null default '',
  generated_at     timestamptz not null default now()
);

-- Competitor gap tracking
create table competitors (
  id                uuid primary key default uuid_generate_v4(),
  brand_id          uuid not null references brands(id) on delete cascade,
  competitor_domain text not null,
  gap_keywords      text[] not null default '{}',
  tracked_since     timestamptz not null default now(),
  unique (brand_id, competitor_domain)
);

-- Indexes for common queries
create index idx_keywords_brand   on keywords(brand_id);
create index idx_keywords_score   on keywords(priority_score desc);
create index idx_keywords_status  on keywords(content_status);
create index idx_keywords_cluster on keywords(cluster_id);
create index idx_clusters_brand   on clusters(brand_id);
create index idx_briefs_keyword   on briefs(keyword_id);
create index idx_drafts_keyword   on drafts(keyword_id);

-- RLS: enable on all tables
alter table brands      enable row level security;
alter table clusters    enable row level security;
alter table keywords    enable row level security;
alter table briefs      enable row level security;
alter table drafts      enable row level security;
alter table competitors enable row level security;

-- Policy: anon/authenticated can read everything
create policy "read_all" on brands      for select using (true);
create policy "read_all" on clusters    for select using (true);
create policy "read_all" on keywords    for select using (true);
create policy "read_all" on briefs      for select using (true);
create policy "read_all" on drafts      for select using (true);
create policy "read_all" on competitors for select using (true);

-- Policy: authenticated users can update keyword status/url only
create policy "update_status" on keywords
  for update using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Service role bypasses RLS automatically (used by API routes)
