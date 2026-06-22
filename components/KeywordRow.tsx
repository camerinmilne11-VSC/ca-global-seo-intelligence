'use client'

import { useState } from 'react'
import { OpportunityScore } from './OpportunityScore'
import { Button } from '@/components/ui/button'
import { getStatusColor, getIntentLabel, formatStatusLabel } from '@/lib/component-utils'
import type { KeywordWithRelations, ContentStatus } from '@/types'

type Props = {
  keyword: KeywordWithRelations
  onBriefGenerated?: () => void
  onDraftGenerated?: () => void
}

export function KeywordRow({ keyword, onBriefGenerated, onDraftGenerated }: Props) {
  const [briefLoading, setBriefLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)
  const [status, setStatus]             = useState<ContentStatus>(keyword.content_status)

  async function generateBrief() {
    setBriefLoading(true)
    await fetch('/api/ai/brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywordId: keyword.id }),
    })
    setBriefLoading(false)
    onBriefGenerated?.()
  }

  async function generateDraft() {
    setDraftLoading(true)
    await fetch('/api/ai/draft', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywordId: keyword.id }),
    })
    setDraftLoading(false)
    onDraftGenerated?.()
  }

  async function updateStatus(newStatus: ContentStatus) {
    setStatus(newStatus)
    await fetch('/api/keywords/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keywordId: keyword.id, status: newStatus }),
    })
  }

  return (
    <tr className="border-b border-gray-100 hover:bg-brand-teal-faint transition-colors">
      <td className="px-4 py-3 font-medium text-brand-neutral-dark text-sm">{keyword.keyword}</td>
      <td className="px-4 py-3 text-sm text-center">
        <OpportunityScore score={keyword.priority_score} />
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 text-center">
        {keyword.volume.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 text-center">{keyword.difficulty}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {getIntentLabel(keyword.search_intent)}
      </td>
      <td className="px-4 py-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(status)}`}>
          {formatStatusLabel(status)}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={generateBrief}
            disabled={briefLoading}
            className="text-xs h-7 border-brand-teal hover:bg-brand-teal-faint"
          >
            {briefLoading ? '…' : keyword.brief ? '↻ Brief' : '+ Brief'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={generateDraft}
            disabled={draftLoading}
            className="text-xs h-7 border-brand-teal hover:bg-brand-teal-faint"
          >
            {draftLoading ? '…' : keyword.draft ? '↻ Draft' : '+ Draft'}
          </Button>
          {status === 'opportunity' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateStatus('in_progress')}
              className="text-xs h-7 hover:bg-brand-teal-faint"
            >
              Claim
            </Button>
          )}
          {status === 'in_progress' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateStatus('published')}
              className="text-xs h-7 hover:bg-brand-teal-faint"
            >
              Publish ✓
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
