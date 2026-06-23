'use client'

import type { Draft } from '@/types'

function ArticleRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold text-brand-teal-dark mt-5 mb-2">{line.slice(4)}</h3>)
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-lg font-bold text-brand-teal-dark mt-7 mb-3 pb-1 border-b border-gray-100">{line.slice(3)}</h2>)
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold text-brand-teal-dark mb-4">{line.slice(2)}</h1>)
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={i} className="font-semibold text-gray-800 mb-2">{line.slice(2, -2)}</p>)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(<li key={i} className="ml-5 list-disc text-gray-700 leading-relaxed mb-1">{line.slice(2)}</li>)
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />)
    } else {
      elements.push(<p key={i} className="text-gray-700 leading-relaxed mb-3">{line}</p>)
    }
    i++
  }

  return <div className="font-sans">{elements}</div>
}

type Props = { draft: Draft }

export function DraftViewer({ draft }: Props) {
  return (
    <div className="space-y-4 text-sm">
      <div className="bg-brand-teal text-white rounded-lg p-4 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-white/70">SEO Title</p>
        <p className="font-semibold">{draft.seo_title}</p>
        <p className="text-xs text-white/70 mt-1 border-t border-white/20 pt-1">
          Meta: {draft.meta_description}
        </p>
      </div>

      {draft.content ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <ArticleRenderer content={draft.content} />
        </div>
      ) : (
        <p className="text-gray-400 italic">No article content — regenerate the draft.</p>
      )}
    </div>
  )
}
