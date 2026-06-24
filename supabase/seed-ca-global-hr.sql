-- =============================================================================
-- Seed: CA Global HR keywords
-- Run AFTER 002_add_new_brands.sql
-- Supabase Dashboard → SQL Editor → paste and run
-- =============================================================================

do $$
declare
  v_brand_id uuid;
  v_cluster_eor      uuid;
  v_cluster_peo      uuid;
  v_cluster_hr       uuid;
  v_cluster_payroll  uuid;
  v_cluster_law      uuid;
  v_cluster_expand   uuid;
begin
  select id into v_brand_id from brands where slug = 'ca-global-hr';
  if v_brand_id is null then
    raise exception 'Brand ca-global-hr not found — run 002_add_new_brands.sql first';
  end if;

  -- ── Clusters ─────────────────────────────────────────────────────────────

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Employer of Record (EOR) Services',
     'EOR solutions for international companies hiring in South Africa and Africa without a local entity',
     'employer of record south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_eor;
  if v_cluster_eor is null then
    select id into v_cluster_eor from clusters where brand_id = v_brand_id and primary_keyword = 'employer of record south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Professional Employer Organisation (PEO)',
     'PEO co-employment services and comparison guides for South African market',
     'peo south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_peo;
  if v_cluster_peo is null then
    select id into v_cluster_peo from clusters where brand_id = v_brand_id and primary_keyword = 'peo south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'HR Outsourcing Africa',
     'HR outsourcing, people management, and human resources services across Africa',
     'hr outsourcing south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_hr;
  if v_cluster_hr is null then
    select id into v_cluster_hr from clusters where brand_id = v_brand_id and primary_keyword = 'hr outsourcing south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Payroll Management South Africa',
     'Payroll outsourcing, PAYE, UIF, SDL compliance, and payroll bureau services',
     'payroll outsourcing south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_payroll;
  if v_cluster_payroll is null then
    select id into v_cluster_payroll from clusters where brand_id = v_brand_id and primary_keyword = 'payroll outsourcing south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'HR Compliance & Labour Law',
     'South African labour law, BCEA, LRA, employment equity, and compliance guides',
     'south africa labour law')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_law;
  if v_cluster_law is null then
    select id into v_cluster_law from clusters where brand_id = v_brand_id and primary_keyword = 'south africa labour law';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Workforce Expansion Africa',
     'Guides for international companies entering South Africa and hiring across Africa',
     'expand business to south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_expand;
  if v_cluster_expand is null then
    select id into v_cluster_expand from clusters where brand_id = v_brand_id and primary_keyword = 'expand business to south africa';
  end if;

  -- ── Keywords ──────────────────────────────────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent, priority_score, opportunity_rationale)
  values
    -- Employer of Record (EOR)
    (v_brand_id, v_cluster_eor, 'employer of record south africa',   1900, 38, 'C', 80, '1,900 monthly searches · moderate competition (KD 38) · commercial intent — core service keyword'),
    (v_brand_id, v_cluster_eor, 'what is an employer of record',      2400, 40, 'I', 76, '2,400 monthly searches · moderate competition (KD 40) · informational intent — top-of-funnel education'),
    (v_brand_id, v_cluster_eor, 'eor south africa',                   880,  32, 'C', 78, '880 monthly searches · moderate competition (KD 32) · commercial intent'),
    (v_brand_id, v_cluster_eor, 'employer of record services africa',  480,  30, 'C', 74, '480 monthly searches · moderate competition (KD 30) · commercial intent'),
    (v_brand_id, v_cluster_eor, 'hire employees in south africa',      720,  28, 'C', 75, '720 monthly searches · low competition (KD 28) · commercial intent'),
    (v_brand_id, v_cluster_eor, 'employer of record cape town',        260,  22, 'C', 70, '260 monthly searches · very low competition (KD 22) · commercial intent'),
    (v_brand_id, v_cluster_eor, 'eor services johannesburg',           170,  20, 'C', 67, '170 monthly searches · very low competition (KD 20) · commercial intent'),
    (v_brand_id, v_cluster_eor, 'employer of record africa',           590,  34, 'C', 73, '590 monthly searches · moderate competition (KD 34) · commercial intent'),

    -- Professional Employer Organisation (PEO)
    (v_brand_id, v_cluster_peo, 'peo south africa',                            720,  35, 'C', 74, '720 monthly searches · moderate competition (KD 35) · commercial intent'),
    (v_brand_id, v_cluster_peo, 'what is a peo',                              1600,  42, 'I', 72, '1,600 monthly searches · moderate competition (KD 42) · informational intent — top-of-funnel'),
    (v_brand_id, v_cluster_peo, 'professional employer organisation south africa', 480, 30, 'C', 73, '480 monthly searches · moderate competition (KD 30) · commercial intent'),
    (v_brand_id, v_cluster_peo, 'peo vs eor south africa',                    320,  28, 'I', 72, '320 monthly searches · low competition (KD 28) · informational intent — high intent comparison'),
    (v_brand_id, v_cluster_peo, 'peo services africa',                        210,  26, 'C', 70, '210 monthly searches · low competition (KD 26) · commercial intent'),
    (v_brand_id, v_cluster_peo, 'staffing solutions south africa',            1300,  34, 'C', 72, '1,300 monthly searches · moderate competition (KD 34) · commercial intent'),
    (v_brand_id, v_cluster_peo, 'co-employment south africa',                  170,  24, 'I', 65, '170 monthly searches · low competition (KD 24) · informational intent'),

    -- HR Outsourcing Africa
    (v_brand_id, v_cluster_hr, 'hr outsourcing south africa',          1300, 36, 'C', 76, '1,300 monthly searches · moderate competition (KD 36) · commercial intent'),
    (v_brand_id, v_cluster_hr, 'hr services south africa',              880,  32, 'C', 74, '880 monthly searches · moderate competition (KD 32) · commercial intent'),
    (v_brand_id, v_cluster_hr, 'outsource hr south africa',             590,  30, 'C', 72, '590 monthly searches · moderate competition (KD 30) · commercial intent'),
    (v_brand_id, v_cluster_hr, 'hr consulting south africa',            720,  34, 'C', 70, '720 monthly searches · moderate competition (KD 34) · commercial intent'),
    (v_brand_id, v_cluster_hr, 'human resources outsourcing africa',    390,  28, 'C', 70, '390 monthly searches · low competition (KD 28) · commercial intent'),
    (v_brand_id, v_cluster_hr, 'hr management services south africa',   480,  30, 'C', 69, '480 monthly searches · moderate competition (KD 30) · commercial intent'),
    (v_brand_id, v_cluster_hr, 'people management solutions africa',    210,  22, 'C', 65, '210 monthly searches · very low competition (KD 22) · commercial intent'),

    -- Payroll Management South Africa
    (v_brand_id, v_cluster_payroll, 'payroll outsourcing south africa',   1600, 38, 'C', 78, '1,600 monthly searches · moderate competition (KD 38) · commercial intent'),
    (v_brand_id, v_cluster_payroll, 'payroll management south africa',    1300, 36, 'C', 76, '1,300 monthly searches · moderate competition (KD 36) · commercial intent'),
    (v_brand_id, v_cluster_payroll, 'paye south africa',                  2400, 44, 'I', 70, '2,400 monthly searches · high competition (KD 44) · informational intent — large volume educational'),
    (v_brand_id, v_cluster_payroll, 'uif south africa',                   3200, 40, 'I', 72, '3,200 monthly searches · moderate competition (KD 40) · informational intent — large volume'),
    (v_brand_id, v_cluster_payroll, 'payroll services cape town',          590, 28, 'C', 72, '590 monthly searches · low competition (KD 28) · commercial intent'),
    (v_brand_id, v_cluster_payroll, 'payroll processing johannesburg',     480, 26, 'C', 70, '480 monthly searches · low competition (KD 26) · commercial intent'),
    (v_brand_id, v_cluster_payroll, 'payroll compliance south africa',     390, 30, 'I', 68, '390 monthly searches · moderate competition (KD 30) · informational intent'),
    (v_brand_id, v_cluster_payroll, 'payroll bureau south africa',         210, 24, 'C', 68, '210 monthly searches · low competition (KD 24) · commercial intent'),

    -- HR Compliance & Labour Law
    (v_brand_id, v_cluster_law, 'south africa labour law',              4400, 48, 'I', 72, '4,400 monthly searches · high competition (KD 48) · informational intent — authority-building content'),
    (v_brand_id, v_cluster_law, 'basic conditions of employment act',   2900, 44, 'I', 70, '2,900 monthly searches · high competition (KD 44) · informational intent'),
    (v_brand_id, v_cluster_law, 'employment equity south africa',       1900, 40, 'I', 68, '1,900 monthly searches · moderate competition (KD 40) · informational intent'),
    (v_brand_id, v_cluster_law, 'bcea compliance south africa',          720, 35, 'I', 66, '720 monthly searches · moderate competition (KD 35) · informational intent'),
    (v_brand_id, v_cluster_law, 'skills development levy south africa',  590, 30, 'I', 65, '590 monthly searches · moderate competition (KD 30) · informational intent'),
    (v_brand_id, v_cluster_law, 'labour law compliance south africa',    390, 35, 'I', 63, '390 monthly searches · moderate competition (KD 35) · informational intent'),
    (v_brand_id, v_cluster_law, 'south african employment compliance',   480, 32, 'I', 64, '480 monthly searches · moderate competition (KD 32) · informational intent'),

    -- Workforce Expansion Africa
    (v_brand_id, v_cluster_expand, 'set up business in south africa',        1300, 38, 'C', 75, '1,300 monthly searches · moderate competition (KD 38) · commercial intent'),
    (v_brand_id, v_cluster_expand, 'expand business to south africa',         880, 32, 'C', 75, '880 monthly searches · moderate competition (KD 32) · commercial intent'),
    (v_brand_id, v_cluster_expand, 'hire in africa without entity',           480, 26, 'C', 76, '480 monthly searches · low competition (KD 26) · commercial intent — core EOR value prop'),
    (v_brand_id, v_cluster_expand, 'remote hiring south africa',              480, 26, 'C', 74, '480 monthly searches · low competition (KD 26) · commercial intent'),
    (v_brand_id, v_cluster_expand, 'foreign company hiring south africa',     390, 28, 'C', 72, '390 monthly searches · low competition (KD 28) · commercial intent'),
    (v_brand_id, v_cluster_expand, 'international payroll africa',            320, 30, 'C', 70, '320 monthly searches · moderate competition (KD 30) · commercial intent'),
    (v_brand_id, v_cluster_expand, 'global workforce management africa',      210, 24, 'C', 66, '210 monthly searches · low competition (KD 24) · commercial intent')

  on conflict (brand_id, keyword) do nothing;

end $$;
