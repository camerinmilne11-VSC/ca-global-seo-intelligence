-- =============================================================================
-- Seed: seed-ca-finance.sql
-- Project: SEO Content Intelligence System — CA Finance
-- Source:  SEMrush Phase 3 research (June 2026)
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

  select id into v_brand_id from brands where slug = 'ca-finance';

  -- Pillar 1: Finance Jobs Hub (SA & Africa)
  -- Primary: finance jobs (ZA: 1,900 vol, comp 0.10) — highest-volume finance term found
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Finance Jobs Hub',
    'Central finance job search hub for South Africa and Africa. Aggregates CA Finance active vacancies across financial manager, executive finance, and broad finance role searches. CA Finance has zero current rankings for these high-volume terms — the largest gap in this research.',
    'finance jobs'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_1;

  if v_cluster_1 is null then
    select id into v_cluster_1 from clusters
    where brand_id = v_brand_id and primary_keyword = 'finance jobs';
  end if;

  -- Pillar 2: C-Suite Finance Recruitment (CFO / Finance Director)
  -- Primary: CFO recruitment (US: $12.34 CPC — highest CPC in research)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'C-Suite Finance Recruitment',
    'C-suite service content targeting clients hiring CFOs, Finance Directors, and senior finance executives across African markets. CFO recruitment ($12.34 CPC US, $7.42 UK) signals maximum commercial intent from PE-backed businesses and multinationals. CA Finance CA(SA) credentialed leadership is the key differentiator.',
    'CFO recruitment'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_2;

  if v_cluster_2 is null then
    select id into v_cluster_2 from clusters
    where brand_id = v_brand_id and primary_keyword = 'CFO recruitment';
  end if;

  -- Pillar 3: CA(SA) & Accounting Talent
  -- Primary: chartered accountant jobs (ZA: 720 vol, comp 0.06 — very low competition)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'CA(SA) & Accounting Talent',
    'CA(SA) and chartered accountant specialist recruitment page targeting both job seekers (CA(SA) professionals seeking roles) and clients (companies seeking chartered accountant talent). CA Finance is the natural owner of this niche by brand name alone, yet ranks for none of these terms. Combined ZA volume exceeds 1,900.',
    'chartered accountant jobs'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_3;

  if v_cluster_3 is null then
    select id into v_cluster_3 from clusters
    where brand_id = v_brand_id and primary_keyword = 'chartered accountant jobs';
  end if;

  -- Pillar 4: Development Finance & DFI Sector
  -- Primary: dfi (ZA: 590 vol, CPC $3.56, comp 0.02 — near-zero competition, highest CPC in ZA data)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Development Finance & DFI Sector',
    'CA Finance uniquely serves the Development Finance Institution sector in Africa — a specialism no generalist recruitment firm covers at depth. CA Finance already ranks #3 for development finance jobs and #23 for dfi (590 vol, CPC $3.56). DFI hub page consolidates these rankings and captures high-CPC search intent from development banks, MFIs, and DFI operators.',
    'dfi'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_4;

  if v_cluster_4 is null then
    select id into v_cluster_4 from clusters
    where brand_id = v_brand_id and primary_keyword = 'dfi';
  end if;

  -- Pillar 5: Investment Banking & Private Equity
  -- Primary: private equity jobs (ZA: 210 vol, comp 0.06 — CA Finance ranks #16, improve)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Investment Banking & Private Equity',
    'Private equity and investment banking talent page covering buy-side roles across Africa. CA Finance already ranks #11 for private equity jobs south africa and #16 for private equity jobs — both weak positions on existing pages. Dedicated service content will improve rankings and capture the international investment banking recruitment audience (UK: 110 vol).',
    'private equity jobs'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_5;

  if v_cluster_5 is null then
    select id into v_cluster_5 from clusters
    where brand_id = v_brand_id and primary_keyword = 'private equity jobs';
  end if;

  -- Pillar 6: Specialist Finance Roles (Risk, Treasury, Control)
  -- Primary: risk management jobs south africa (ZA: 480 vol, comp 0.07)
  insert into clusters (brand_id, pillar_name, description, primary_keyword)
  values (
    v_brand_id,
    'Specialist Finance Roles',
    'Role-specific landing pages for specialist finance functions CA Finance actively recruits: risk management, financial control, and treasury. Combined 1,120 ZA volume with low-moderate competition. Builds topical authority across the finance function and supports CFO and Finance Hub pillars.',
    'risk management jobs south africa'
  )
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_6;

  if v_cluster_6 is null then
    select id into v_cluster_6 from clusters
    where brand_id = v_brand_id and primary_keyword = 'risk management jobs south africa';
  end if;

  -- ─── Keyword inserts ───────────────────────────────────────────────────────
  -- Scoring methodology (from lib/semrush.ts):
  --   volume 25% | ease (100-kd) 20% | commercial 15% | recruitment_match 15%
  --   geo_match 10% | dual_audience 10% | content_gap 5%
  -- KD estimated from Co (competition density) field: Co*100 used as proxy.
  -- Database source noted per keyword.

  -- ── PILLAR 1: Finance Jobs Hub ────────────────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- finance jobs — ZA: 1900 vol, CPC $0.08, comp 0.10
  (v_brand_id, v_cluster_1, 'finance jobs', 1900, 10, 'I',
   82, 'ZA db: 1,900 vol — HIGHEST volume finance term found · comp 0.10 (low) · CA Finance NOT ranking · hub page primary target; single highest-ROI content action in this research',
   'opportunity'),

  -- financial manager jobs — ZA: 1300 vol, CPC $0.05, comp 0.12
  (v_brand_id, v_cluster_1, 'financial manager jobs', 1300, 12, 'I',
   81, 'ZA db: 1,300 vol · comp 0.12 · CA Finance not ranking · financial manager = core executive placement role · hub page secondary target alongside finance jobs',
   'opportunity'),

  -- finance jobs south africa — ZA: 590 vol, CPC $0.06, comp 0.09
  (v_brand_id, v_cluster_1, 'finance jobs south africa', 590, 9, 'I',
   77, 'ZA db: 590 vol · comp 0.09 · CA Finance not ranking · geo-specific variant of hub primary · consistent year-round trend (all months 0.66-1.00)',
   'opportunity'),

  -- finance executive jobs — ZA: 20 vol, CPC $0.03, comp 0.13
  (v_brand_id, v_cluster_1, 'finance executive jobs', 20, 13, 'C',
   54, 'ZA db: 20 vol · comp 0.13 · executive-level finance job search · small but commercially relevant audience · supporting term for hub page',
   'opportunity'),

  -- finance jobs africa — ZA: 20 vol, CPC $0.00, comp 0.33
  (v_brand_id, v_cluster_1, 'finance jobs africa', 20, 33, 'C',
   55, 'ZA db: 20 vol · comp 0.33 · Africa-geo finance jobs search · small volume but exact-match to CA Finance scope · supporting term for hub',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 2: C-Suite Finance Recruitment ────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- CFO recruitment — US: 210 vol, CPC $12.34, comp 0.16
  (v_brand_id, v_cluster_2, 'CFO recruitment', 210, 16, 'C',
   81, 'US db: 210 vol, CPC $12.34 — HIGHEST CPC in this research · comp 0.16 · PE-backed businesses and multinationals searching for C-suite finance search partner · international client development page for CA Finance',
   'opportunity'),

  -- CFO recruitment — UK: 390 vol, CPC $7.42, comp 0.18
  (v_brand_id, v_cluster_2, 'CFO recruitment', 390, 18, 'C',
   79, 'UK db: 390 vol, CPC $7.42 · comp 0.18 · UK-based international companies hiring CFOs into African operations · confirms strong buyer intent signal across both UK and US databases',
   'opportunity'),

  -- cfo jobs — ZA: 480 vol, CPC $0.03, comp 0.12
  (v_brand_id, v_cluster_2, 'cfo jobs', 480, 12, 'I',
   78, 'ZA db: 480 vol · comp 0.12 · CFO candidate job search — ZA market · CA Finance not ranking · dedicated CFO service page captures both client-side (CFO recruitment) and candidate-side (cfo jobs) searches',
   'opportunity'),

  -- cfo jobs south africa — ZA: 320 vol, CPC $0.03, comp 0.08
  (v_brand_id, v_cluster_2, 'cfo jobs south africa', 320, 8, 'I',
   74, 'ZA db: 320 vol · comp 0.08 (very low) · geo-specific CFO candidate search · CA Finance not ranking · supporting keyword for CFO service page',
   'opportunity'),

  -- CFO search — UK: 70 vol, CPC $9.99, comp 0.16
  (v_brand_id, v_cluster_2, 'CFO search', 70, 16, 'C',
   72, 'UK db: 70 vol, CPC $9.99 · comp 0.16 · high-intent alternative to CFO recruitment · confirms UK employer market actively bidding on CFO search terms · international audience for CA Finance',
   'opportunity'),

  -- executive search finance — UK: 140 vol, CPC $2.75, comp 0.09
  (v_brand_id, v_cluster_2, 'executive search finance', 140, 9, 'C',
   73, 'UK db: 140 vol, CPC $2.75 · comp 0.09 · finance-specific executive search from UK/international buyers · supports CFO page as a broader landing keyword',
   'opportunity'),

  -- finance director recruitment — UK: 260 vol, CPC $0.00, comp 0.00
  (v_brand_id, v_cluster_2, 'finance director recruitment', 260, 0, 'C',
   68, 'UK db: 260 vol · comp 0.00 — ZERO competition in UK database · finance director = key CA Finance placement · Finance Director service page natural companion to CFO page',
   'opportunity'),

  -- finance director jobs south africa — ZA: 110 vol, CPC $0.00, comp 0.08
  (v_brand_id, v_cluster_2, 'finance director jobs south africa', 110, 8, 'I',
   67, 'ZA db: 110 vol · comp 0.08 · Finance Director candidate search in ZA · CA Finance not ranking · supporting keyword for Finance Director service page',
   'opportunity'),

  -- executive search africa — ZA: 20 vol, CPC $0.00, comp 0.21
  (v_brand_id, v_cluster_2, 'executive search africa', 20, 21, 'C',
   56, 'ZA db: 20 vol · comp 0.21 · Africa-wide executive search intent · small volume but high-intent signal · CA Finance not ranking · long-tail support for C-suite page',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 3: CA(SA) & Accounting Talent ─────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- chartered accountant jobs — ZA: 720 vol, CPC $0.08, comp 0.06
  (v_brand_id, v_cluster_3, 'chartered accountant jobs', 720, 6, 'I',
   79, 'ZA db: 720 vol, CPC $0.08, comp 0.06 — VERY LOW competition · CA Finance is the natural owner by brand name alone · not ranking for this term · highest-volume low-competition quick win in this pillar',
   'opportunity'),

  -- CA SA jobs — ZA: 480 vol, CPC $0.05, comp 0.06
  (v_brand_id, v_cluster_3, 'CA SA jobs', 480, 6, 'I',
   76, 'ZA db: 480 vol · comp 0.06 · CA(SA) job seeker search — CA Finance brand acronym is exact match · CA Finance not ranking · peak trend values 1.00 in recent months · immediate content gap',
   'opportunity'),

  -- accounting jobs south africa — ZA: 480 vol, CPC $0.06, comp 0.09
  (v_brand_id, v_cluster_3, 'accounting jobs south africa', 480, 9, 'I',
   76, 'ZA db: 480 vol · comp 0.09 · accounting job seeker intent (candidates) · CA Finance not ranking · supporting term for CA(SA) & accounting page',
   'opportunity'),

  -- chartered accountant jobs south africa — ZA: 260 vol, CPC $0.06, comp 0.09
  (v_brand_id, v_cluster_3, 'chartered accountant jobs south africa', 260, 9, 'I',
   72, 'ZA db: 260 vol · comp 0.09 · geo-specific CA(SA) job search · CA Finance not ranking · supporting keyword for CA(SA) specialist page · consistent year-round trend',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 4: Development Finance & DFI Sector ───────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- dfi — ZA: 590 vol, CPC $3.56, comp 0.02 (ca-finance.com ranks #23)
  (v_brand_id, v_cluster_4, 'dfi', 590, 2, 'C',
   74, 'ZA db: 590 vol, CPC $3.56, NEAR-ZERO comp 0.02 · CA Finance ranks #23 — improve to top 5 · highest CPC in ZA dataset confirms development finance attracts paid bidders from international DFIs and development banks · highest-priority existing ranking to improve',
   'opportunity'),

  -- development finance jobs — ZA: 110 vol, CPC $0.00, comp 0.03 (ca-finance.com ranks #3)
  (v_brand_id, v_cluster_4, 'development finance jobs', 110, 3, 'I',
   67, 'ZA db: 110 vol · NEAR-ZERO comp 0.03 · CA Finance ranks #3 — DEFEND and extend to related terms · this is CA Finance strongest existing position · hub page will consolidate and protect this rank',
   'opportunity'),

  -- development finance institutions dfis — ZA: 90 vol, CPC $4.01, comp 0.06 (ca-finance.com ranks #25)
  (v_brand_id, v_cluster_4, 'development finance institutions dfis', 90, 6, 'C',
   72, 'ZA db: 90 vol, CPC $4.01 — second-highest CPC in domain organic data · comp 0.06 · CA Finance ranks #25 · improve with dedicated DFI hub page · development banks and MFIs searching for recruitment partners',
   'opportunity'),

  -- dfi jobs — ZA: 20 vol, CPC $0.00, comp 0.33
  (v_brand_id, v_cluster_4, 'dfi jobs', 20, 33, 'I',
   52, 'ZA db: 20 vol · comp 0.33 · job seeker search within DFI sector · small volume but exact-match audience for CA Finance DFI specialist practice · supporting term for hub page',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 5: Investment Banking & Private Equity ─────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- private equity jobs — ZA: 210 vol, CPC $0.13, comp 0.06 (ca-finance.com ranks #16)
  (v_brand_id, v_cluster_5, 'private equity jobs', 210, 6, 'I',
   71, 'ZA db: 210 vol, CPC $0.13, comp 0.06 · CA Finance ranks #16 on existing /private-equity/ page · dedicated service page will improve rank · buy-side job seeker and employer dual-audience potential',
   'opportunity'),

  -- investment banking jobs south africa — ZA: 140 vol, CPC $0.06, comp 0.05
  (v_brand_id, v_cluster_5, 'investment banking jobs south africa', 140, 5, 'I',
   71, 'ZA db: 140 vol · VERY LOW comp 0.05 · investment banking job seeker in ZA · CA Finance not ranking · supporting term for PE/IB page · trend peaked 1.00 in recent months',
   'opportunity'),

  -- private equity jobs south africa — ZA: 110 vol, CPC $0.00, comp 0.04 (ca-finance.com ranks #11)
  (v_brand_id, v_cluster_5, 'private equity jobs south africa', 110, 4, 'I',
   69, 'ZA db: 110 vol · VERY LOW comp 0.04 · CA Finance ranks #11 on existing page · improve to top 5 with dedicated content · geo-specific PE job seeker search',
   'opportunity'),

  -- investment banking recruitment — UK: 110 vol, CPC $0.00, comp 0.04
  (v_brand_id, v_cluster_5, 'investment banking recruitment', 110, 4, 'C',
   70, 'UK db: 110 vol · comp 0.04 — VERY LOW competition · client-side IB recruitment intent from UK/international audience · CPC $0 suggests low paid competition — organic opportunity · international firms hiring IB talent for Africa operations',
   'opportunity')

  on conflict (brand_id, keyword) do update
    set cluster_id            = excluded.cluster_id,
        volume                = excluded.volume,
        difficulty            = excluded.difficulty,
        search_intent         = excluded.search_intent,
        priority_score        = excluded.priority_score,
        opportunity_rationale = excluded.opportunity_rationale,
        last_synced           = now();

  -- ── PILLAR 6: Specialist Finance Roles ───────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent,
                        priority_score, opportunity_rationale, content_status)
  values
  -- risk management jobs south africa — ZA: 480 vol, CPC $0.02, comp 0.07
  (v_brand_id, v_cluster_6, 'risk management jobs south africa', 480, 7, 'I',
   75, 'ZA db: 480 vol · comp 0.07 (low) · risk management is core finance discipline CA Finance recruits for · CA Finance not ranking · year-round consistent trend (0.54-1.00) · category page opportunity',
   'opportunity'),

  -- financial controller jobs — ZA: 320 vol, CPC $0.04, comp 0.11
  (v_brand_id, v_cluster_6, 'financial controller jobs', 320, 11, 'I',
   74, 'ZA db: 320 vol · comp 0.11 · financial controller = high-volume executive placement role · CA Finance not ranking · consistent year-round trend · category page alongside risk and treasury',
   'opportunity'),

  -- treasury jobs south africa — ZA: 320 vol, CPC $0.00, comp 0.33
  (v_brand_id, v_cluster_6, 'treasury jobs south africa', 320, 33, 'I',
   68, 'ZA db: 320 vol · comp 0.33 (moderate) · treasury function is specialist CA Finance placement area · CA Finance not ranking · higher difficulty than other specialist terms but 320 vol justifies targeting',
   'opportunity'),

  -- ca financial appointments — ZA: 480 vol, CPC $0.45, comp 0.37 (ca-finance.com ranks #26)
  (v_brand_id, v_cluster_6, 'ca financial appointments', 480, 37, 'C',
   70, 'ZA db: 480 vol, CPC $0.45, comp 0.37 · CA Finance ranks #26 for this brand-adjacent term · homepage optimisation or dedicated brand-positioning page could capture this intent before competitors bid on CA brand terms · commercial intent confirmed by CPC $0.45',
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
  -- Both robertwalters.co.za and michaelpage.co.za returned ERROR 50 in ZA database
  -- (consistent with all prior research phases — not indexed at sufficient depth).
  -- Gap keywords below are derived from keyword research data, not from domain organic exports.

  insert into competitors (brand_id, competitor_domain, gap_keywords)
  values (
    v_brand_id,
    'robertwalters.co.za',
    array[
      'finance jobs south africa',
      'financial manager jobs',
      'accounting jobs south africa',
      'cfo jobs',
      'risk management jobs south africa',
      'financial controller jobs',
      'chartered accountant jobs south africa',
      'investment banking jobs south africa'
    ]
  )
  on conflict (brand_id, competitor_domain) do update
    set gap_keywords = excluded.gap_keywords;

  insert into competitors (brand_id, competitor_domain, gap_keywords)
  values (
    v_brand_id,
    'michaelpage.co.za',
    array[
      'finance jobs south africa',
      'cfo jobs south africa',
      'financial manager jobs',
      'chartered accountant jobs',
      'CA SA jobs',
      'treasury jobs south africa',
      'finance director jobs south africa',
      'private equity jobs south africa'
    ]
  )
  on conflict (brand_id, competitor_domain) do update
    set gap_keywords = excluded.gap_keywords;

  -- Note: Both competitor domains unindexed in SEMrush ZA database (June 2026).
  -- robertwalters.co.za — ERROR 50 (za)
  -- michaelpage.co.za   — ERROR 50 (za)
  -- Re-check quarterly as SEMrush index grows.
  -- Gap keywords above are derived from keyword research — not from domain organic exports.

end $$;
