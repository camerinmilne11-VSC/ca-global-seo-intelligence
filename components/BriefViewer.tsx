'use client'

import type { Brief } from '@/types'

type Props = { brief: Brief }

export function BriefViewer({ brief }: Props) {
  return (
    <div className="space-y-6 text-sm">
      <div>
        <h3 className="font-semibold text-brand-teal mb-1">Recommended Title</h3>
        <p className="text-lg font-medium">{brief.recommended_title}</p>
        {brief.alt_titles.length > 0 && (
          <ul className="mt-1 list-disc list-inside text-gray-500 text-xs">
            {brief.alt_titles.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">Search Intent Analysis</h3>
        <p className="text-gray-700">{brief.intent_analysis}</p>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">Content Angle</h3>
        <p className="text-gray-700">{brief.content_angle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-brand-teal mb-1">Primary Keyword</h3>
          <span className="bg-brand-teal text-white px-2 py-0.5 rounded text-xs">{brief.primary_keyword}</span>
        </div>
        <div>
          <h3 className="font-semibold text-brand-teal mb-1">Target Length</h3>
          <span>{brief.article_length_words.toLocaleString()} words</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">Secondary Keywords</h3>
        <div className="flex flex-wrap gap-1">
          {brief.secondary_keywords.map((kw, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{kw}</span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-2">Heading Structure</h3>
        <div className="bg-brand-teal-faint rounded p-3 space-y-1">
          <p className="font-medium">H1: {brief.heading_structure.h1}</p>
          {brief.heading_structure.h2s.map((h2, i) => (
            <div key={i} className="ml-4">
              <p className="text-gray-700">H2: {h2.heading}</p>
              {h2.h3s?.map((h3, j) => (
                <p key={j} className="ml-4 text-brand-neutral-dark text-xs">H3: {h3}</p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">FAQs ({brief.faqs.length})</h3>
        <div className="space-y-2">
          {brief.faqs.map((faq, i) => (
            <div key={i} className="bg-brand-teal-faint rounded p-2 border border-brand-teal/20">
              <p className="font-medium text-xs">{faq.question}</p>
              <p className="text-brand-neutral-dark text-xs mt-0.5">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {brief.internal_links.length > 0 && (
        <div>
          <h3 className="font-semibold text-brand-teal mb-1">Internal Links</h3>
          <ul className="list-disc list-inside text-gray-700">
            {brief.internal_links.map((link, i) => <li key={i}>{link}</li>)}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">CTAs</h3>
        <ul className="list-disc list-inside text-gray-700">
          {brief.ctas.map((cta, i) => <li key={i}>{cta}</li>)}
        </ul>
      </div>
    </div>
  )
}
