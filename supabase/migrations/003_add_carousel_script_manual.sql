-- Add source column to keywords to distinguish SEMrush-sourced vs manually-added topics
ALTER TABLE keywords
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'semrush'
    CHECK (source IN ('semrush', 'manual'));

-- Carousel slides per keyword (max 5 slides stored as JSONB array of {slide_number, text})
CREATE TABLE IF NOT EXISTS carousels (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id   uuid NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  slides       jsonb NOT NULL DEFAULT '[]',
  generated_at timestamptz DEFAULT now(),
  UNIQUE (keyword_id)
);

ALTER TABLE carousels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage carousels"
  ON carousels FOR ALL
  USING (auth.role() = 'authenticated');

-- 45-second talking-head video scripts per keyword
CREATE TABLE IF NOT EXISTS video_scripts (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id   uuid NOT NULL REFERENCES keywords(id) ON DELETE CASCADE,
  hook_line    text NOT NULL,
  script       text NOT NULL,
  generated_at timestamptz DEFAULT now(),
  UNIQUE (keyword_id)
);

ALTER TABLE video_scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage video_scripts"
  ON video_scripts FOR ALL
  USING (auth.role() = 'authenticated');
