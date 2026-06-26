export type ContentSource = 'semrush' | 'manual'

export type Brand = {
  id: string
  name: string
  domain: string
  slug: 'ca-global' | 'ca-mining' | 'ca-finance' | 'vogue-hygiene' | 'ca-global-hr'
  brand_color: string
  created_at: string
}

export type Cluster = {
  id: string
  brand_id: string
  pillar_name: string
  description: string
  primary_keyword: string
  created_at: string
}

export type ContentStatus = 'opportunity' | 'in_progress' | 'published' | 'paused'
export type SearchIntent  = 'I' | 'N' | 'C' | 'T'

export type Keyword = {
  id: string
  brand_id: string
  keyword: string
  cluster_id: string | null
  volume: number
  difficulty: number
  search_intent: SearchIntent
  opportunity_rationale: string
  priority_score: number
  content_status: ContentStatus
  source: ContentSource
  publication_url: string | null
  last_synced: string
  created_at: string
}

export type CarouselSlide = { slide_number: number; text: string }

export type Carousel = {
  id: string
  keyword_id: string
  slides: CarouselSlide[]
  generated_at: string
}

export type VideoScript = {
  id: string
  keyword_id: string
  hook_line: string
  script: string
  generated_at: string
}

export type KeywordWithRelations = Keyword & {
  brand?: Brand
  cluster?: Cluster
  brief?: Brief | null
  draft?: Draft | null
  social?: Social | null
  carousel?: Carousel | null
  video_script?: VideoScript | null
}

export type FaqItem = { question: string; answer: string }

export type HeadingStructure = {
  h1: string
  h2s: Array<{ heading: string; h3s?: string[] }>
}

export type Brief = {
  id: string
  keyword_id: string
  recommended_title: string
  alt_titles: string[]
  intent_analysis: string
  primary_keyword: string
  secondary_keywords: string[]
  related_queries: string[]
  faqs: FaqItem[]
  internal_links: string[]
  ctas: string[]
  article_length_words: number
  heading_structure: HeadingStructure
  content_angle: string
  generated_at: string
}

export type Draft = {
  id: string
  keyword_id: string
  seo_title: string
  meta_description: string
  content: string
  // legacy fields kept for DB compatibility
  proposed_title?: string
  h1?: string
  h2_structure?: string[]
  intro_suggestion?: string
  key_points?: string[]
  faq_section?: FaqItem[]
  internal_links?: string[]
  cta?: string
  generated_at: string
}

export type Social = {
  id: string
  keyword_id: string
  caption: string
  hashtags: string[]
  generated_at: string
}

export type Competitor = {
  id: string
  brand_id: string
  competitor_domain: string
  gap_keywords: string[]
  tracked_since: string
}

export type SemrushKeyword = {
  keyword: string
  volume: number
  difficulty: number
  cpc: number
  intent: SearchIntent
}

export type PriorityScoreInput = {
  keyword: string
  volume: number
  difficulty: number
  cpc: number
  intent: SearchIntent
  hasContentGap: boolean
}
