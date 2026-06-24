-- =============================================================================
-- Migration: 002_add_new_brands.sql
-- Adds Vogue Hygiene and CA Global HR to the brands table.
-- HOW TO APPLY:
--   Supabase Dashboard → SQL Editor → paste and run this file.
--   Run AFTER 001_initial_schema.sql has already been applied.
-- =============================================================================

-- Widen the slug check constraint to include the two new brands
alter table brands drop constraint brands_slug_check;
alter table brands add constraint brands_slug_check
  check (slug in ('ca-global','ca-mining','ca-finance','vogue-hygiene','ca-global-hr'));

-- Insert new brands (idempotent — safe to run more than once)
insert into brands (name, domain, slug, brand_color) values
  ('Vogue Hygiene', 'vogue-hygiene.co.za', 'vogue-hygiene', '#1a6b3a'),
  ('CA Global HR',  'caglobalhr.com',      'ca-global-hr',  '#0d2137')
on conflict (slug) do nothing;
