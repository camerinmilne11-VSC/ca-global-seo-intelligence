'use client'

import type { Draft } from '@/types'

type Props = { draft: Draft }

export function DraftViewer({ draft }: Props) {
  return (
    <div className="space-y-6 text-sm">
      {draft.proposed_title && (
        <div className="mb-3">
          <span className="text-xs font-medium text-brand-neutral-dark uppercase tracking-wide">Proposed Title</span>
          <p className="text-lg font-semibold text-gray-900 mt-1">{draft.proposed_title}</p>
        </div>
      )}

      <div className="bg-brand-teal text-white rounded-lg p-4 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-teal-faint">SEO Title</p>
        <p className="font-semibold">{draft.seo_title}</p>
        <p className="text-xs text-white/70 mt-1">Meta: {draft.meta_description}</p>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">H1</h3>
        <p className="text-base font-medium">{draft.h1}</p>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">Opening Hook</h3>
        <p className="text-gray-700 italic border-l-2 border-brand-teal pl-3">{draft.intro_suggestion}</p>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-2">Article Structure</h3>
        <div className="space-y-2">
          {draft.h2_structure.map((h2, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-brand-teal text-white text-xs px-1.5 py-0.5 rounded mt-0.5 shrink-0">H2</span>
              <div>
                <p className="font-medium">{h2}</p>
                {draft.key_points[i] && (
                  <p className="text-brand-neutral-dark text-xs mt-0.5">↳ {draft.key_points[i]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-brand-teal mb-1">FAQ Section</h3>
        <div className="space-y-2">
          {draft.faq_section.map((faq, i) => (
            <div key={i} className="bg-brand-teal-faint rounded p-2 border border-brand-teal/20">
              <p className="font-medium text-xs">{faq.question}</p>
              <p className="text-brand-neutral-dark text-xs mt-0.5">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {draft.internal_links.length > 0 && (
        <div>
          <h3 className="font-semibold text-brand-teal mb-1">Internal Links</h3>
          <ul className="list-disc list-inside text-gray-700">
            {draft.internal_links.map((link, i) => <li key={i}>{link}</li>)}
          </ul>
        </div>
      )}

      <div className="bg-brand-teal-faint border border-brand-teal rounded-lg p-3">
        <h3 className="font-semibold text-brand-teal mb-1 text-xs uppercase tracking-wide">CTA</h3>
        <p className="font-medium">{draft.cta}</p>
      </div>
    </div>
  )
}
