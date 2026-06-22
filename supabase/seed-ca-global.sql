-- =============================================================================
-- Seed: seed-ca-global.sql
-- Project: SEO Content Intelligence System — CA Global
-- Source:  SEMrush Phase 1 research (June 2026)
-- =============================================================================
-- HOW TO APPLY:
--   1. Ensure 001_initial_schema.sql and seed.sql have already been run.
--   2. Open Supabase Dashboard → SQL Editor
--   3. Paste and run this entire file.
-- =============================================================================

-- ─── Cluster inserts ─────────────────────────────────────────────────────────
-- We use a DO block so we can reference the brand UUID by slug

do $$
declare
  v_brand_id   uuid;
  v_cluster_1  uuid;
  v_cluster_2  uuid;
  v_cluster_3  uuid;
  v_cluster_4  uuid;
  v_cluster_5  uuid;
begin

  select id into v_brand_id from brands where slug = 'ca-global';

  -- Pillar 1: Executive Search & Headhunting (core high-volume service terms)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Executive Search & Headhunting',
    'Core service pillar covering executive search, headhunting, and C-suite placement. Targets decision-makers seeking senior talent globally and in Africa.',
    'executive search africa'
  )
  on conflict do nothing
  returning id into v_cluster_1;

  if v_cluster_1 is null then
    select id into v_cluster_1 from clusters
    where brand_id = v_brand_id and primary_keyword = 'executive search africa';
  end if;

  -- Pillar 2: Executive Recruitment Agencies (buyer-intent category terms)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Executive Recruitment Agencies',
    'Targets buyers comparing executive recruitment providers. High commercial intent. Positions CA Global against Korn Ferry, Robert Walters, and other global players.',
    'executive recruitment agencies'
  )
  on conflict do nothing
  returning id into v_cluster_2;

  if v_cluster_2 is null then
    select id into v_cluster_2 from clusters
    where brand_id = v_brand_id and primary_keyword = 'executive recruitment agencies';
  end if;

  -- Pillar 3: Africa Jobs & Employment (informational / mid-funnel)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Africa Jobs & Employment',
    'Mid-funnel informational content for professionals seeking work in Africa. CA Global ranks for several terms here already. Supports brand discovery.',
    'jobs in africa'
  )
  on conflict do nothing
  returning id into v_cluster_3;

  if v_cluster_3 is null then
    select id into v_cluster_3 from clusters
    where brand_id = v_brand_id and primary_keyword = 'jobs in africa';
  end if;

  -- Pillar 4: Sector Specialist Recruitment (vertical depth)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Sector Specialist Recruitment',
    'Sector-specific executive recruitment content: mining, finance/CFO, engineering, legal, and C-suite. CA Mining and CA Finance sub-brands support these pages.',
    'mining recruitment'
  )
  on conflict do nothing
  returning id into v_cluster_4;

  if v_cluster_4 is null then
    select id into v_cluster_4 from clusters
    where brand_id = v_brand_id and primary_keyword = 'mining recruitment';
  end if;

  -- Pillar 5: Top Executive Recruiter Lists & Comparisons (SEO list content)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Top Executive Recruiter Lists & Comparisons',
    'Comparison and listicle content targeting buyers researching the best executive search firms. High CPC signals strong commercial intent. Competitor gap opportunity.',
    'top executive search firms'
  )
  on conflict do nothing
  returning id into v_cluster_5;

  if v_cluster_5 is null then
    select id into v_cluster_5 from clusters
    where brand_id = v_brand_id and primary_keyword = 'top executive search firms';
  end if;

  -- ─── Keyword inserts ───────────────────────────────────────────────────────
  -- Scoring methodology (from lib/semrush.ts):
  --   volume 25% | ease (100-kd) 20% | commercial 15% | recruitment_match 15%
  --   geo_match 10% | dual_audience 10% | content_gap 5%
  -- KD estimated from competition proxy (0-100 normalised) where SEMrush
  -- phrase_this does not return Td column — conservative 40 used as default.

  -- ── PILLAR 1: Executive Search & Headhunting ──────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- executive headhunting firms — 5400 vol, CPC $4.76, comp 0.14
  (v_brand_id, v_cluster_1, 'executive headhunting firms', 5400, 40, 'C',
   82, '5,400 monthly searches · low-mid competition (KD ~40) · CPC $4.76 commercial value · CA Global = headhunting specialist · competitor gap vs Korn Ferry',
   'opportunity'),

  -- executive search firms — 5400 vol, CPC $4.76, comp 0.14
  (v_brand_id, v_cluster_1, 'executive search firms', 5400, 40, 'C',
   82, '5,400 monthly searches · low-mid competition · CPC $4.76 · core service term · competitor gap',
   'opportunity'),

  -- executive headhunters — 1300 vol, CPC $3.90, comp 0.76 (high)
  (v_brand_id, v_cluster_1, 'executive headhunters', 1300, 70, 'C',
   66, '1,300 monthly searches · CPC $3.90 commercial value · high competition (KD ~70) · CA Global core identity',
   'opportunity'),

  -- executive search africa — 40 vol, CPC $0, trending seasonal
  (v_brand_id, v_cluster_1, 'executive search africa', 40, 20, 'C',
   71, 'Low volume but geo-targeted · low competition · perfect brand-market fit for CA Global · trending upward in H1/H2',
   'opportunity'),

  -- executive recruitment africa — 20 vol, CPC $7.43, comp 0.21
  (v_brand_id, v_cluster_1, 'executive recruitment africa', 20, 25, 'C',
   72, 'Low volume but CPC $7.43 signals very high buyer intent · geo match · CA Global core service · quick win opportunity',
   'opportunity'),

  -- executive search south africa — 20 vol, CPC $0, comp 0.33
  (v_brand_id, v_cluster_1, 'executive search south africa', 20, 25, 'I',
   62, 'Geo-targeted long-tail · South Africa is primary CA Global market · low competition · foundation content',
   'opportunity'),

  -- headhunting firms — 260 vol, CPC $4.69, comp 0.41
  (v_brand_id, v_cluster_1, 'headhunting firms', 260, 45, 'C',
   72, '260 monthly searches · CPC $4.69 · moderate competition · CA Global headhunting specialist brand fit',
   'opportunity'),

  -- executive search and headhunting — 1900 vol, CPC $3.25, comp 0.27
  (v_brand_id, v_cluster_1, 'executive search and headhunting', 1900, 35, 'C',
   77, '1,900 monthly searches · CPC $3.25 · combines two core CA Global service lines · low-moderate competition',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id           = excluded.cluster_id,
        volume               = excluded.volume,
        difficulty           = excluded.difficulty,
        search_intent        = excluded.search_intent,
        priority_score       = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced          = now();

  -- ── PILLAR 2: Executive Recruitment Agencies ──────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- executive recruitment agencies — 1900 vol, CPC $4.66, comp 0.23
  (v_brand_id, v_cluster_2, 'executive recruitment agencies', 1900, 35, 'C',
   78, '1,900 monthly searches · CPC $4.66 · low-moderate competition · core category term · buyers comparing providers',
   'opportunity'),

  -- executive recruitment — 1900 vol, CPC $4.40, comp 0.45
  (v_brand_id, v_cluster_2, 'executive recruitment', 1900, 45, 'C',
   74, '1,900 monthly searches · CPC $4.40 · head-term for the category · CA Global primary service',
   'opportunity'),

  -- executive search agency — 1600 vol, CPC $5.14, comp 0.06 (very low!)
  (v_brand_id, v_cluster_2, 'executive search agency', 1600, 15, 'C',
   85, '1,600 monthly searches · CPC $5.14 · VERY LOW competition (0.06) · highest priority quick win · agency framing',
   'opportunity'),

  -- executive recruiting firms — 2400 vol, CPC $4.76, comp 0.14
  (v_brand_id, v_cluster_2, 'executive recruiting firms', 2400, 30, 'C',
   82, '2,400 monthly searches · CPC $4.76 · low competition · buyers in decision phase · competitor gap vs Korn Ferry',
   'opportunity'),

  -- executive recruiter — 2400 vol, CPC $4.40, comp 0.45
  (v_brand_id, v_cluster_2, 'executive recruiter', 2400, 50, 'C',
   75, '2,400 monthly searches · CPC $4.40 · moderate competition · foundational category term',
   'opportunity'),

  -- recruiting companies — 1900 vol, CPC $5.18, comp 0.42
  (v_brand_id, v_cluster_2, 'recruiting companies', 1900, 45, 'C',
   72, '1,900 monthly searches · CPC $5.18 · moderate competition · broad but commercial',
   'opportunity'),

  -- recruitment agency africa — volume sporadic, CPC $0, comp 0.33
  (v_brand_id, v_cluster_2, 'recruitment agency africa', 0, 20, 'C',
   52, 'Low US volume but geo-targeted Africa term · growing trend signal · CA Global niche anchor term',
   'opportunity'),

  -- executive employment agency — 1600 vol, CPC $4.66, comp 0.23
  (v_brand_id, v_cluster_2, 'executive employment agency', 1600, 30, 'C',
   78, '1,600 monthly searches · CPC $4.66 · low competition · agency framing resonates with buyers',
   'opportunity'),

  -- executive hiring firms — 1600 vol, CPC $4.93, comp 0.21
  (v_brand_id, v_cluster_2, 'executive hiring firms', 1600, 25, 'C',
   80, '1,600 monthly searches · CPC $4.93 · low competition · buyers in active hiring mode',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id           = excluded.cluster_id,
        volume               = excluded.volume,
        difficulty           = excluded.difficulty,
        search_intent        = excluded.search_intent,
        priority_score       = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced          = now();

  -- ── PILLAR 3: Africa Jobs & Employment ────────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- africa employment — 210 vol, CA Global ranks #4
  (v_brand_id, v_cluster_3, 'africa employment', 210, 20, 'I',
   64, '210 monthly searches · CA Global currently ranks #4 · low competition · nurture + improve existing rank',
   'opportunity'),

  -- jobs in africa — 320 vol, CA Global ranks #5
  (v_brand_id, v_cluster_3, 'jobs in africa', 320, 20, 'I',
   64, '320 monthly searches · CA Global ranks #5 · existing ranking to defend and improve',
   'opportunity'),

  -- vacancies in africa — 320 vol, CA Global ranks #5
  (v_brand_id, v_cluster_3, 'vacancies in africa', 320, 20, 'I',
   63, '320 monthly searches · existing rank #5 · informational intent · audience discovery',
   'opportunity'),

  -- job openings in africa — 320 vol, CA Global ranks #6
  (v_brand_id, v_cluster_3, 'job openings in africa', 320, 20, 'I',
   62, '320 monthly searches · existing rank #6 · improve to page 1 top 3',
   'opportunity'),

  -- work opportunities in africa — 320 vol, CA Global ranks #5
  (v_brand_id, v_cluster_3, 'work opportunities in africa', 320, 20, 'I',
   62, '320 monthly searches · existing rank #5 · quick win to push to top 3',
   'opportunity'),

  -- job search africa — 140 vol, CA Global ranks #3
  (v_brand_id, v_cluster_3, 'job search africa', 140, 15, 'I',
   62, '140 monthly searches · CA Global ranks #3 · defend and convert',
   'opportunity'),

  -- africa executive jobs — 20 vol, geo-targeted
  (v_brand_id, v_cluster_3, 'africa executive jobs', 20, 10, 'C',
   61, 'Low volume but executive + Africa + jobs = perfect CA Global audience · very low competition',
   'opportunity'),

  -- jobs in african union — 390 vol, CPC $0, ngo/public sector adjacent
  (v_brand_id, v_cluster_3, 'jobs in african union', 390, 25, 'N',
   44, 'Navigational intent (AU jobs) — tangential traffic only · informational value limited',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id           = excluded.cluster_id,
        volume               = excluded.volume,
        difficulty           = excluded.difficulty,
        search_intent        = excluded.search_intent,
        priority_score       = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced          = now();

  -- ── PILLAR 4: Sector Specialist Recruitment ───────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- mining recruitment — 260 vol, CPC $0.79, comp 0.16
  (v_brand_id, v_cluster_4, 'mining recruitment', 260, 25, 'C',
   69, '260 monthly searches · low competition · CA Mining sub-brand · sector authority content',
   'opportunity'),

  -- cfo recruitment — 210 vol, CPC $12.34 (!), comp 0.16
  (v_brand_id, v_cluster_4, 'cfo recruitment', 210, 20, 'C',
   76, '210 monthly searches · CPC $12.34 extremely high commercial value · low competition · CA Finance vertical',
   'opportunity'),

  -- ceo recruitment — 210 vol, CPC $5.49, comp 0.47
  (v_brand_id, v_cluster_4, 'ceo recruitment', 210, 45, 'C',
   69, '210 monthly searches · CPC $5.49 · C-suite placement core service · moderate competition',
   'opportunity'),

  -- legal recruiter — 8100 vol, CPC $5.82, comp 0.31 (Korn Ferry ranking #2)
  (v_brand_id, v_cluster_4, 'legal recruiter', 8100, 50, 'C',
   76, '8,100 monthly searches · CPC $5.82 · Korn Ferry ranks #2 · competitor gap opportunity · high volume legal vertical',
   'opportunity'),

  -- recruitment process outsourcing — 3600 vol, CPC $17.15 (!), Korn Ferry #1
  (v_brand_id, v_cluster_4, 'recruitment process outsourcing', 3600, 60, 'C',
   72, '3,600 monthly searches · CPC $17.15 extremely high · Korn Ferry #1 — significant competitor gap · RPO service angle',
   'opportunity'),

  -- ca global finance recruitment africa — 50 vol, CA Global ranks #2 and #3
  (v_brand_id, v_cluster_4, 'ca global finance recruitment africa', 50, 10, 'N',
   58, 'Brand + service term · CA Global ranks #2 and #3 · defend brand SERP · CA Finance audience',
   'opportunity'),

  -- ca mining — 140 vol, CA Global ranks #4
  (v_brand_id, v_cluster_4, 'ca mining', 140, 15, 'N',
   54, 'Brand sub-domain term · CA Global ranks #4 · improve to top 3 · cross-brand visibility',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id           = excluded.cluster_id,
        volume               = excluded.volume,
        difficulty           = excluded.difficulty,
        search_intent        = excluded.search_intent,
        priority_score       = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced          = now();

  -- ── PILLAR 5: Top Recruiter Lists & Comparisons ───────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- executive recruiting search firms — 6600 vol, CPC $4.76, Korn Ferry #1
  (v_brand_id, v_cluster_5, 'executive recruiting search firms', 6600, 45, 'C',
   81, '6,600 monthly searches · CPC $4.76 · Korn Ferry #1 = gap opportunity · list/comparison content format',
   'opportunity'),

  -- top executive search firms — 1900 vol, CPC $4.11, comp 0.30
  (v_brand_id, v_cluster_5, 'top executive search firms', 1900, 40, 'C',
   77, '1,900 monthly searches · CPC $4.11 · moderate competition · "best of" listicle opportunity',
   'opportunity'),

  -- top executive recruiting firms — 880 vol, CPC $3.89, comp 0.56
  (v_brand_id, v_cluster_5, 'top executive recruiting firms', 880, 55, 'C',
   70, '880 monthly searches · CPC $3.89 · buyers in final selection · list content opportunity',
   'opportunity'),

  -- best executive search firms — 880 vol, CPC $3.89, comp 0.56
  (v_brand_id, v_cluster_5, 'best executive search firms', 880, 55, 'C',
   70, '880 monthly searches · CPC $3.89 · comparison intent · decision-stage buyers',
   'opportunity'),

  -- executive search companies — 1600 vol, CPC $4.93, comp 0.21
  (v_brand_id, v_cluster_5, 'executive search companies', 1600, 25, 'C',
   81, '1,600 monthly searches · CPC $4.93 · LOW competition (0.21) · high priority list page',
   'opportunity'),

  -- executive search consultants — 720 vol, CPC $3.60, comp 0.08 (very low!)
  (v_brand_id, v_cluster_5, 'executive search consultants', 720, 15, 'C',
   81, '720 monthly searches · CPC $3.60 · VERY LOW competition (0.08) · consultant framing suits CA Global style',
   'opportunity'),

  -- top executive headhunters — 720 vol, CPC $4.53, comp 0.29
  (v_brand_id, v_cluster_5, 'top executive headhunters', 720, 35, 'C',
   76, '720 monthly searches · CPC $4.53 · moderate competition · list format · headhunting identity',
   'opportunity'),

  -- best executive recruiters — 260 vol, CPC $3.67, comp 0.73 (high)
  (v_brand_id, v_cluster_5, 'best executive recruiters', 260, 70, 'C',
   62, '260 monthly searches · CPC $3.67 · high competition · lower priority but valid for comprehensive pillar coverage',
   'opportunity'),

  -- head hunters near me — 2400 vol, CPC $2.19, comp 0.44
  (v_brand_id, v_cluster_5, 'head hunters near me', 2400, 45, 'C',
   73, '2,400 monthly searches · CPC $2.19 · location-intent buyers · FAQ + landing page opportunity',
   'opportunity'),

  -- recruit executives — 1600 vol, CPC $4.35, comp 0.26
  (v_brand_id, v_cluster_5, 'recruit executives', 1600, 30, 'C',
   79, '1,600 monthly searches · CPC $4.35 · low-moderate competition · employer-side phrasing suits CA Global',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id           = excluded.cluster_id,
        volume               = excluded.volume,
        difficulty           = excluded.difficulty,
        search_intent        = excluded.search_intent,
        priority_score       = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced          = now();

  -- ─── Competitor gap record ─────────────────────────────────────────────────
  -- michaelpage.co.za returned no US data; Korn Ferry is the primary gap signal

  insert into competitors (brand_id, competitor_domain, gap_keywords)
  values (
    v_brand_id,
    'kornferry.com',
    array[
      'executive recruiting search firms',
      'executive headhunting firms',
      'executive search firms',
      'executive search firm',
      'executive recruiters',
      'executive recruiting firms',
      'legal recruiter',
      'legal recruiters',
      'recruitment process outsourcing',
      'executive search agency',
      'top executive search firms',
      'leadership coaching'
    ]
  )
  on conflict (brand_id, competitor_domain) do update
    set gap_keywords = excluded.gap_keywords;

end $$;
