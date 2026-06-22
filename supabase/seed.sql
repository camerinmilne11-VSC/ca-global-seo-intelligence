-- =============================================================================
-- Seed: seed.sql
-- Project: SEO Content & Keyword Intelligence System — CA Global
-- =============================================================================
-- HOW TO APPLY:
--   After running 001_initial_schema.sql in the Supabase SQL Editor,
--   paste and run this file to seed the 3 brand rows.
-- =============================================================================

insert into brands (name, domain, slug, brand_color) values
  ('CA Global',  'caglobalint.com', 'ca-global',  '#0d2137'),
  ('CA Mining',  'camining.com',    'ca-mining',  '#0d2137'),
  ('CA Finance', 'ca-finance.com',  'ca-finance', '#0d2137')
on conflict (slug) do nothing;
