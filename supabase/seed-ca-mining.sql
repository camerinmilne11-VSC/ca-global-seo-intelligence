-- =============================================================================
-- Seed: seed-ca-mining.sql
-- Project: SEO Content Intelligence System — CA Mining
-- Source:  SEMrush Phase 2 research (June 2026)
--          Databases: za (South Africa/Africa primary), uk (international), us (global)
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
  v_cluster_6  uuid;
begin

  select id into v_brand_id from brands where slug = 'ca-mining';

  -- Pillar 1: South Africa Mining Jobs (Vacancies Hub)
  -- Primary: mining vacancies (ZA: 8,100 vol, comp 0.12) — highest-volume mining term found
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'South Africa Mining Jobs',
    'Central vacancies hub targeting the highest-volume ZA mining search terms. CA Mining already ranks for adjacent terms; this pillar consolidates authority around mining vacancies, mining jobs, and mining careers in South Africa.',
    'mining vacancies'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_1;

  if v_cluster_1 is null then
    select id into v_cluster_1 from clusters
    where brand_id = v_brand_id and primary_keyword = 'mining vacancies';
  end if;

  -- Pillar 2: Geographic Mining Jobs (SA Regions)
  -- Primary: mining jobs in limpopo (ZA: 880 vol, comp 0.13)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Geographic Mining Jobs SA',
    'Location-specific landing pages for South Africa mining regions (Limpopo, Rustenburg/North West, Mpumalanga). Three 1,900-vol regional terms with comp 0.13–0.19 and no current CA Mining presence.',
    'mining jobs in limpopo'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_2;

  if v_cluster_2 is null then
    select id into v_cluster_2 from clusters
    where brand_id = v_brand_id and primary_keyword = 'mining jobs in limpopo';
  end if;

  -- Pillar 3: Mining Recruitment Agency (B2B Positioning)
  -- Primary: mining recruitment agencies (ZA: 210 vol, comp 0.19, CA Mining already ranks #7)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Mining Recruitment Agency',
    'B2B service positioning page for CA Mining as Africa specialist mining recruitment agency. Targets ZA employer/agency searches and international client searches (mining executive search CPC $5.80 US). CA Mining currently ranks #7 for primary keyword on homepage — dedicated page will improve and expand.',
    'mining recruitment agencies'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_3;

  if v_cluster_3 is null then
    select id into v_cluster_3 from clusters
    where brand_id = v_brand_id and primary_keyword = 'mining recruitment agencies';
  end if;

  -- Pillar 4: Africa & Expat Mining Jobs
  -- Primary: mining jobs in africa (ZA: 210 vol, comp 0.05)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Africa & Expat Mining Jobs',
    'Africa-wide and expat/FIFO mining jobs hub. Very low competition across all Africa-geography terms (comp 0.02–0.05). CA Mining already ranks for FIFO terms — consolidate into a structured Africa hub targeting expat mining professionals and international contractors.',
    'mining jobs in africa'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_4;

  if v_cluster_4 is null then
    select id into v_cluster_4 from clusters
    where brand_id = v_brand_id and primary_keyword = 'mining jobs in africa';
  end if;

  -- Pillar 5: Technical & Specialist Mining Roles
  -- Primary: rock engineering jobs (ZA: 260 vol, comp 0.01 — near-zero competition)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Technical & Specialist Mining Roles',
    'Role-specific category pages for high-value technical mining roles CA Mining actively recruits. Rock engineering, mining finance, logistics, law, and mine management terms are all generating rankings via individual job listing URLs — structured category pages consolidate that authority.',
    'rock engineering jobs'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_5;

  if v_cluster_5 is null then
    select id into v_cluster_5 from clusters
    where brand_id = v_brand_id and primary_keyword = 'rock engineering jobs';
  end if;

  -- Pillar 6: Commodities & International Mining Recruitment
  -- Primary: mining executive search (US: 110 vol, CPC $5.80 — highest CPC in research)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Commodities & International Mining Recruitment',
    'International-facing service content targeting mining and commodities companies outside Africa hiring into African operations. Mining executive search (CPC $5.80) signals PE-backed mining projects and multinational mining groups. Positions CA Mining for international client development.',
    'mining executive search'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_6;

  if v_cluster_6 is null then
    select id into v_cluster_6 from clusters
    where brand_id = v_brand_id and primary_keyword = 'mining executive search';
  end if;

  -- ─── Keyword inserts ───────────────────────────────────────────────────────
  -- Scoring methodology (from lib/semrush.ts):
  --   volume 25% | ease (100-kd) 20% | commercial 15% | recruitment_match 15%
  --   geo_match 10% | dual_audience 10% | content_gap 5%
  -- KD estimated from Co (competition density) field: Co*100 used as proxy.
  -- Database source noted per keyword.

  -- ── PILLAR 1: South Africa Mining Jobs ────────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- mining vacancies — ZA: 8100 vol, CPC $0.02, comp 0.12
  (v_brand_id, v_cluster_1, 'mining vacancies', 8100, 12, 'I',
   84, 'ZA db: 8,100 vol — HIGHEST volume mining term found · comp 0.12 (very low) · CA Mining NOT ranking · on-page optimisation of /vacancies/ page is the single highest-ROI action in this research',
   'opportunity'),

  -- mining jobs — ZA: 5400 vol, CPC $0.02, comp 0.14
  (v_brand_id, v_cluster_1, 'mining jobs', 5400, 14, 'I',
   82, 'ZA db: 5,400 vol · comp 0.14 · CA Mining not ranking · hub page secondary target alongside mining vacancies · consistent 12-month trends (peak 1.00 recent months)',
   'opportunity'),

  -- mining careers in south africa — ZA: 1900 vol, CPC $0.02, comp 0.15
  (v_brand_id, v_cluster_1, 'mining careers in south africa', 1900, 15, 'I',
   79, 'ZA db: 1,900 vol · comp 0.15 · CA Mining ranks #35 — effectively unranked · content refresh + internal linking from vacancies hub to push into top 10',
   'opportunity'),

  -- mining jobs south africa — ZA: 480 vol, CPC $0.02, comp 0.14
  (v_brand_id, v_cluster_1, 'mining jobs south africa', 480, 14, 'I',
   74, 'ZA db: 480 vol · comp 0.14 · CA Mining ranks #16 for related form · supporting term for vacancies hub optimisation',
   'opportunity'),

  -- gold mining jobs — ZA: 480 vol, CPC $0.02, comp 0.09
  (v_brand_id, v_cluster_1, 'gold mining jobs', 480, 9, 'I',
   72, 'ZA db: 480 vol · comp 0.09 (very low) · commodity-specific job seeker search · CA Mining active in gold mining placements · content gap',
   'opportunity'),

  -- mining jobs in south africa — ZA: 480 vol, CPC $0.02, comp 0.14 (camining.com ranks #16)
  (v_brand_id, v_cluster_1, 'mining jobs in south africa', 480, 14, 'I',
   73, 'ZA db: 480 vol · CA Mining ranks #16 · improve existing rank · supporting keyword for main vacancies hub',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 2: Geographic Mining Jobs SA ───────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- mining jobs in rustenburg — ZA: 1900 vol, CPC $0.01, comp 0.19
  (v_brand_id, v_cluster_2, 'mining jobs in rustenburg', 1900, 19, 'I',
   74, 'ZA db: 1,900 vol · comp 0.19 · Rustenburg/North West is SA platinum belt — CA Mining active here · location page with filtered vacancies',
   'opportunity'),

  -- mining jobs in mpumalanga — ZA: 1900 vol, CPC $0.01, comp 0.14
  (v_brand_id, v_cluster_2, 'mining jobs in mpumalanga', 1900, 14, 'I',
   75, 'ZA db: 1,900 vol · comp 0.14 (lower than Rustenburg) · Mpumalanga coal belt · location page opportunity',
   'opportunity'),

  -- mining jobs in limpopo — ZA: 880 vol, CPC $0.02, comp 0.13
  (v_brand_id, v_cluster_2, 'mining jobs in limpopo', 880, 13, 'I',
   73, 'ZA db: 880 vol · comp 0.13 · Limpopo platinum/chrome mining region · location page opportunity · low competition',
   'opportunity'),

  -- vacancies in mining companies — ZA: 210 vol, CPC $0.03, comp 0.15 (camining.com ranks #30)
  (v_brand_id, v_cluster_2, 'vacancies in mining companies', 210, 15, 'I',
   62, 'ZA db: 210 vol · CA Mining ranks #30 — improve · supporting term for regional pages · job seeker intent',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 3: Mining Recruitment Agency ───────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- mining recruitment agencies — ZA: 210 vol, CPC $0.11, comp 0.19 (camining.com ranks #7)
  (v_brand_id, v_cluster_3, 'mining recruitment agencies', 210, 19, 'C',
   76, 'ZA db: 210 vol, CPC $0.11, comp 0.19 · CA Mining ranks #7 on homepage · dedicated service page will improve rank + expand to supporting terms · employer + candidate dual intent',
   'opportunity'),

  -- recruitment agencies for mining jobs — ZA: 90 vol, CPC $0.10, comp 0.19 (camining.com ranks #6)
  (v_brand_id, v_cluster_3, 'recruitment agencies for mining jobs', 90, 19, 'C',
   69, 'ZA db: 90 vol, CPC $0.10, comp 0.19 · CA Mining ranks #6 on homepage · supporting term for agency service page · defend and extend existing rank',
   'opportunity'),

  -- mining recruitment — US: 260 vol, CPC $0.79, comp 0.16
  (v_brand_id, v_cluster_3, 'mining recruitment', 260, 16, 'C',
   69, 'US db: 260 vol, CPC $0.79 · comp 0.16 low competition · primary service descriptor · CA Mining brand identity term · UK: 90 vol comp 0.03',
   'opportunity'),

  -- mining recruiter — US: 90 vol, CPC $0.84, comp 0.02
  (v_brand_id, v_cluster_3, 'mining recruiter', 90, 2, 'C',
   67, 'US db: 90 vol, CPC $0.84, VERY LOW comp 0.02 · singular recruiter intent = employer searching for a specific hire · quick win for service page',
   'opportunity'),

  -- mining recruitment — UK: 90 vol, CPC $0.00, comp 0.03
  (v_brand_id, v_cluster_3, 'mining recruitment', 90, 3, 'C',
   66, 'UK db: 90 vol, comp 0.03 — very low competition in UK/international mining recruitment search · international employer audience',
   'opportunity'),

  -- mining recruitment africa — UK: 20 vol, CPC $0.00, comp 0.02 (perfectly consistent trend 1.00)
  (v_brand_id, v_cluster_3, 'mining recruitment africa', 20, 2, 'C',
   65, 'UK db: 20 vol, comp 0.02 · perfectly consistent monthly trend signal (1.00 every month) — stable year-round demand from international hiring managers · exact match for CA Mining service + geography',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 4: Africa & Expat Mining Jobs ──────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- mining jobs in africa — ZA: 210 vol, CPC $0.07, comp 0.05 (camining.com ranks #10)
  (v_brand_id, v_cluster_4, 'mining jobs in africa', 210, 5, 'I',
   72, 'ZA db: 210 vol, CPC $0.07, VERY LOW comp 0.05 · CA Mining ranks #10 — improve to top 5 · trending strongly upward (1.00 peak recent months) · anchor term for Africa hub',
   'opportunity'),

  -- mining jobs africa — ZA: 210 vol, CPC $0.07, comp 0.05
  (v_brand_id, v_cluster_4, 'mining jobs africa', 210, 5, 'I',
   72, 'ZA db: 210 vol, CPC $0.07, comp 0.05 · near-identical to mining jobs in africa · same low competition · supporting variant for Africa hub',
   'opportunity'),

  -- expat mining jobs africa — ZA: 140 vol, CPC $0.10, comp 0.05
  (v_brand_id, v_cluster_4, 'expat mining jobs africa', 140, 5, 'C',
   75, 'ZA db: 140 vol, CPC $0.10, comp 0.05 · expat audience = high-value executive candidate segment · CA Mining specialist in this area · very low competition',
   'opportunity'),

  -- fifo expat mining jobs africa — ZA: 210 vol, CPC $0.00, comp 0.33 (camining.com ranks #7)
  (v_brand_id, v_cluster_4, 'fifo expat mining jobs africa', 210, 33, 'I',
   68, 'ZA db: 210 vol, comp 0.33 · CA Mining already ranks #7 for specific job listing · FIFO content working — consolidate into hub page · defend and improve existing rank',
   'opportunity'),

  -- mining engineer jobs africa — ZA: 40 vol, CPC $0.00, comp 0.00
  (v_brand_id, v_cluster_4, 'mining engineer jobs africa', 40, 0, 'I',
   60, 'ZA db: 40 vol, ZERO competition (comp 0.00) · engineering roles are core CA Mining placements · supporting term for Africa hub with zero resistance',
   'opportunity'),

  -- mining jobs in west africa — ZA: 20 vol, CPC $0.00, comp 0.23
  (v_brand_id, v_cluster_4, 'mining jobs in west africa', 20, 23, 'I',
   55, 'ZA db: 20 vol · West Africa gold belt is a CA Mining specialty · low absolute volume but relevant audience · trend peaked to 1.00 recently',
   'opportunity'),

  -- mining jobs in drc — ZA: 20 vol, CPC $0.11, comp 0.40
  (v_brand_id, v_cluster_4, 'mining jobs in drc', 20, 40, 'I',
   51, 'ZA db: 20 vol, CPC $0.11 · DRC cobalt/copper belt — high-value mining region · content gap vs specific geo demand',
   'opportunity'),

  -- mining jobs in zambia — ZA: 20 vol, CPC $0.00, comp 0.33
  (v_brand_id, v_cluster_4, 'mining jobs in zambia', 20, 33, 'I',
   50, 'ZA db: 20 vol · Zambia copper belt — active CA Mining market · supporting geo term for Africa hub',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 5: Technical & Specialist Mining Roles ─────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- rock engineering jobs — ZA: 260 vol, CPC $0.00, comp 0.01 (camining.com ranks #10)
  (v_brand_id, v_cluster_5, 'rock engineering jobs', 260, 1, 'I',
   71, 'ZA db: 260 vol, NEAR-ZERO comp 0.01 · CA Mining ranks #10 for specific job URL · rock engineers are high-value placements · category page would consolidate ranking authority · quick win',
   'opportunity'),

  -- rock engineer jobs — ZA: 260 vol, CPC $0.00, comp 0.01 (same competition)
  (v_brand_id, v_cluster_5, 'rock engineer jobs', 260, 1, 'I',
   71, 'ZA db: 260 vol, comp 0.01 · variant of rock engineering jobs · same audience, same opportunity · include on category page',
   'opportunity'),

  -- mining finance jobs — ZA: 170 vol, CPC $0.03, comp 0.05 (camining.com ranks #9)
  (v_brand_id, v_cluster_5, 'mining finance jobs', 170, 5, 'I',
   67, 'ZA db: 170 vol, comp 0.05, CPC $0.03 · CA Mining ranks #9 for specific job URL · finance roles in mining (operational, strategy) are specialist placements · category page opportunity',
   'opportunity'),

  -- mining logistics jobs — ZA: 140 vol, CPC $0.05, comp 0.06 (camining.com ranks #8)
  (v_brand_id, v_cluster_5, 'mining logistics jobs', 140, 6, 'I',
   65, 'ZA db: 140 vol, comp 0.06 · CA Mining ranks #8 for specific job URL · supply chain and logistics roles in mining · category page consolidates existing rank',
   'opportunity'),

  -- mine manager jobs — ZA: 110 vol, CPC $0.01, comp 0.08
  (v_brand_id, v_cluster_5, 'mine manager jobs', 110, 8, 'I',
   63, 'ZA db: 110 vol, comp 0.08 · mine manager placements are core CA Mining executive roles · good consistent trend signal · content gap',
   'opportunity'),

  -- mining law jobs — ZA: 110 vol, CPC $0.02, comp 0.09 (camining.com ranks #6)
  (v_brand_id, v_cluster_5, 'mining law jobs', 110, 9, 'I',
   63, 'ZA db: 110 vol, comp 0.09 · CA Mining ranks #6 for specific job URL · legal roles in mining companies are specialist placements · category page would capture and improve existing rank',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 6: Commodities & International Mining Recruitment ──────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- mining executive search — US: 110 vol, CPC $5.80 (!), comp 0.39
  (v_brand_id, v_cluster_6, 'mining executive search', 110, 39, 'C',
   77, 'US db: 110 vol, CPC $5.80 — HIGHEST CPC in this research · comp 0.39 · signals PE-backed mining projects and multinational mining groups searching for executive search partners · international client development page',
   'opportunity'),

  -- mining executive search — UK: 50 vol, CPC $0.00, comp 0.02
  (v_brand_id, v_cluster_6, 'mining executive search', 50, 2, 'C',
   71, 'UK db: 50 vol, comp 0.02 — VERY LOW competition in UK market · trending upward (values 0.57–1.00 last 6 months) · UK commodity houses and mining groups hiring into Africa',
   'opportunity'),

  -- commodities recruitment — UK: 50 vol, CPC $0.78, comp 0.05
  (v_brand_id, v_cluster_6, 'commodities recruitment', 50, 5, 'C',
   71, 'UK db: 50 vol, CPC $0.78, comp 0.05 · commodity trading firms recruiting for Africa operations · consistent trend signal (peak 1.00 recently) · CA Mining adjacent to commodities vertical',
   'opportunity'),

  -- ca mining — ZA: 320 vol, CPC $1.04, comp 0.03 (brand term, camining.com ranks #1)
  (v_brand_id, v_cluster_6, 'ca mining', 320, 3, 'N',
   55, 'ZA db: 320 vol, CPC $1.04 (highest CPC in ZA dataset) · CA Mining ranks #1 · brand SERP · defend and protect · high CPC suggests competitor ads on brand terms',
   'opportunity'),

  -- ca mining vacancies — ZA: 90 vol, CPC $0.16, comp 0.15 (camining.com ranks #1 and #3)
  (v_brand_id, v_cluster_6, 'ca mining vacancies', 90, 15, 'N',
   51, 'ZA db: 90 vol, CPC $0.16 · CA Mining ranks #1 and #3 for two URLs · brand SERP solid · maintain and defend',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ─── Competitor gap records ────────────────────────────────────────────────
  -- miningpeople.com.au and mining-recruitment.com returned ERROR 50 in all
  -- three SEMrush databases (ZA, UK, US) — not indexed at this time.
  -- Keyword-level competition density (Co field) is the best available proxy.

  insert into competitors (brand_id, competitor_domain, gap_keywords)
  values (
    v_brand_id,
    'miningpeople.com.au',
    array[
      'mining vacancies',
      'mining jobs',
      'mining careers in south africa',
      'mining jobs in africa',
      'expat mining jobs africa',
      'mining recruitment agencies',
      'mining executive search',
      'rock engineering jobs'
    ]
  )
  on conflict (brand_id, competitor_domain) do update
    set gap_keywords = excluded.gap_keywords;

  insert into competitors (brand_id, competitor_domain, gap_keywords)
  values (
    v_brand_id,
    'mining-recruitment.com',
    array[
      'mining vacancies',
      'mining jobs',
      'mining recruitment',
      'mining recruiter',
      'mining recruitment africa',
      'commodities recruitment',
      'mining executive search',
      'mining careers in south africa'
    ]
  )
  on conflict (brand_id, competitor_domain) do update
    set gap_keywords = excluded.gap_keywords;

  -- Note: Both competitor domains unindexed in SEMrush (June 2026) across all databases.
  -- miningpeople.com.au — ERROR 50 (za, uk, us)
  -- mining-recruitment.com — ERROR 50 (za, uk, us)
  -- Re-check quarterly as SEMrush index grows.
  -- Gap keywords above are derived from keyword research — not from domain organic exports.

end $$;
