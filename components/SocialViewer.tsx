'use client'

import type { Social } from '@/types'

type Props = { social: Social }

export function SocialViewer({ social }: Props) {
  return (
    <div className="space-y-4 text-sm">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <p className="text-xs font-semibold text-brand-teal uppercase tracking-wide mb-3">Caption</p>
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{social.caption}</p>
      </div>
      {social.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {social.hashtags.map((tag, i) => (
            <span key={i} className="text-xs bg-brand-teal-faint text-brand-teal px-2 py-1 rounded-full font-medium">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
