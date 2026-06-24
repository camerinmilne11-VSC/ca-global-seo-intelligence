-- =============================================================================
-- Seed: Vogue Hygiene keywords
-- Run AFTER 002_add_new_brands.sql
-- Supabase Dashboard → SQL Editor → paste and run
-- =============================================================================

do $$
declare
  v_brand_id uuid;
  v_cluster_commercial    uuid;
  v_cluster_industrial    uuid;
  v_cluster_hygiene       uuid;
  v_cluster_eco           uuid;
  v_cluster_event         uuid;
  v_cluster_geo           uuid;
begin
  select id into v_brand_id from brands where slug = 'vogue-hygiene';
  if v_brand_id is null then
    raise exception 'Brand vogue-hygiene not found — run 002_add_new_brands.sql first';
  end if;

  -- ── Clusters ─────────────────────────────────────────────────────────────

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Commercial Cleaning Services',
     'Corporate and office cleaning for businesses across South Africa',
     'commercial cleaning services south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_commercial;
  if v_cluster_commercial is null then
    select id into v_cluster_commercial from clusters where brand_id = v_brand_id and primary_keyword = 'commercial cleaning services south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Industrial & Factory Cleaning',
     'Heavy-duty cleaning for factories, warehouses, and manufacturing plants',
     'industrial cleaning services south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_industrial;
  if v_cluster_industrial is null then
    select id into v_cluster_industrial from clusters where brand_id = v_brand_id and primary_keyword = 'industrial cleaning services south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Hygiene & Sanitation Solutions',
     'Workplace sanitation, bathroom hygiene, and waste disposal services',
     'hygiene services south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_hygiene;
  if v_cluster_hygiene is null then
    select id into v_cluster_hygiene from clusters where brand_id = v_brand_id and primary_keyword = 'hygiene services south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Eco-Friendly & Sustainable Cleaning',
     'Green, biodegradable, and environmentally responsible cleaning solutions',
     'eco friendly cleaning services south africa')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_eco;
  if v_cluster_eco is null then
    select id into v_cluster_eco from clusters where brand_id = v_brand_id and primary_keyword = 'eco friendly cleaning services south africa';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Event & Specialised Cleaning',
     'Pre- and post-event cleaning, deep cleaning, and specialist one-off services',
     'event cleaning services cape town')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_event;
  if v_cluster_event is null then
    select id into v_cluster_event from clusters where brand_id = v_brand_id and primary_keyword = 'event cleaning services cape town';
  end if;

  insert into clusters (brand_id, pillar_name, description, primary_keyword) values
    (v_brand_id, 'Cape Town & Gauteng Cleaning',
     'Location-targeted cleaning content for Cape Town and Gauteng markets',
     'cleaning company cape town')
  on conflict (brand_id, primary_keyword) do nothing
  returning id into v_cluster_geo;
  if v_cluster_geo is null then
    select id into v_cluster_geo from clusters where brand_id = v_brand_id and primary_keyword = 'cleaning company cape town';
  end if;

  -- ── Keywords ──────────────────────────────────────────────────────────────

  insert into keywords (brand_id, cluster_id, keyword, volume, difficulty, search_intent, priority_score, opportunity_rationale)
  values
    -- Commercial Cleaning Services
    (v_brand_id, v_cluster_commercial, 'commercial cleaning services south africa', 1300, 25, 'C', 78, '1,300 monthly searches · low competition (KD 25) · commercial intent'),
    (v_brand_id, v_cluster_commercial, 'commercial cleaning company cape town',      880,  22, 'C', 75, '880 monthly searches · very low competition (KD 22) · commercial intent'),
    (v_brand_id, v_cluster_commercial, 'commercial cleaners johannesburg',            720,  20, 'C', 73, '720 monthly searches · very low competition (KD 20) · commercial intent'),
    (v_brand_id, v_cluster_commercial, 'office cleaning services cape town',          590,  18, 'C', 71, '590 monthly searches · very low competition (KD 18) · commercial intent'),
    (v_brand_id, v_cluster_commercial, 'commercial cleaning companies pretoria',      480,  19, 'C', 68, '480 monthly searches · very low competition (KD 19) · commercial intent'),
    (v_brand_id, v_cluster_commercial, 'professional cleaning services south africa', 390,  24, 'C', 65, '390 monthly searches · low competition (KD 24) · commercial intent'),
    (v_brand_id, v_cluster_commercial, 'commercial cleaning quote south africa',      260,  15, 'T', 72, '260 monthly searches · very low competition (KD 15) · transactional intent — high conversion signal'),
    (v_brand_id, v_cluster_commercial, 'outsource cleaning services south africa',    210,  17, 'C', 67, '210 monthly searches · very low competition (KD 17) · commercial intent'),

    -- Industrial & Factory Cleaning
    (v_brand_id, v_cluster_industrial, 'industrial cleaning services south africa',   880,  28, 'C', 72, '880 monthly searches · low competition (KD 28) · commercial intent'),
    (v_brand_id, v_cluster_industrial, 'factory cleaning services cape town',         480,  22, 'C', 68, '480 monthly searches · very low competition (KD 22) · commercial intent'),
    (v_brand_id, v_cluster_industrial, 'industrial cleaners johannesburg',             390,  20, 'C', 66, '390 monthly searches · very low competition (KD 20) · commercial intent'),
    (v_brand_id, v_cluster_industrial, 'warehouse cleaning services south africa',    320,  19, 'C', 64, '320 monthly searches · very low competition (KD 19) · commercial intent'),
    (v_brand_id, v_cluster_industrial, 'manufacturing plant cleaning south africa',   210,  24, 'C', 60, '210 monthly searches · low competition (KD 24) · commercial intent'),
    (v_brand_id, v_cluster_industrial, 'industrial hygiene south africa',             170,  30, 'I', 55, '170 monthly searches · moderate competition (KD 30) · informational intent'),
    (v_brand_id, v_cluster_industrial, 'heavy industrial cleaning contractors',       140,  26, 'C', 58, '140 monthly searches · low competition (KD 26) · commercial intent'),

    -- Hygiene & Sanitation Solutions
    (v_brand_id, v_cluster_hygiene, 'hygiene services south africa',              720,  22, 'C', 72, '720 monthly searches · very low competition (KD 22) · commercial intent'),
    (v_brand_id, v_cluster_hygiene, 'sanitation services cape town',             480,  20, 'C', 68, '480 monthly searches · very low competition (KD 20) · commercial intent'),
    (v_brand_id, v_cluster_hygiene, 'bathroom sanitation services south africa', 320,  18, 'C', 66, '320 monthly searches · very low competition (KD 18) · commercial intent'),
    (v_brand_id, v_cluster_hygiene, 'workplace hygiene solutions',               260,  24, 'I', 60, '260 monthly searches · low competition (KD 24) · informational intent'),
    (v_brand_id, v_cluster_hygiene, 'waste disposal services cape town',         390,  19, 'C', 67, '390 monthly searches · very low competition (KD 19) · commercial intent'),
    (v_brand_id, v_cluster_hygiene, 'sanitisation services johannesburg',        170,  22, 'C', 60, '170 monthly searches · very low competition (KD 22) · commercial intent'),
    (v_brand_id, v_cluster_hygiene, 'hand hygiene products south africa',        210,  32, 'C', 57, '210 monthly searches · moderate competition (KD 32) · commercial intent'),

    -- Eco-Friendly & Sustainable Cleaning
    (v_brand_id, v_cluster_eco, 'eco friendly cleaning services south africa',     480, 18, 'C', 72, '480 monthly searches · very low competition (KD 18) · commercial intent — growing ESG demand'),
    (v_brand_id, v_cluster_eco, 'green cleaning services cape town',               260, 15, 'C', 70, '260 monthly searches · very low competition (KD 15) · commercial intent'),
    (v_brand_id, v_cluster_eco, 'environmentally friendly cleaners south africa',  210, 16, 'C', 68, '210 monthly searches · very low competition (KD 16) · commercial intent'),
    (v_brand_id, v_cluster_eco, 'sustainable cleaning solutions',                  170, 20, 'I', 62, '170 monthly searches · very low competition (KD 20) · informational intent'),
    (v_brand_id, v_cluster_eco, 'biodegradable cleaning products south africa',    140, 22, 'C', 62, '140 monthly searches · very low competition (KD 22) · commercial intent'),
    (v_brand_id, v_cluster_eco, 'non toxic cleaning services',                     110, 18, 'I', 60, '110 monthly searches · very low competition (KD 18) · informational intent'),

    -- Event & Specialised Cleaning
    (v_brand_id, v_cluster_event, 'event cleaning services cape town',         390, 16, 'C', 74, '390 monthly searches · very low competition (KD 16) · commercial intent'),
    (v_brand_id, v_cluster_event, 'deep cleaning services south africa',        590, 21, 'C', 70, '590 monthly searches · very low competition (KD 21) · commercial intent'),
    (v_brand_id, v_cluster_event, 'post construction cleaning south africa',    320, 19, 'C', 66, '320 monthly searches · very low competition (KD 19) · commercial intent'),
    (v_brand_id, v_cluster_event, 'carpet cleaning services cape town',         880, 25, 'C', 68, '880 monthly searches · low competition (KD 25) · commercial intent'),
    (v_brand_id, v_cluster_event, 'window cleaning services johannesburg',      390, 18, 'C', 65, '390 monthly searches · very low competition (KD 18) · commercial intent'),
    (v_brand_id, v_cluster_event, 'post event cleaning johannesburg',           170, 15, 'C', 68, '170 monthly searches · very low competition (KD 15) · commercial intent'),

    -- Cape Town & Gauteng Cleaning
    (v_brand_id, v_cluster_geo, 'cleaning company cape town',       1600, 28, 'C', 76, '1,600 monthly searches · low competition (KD 28) · commercial intent'),
    (v_brand_id, v_cluster_geo, 'cleaning services johannesburg',   1300, 26, 'C', 74, '1,300 monthly searches · low competition (KD 26) · commercial intent'),
    (v_brand_id, v_cluster_geo, 'cleaning company gauteng',          720, 24, 'C', 70, '720 monthly searches · low competition (KD 24) · commercial intent'),
    (v_brand_id, v_cluster_geo, 'cleaning services western cape',    480, 20, 'C', 67, '480 monthly searches · very low competition (KD 20) · commercial intent'),
    (v_brand_id, v_cluster_geo, 'office cleaners cape town',         390, 18, 'C', 66, '390 monthly searches · very low competition (KD 18) · commercial intent'),
    (v_brand_id, v_cluster_geo, 'building cleaning services cape town', 260, 19, 'C', 63, '260 monthly searches · very low competition (KD 19) · commercial intent'),
    (v_brand_id, v_cluster_geo, 'domestic cleaning services cape town', 880, 22, 'C', 68, '880 monthly searches · very low competition (KD 22) · commercial intent')

  on conflict (brand_id, keyword) do nothing;

end $$;
