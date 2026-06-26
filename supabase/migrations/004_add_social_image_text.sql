-- Migration: 004_add_social_image_text.sql
-- Adds image_text column to socials table.
-- image_text is the short overlay phrase that goes on the graphic image
-- (distinct from the caption body and hashtags).
-- HOW TO APPLY: Supabase Dashboard → SQL Editor → paste and run.

alter table socials add column if not exists image_text text;
