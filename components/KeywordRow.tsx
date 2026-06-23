'use client'

import { useState } from 'react'
import { OpportunityScore } from './OpportunityScore'
import { Button } from '@/components/ui/button'
import { getStatusColor, getIntentLabel, formatStatusLabel } from '@/lib/component-utils'
import type { KeywordWithRelations, ContentStatus } from '@/types'

type Props = {
  keyword: KeywordWithRelations
  brand: string
  onBriefGenerated?: () => void
  onDraftGenerated?: () => void
}

export function KeywordRow({ keyword, brand, onBriefGenerated, onDraftGenerated }: Props) {
  const [briefLoading,  setBriefLoading]  = useState(false)
  const [draftLoading,  setDraftLoading]  = useState(false)
  const [status,        setStatus]        = useState<ContentStatus>(keyword.content_status)
  const [actionError,   setActionError]   = useState<string | null>(null)
  const [briefReady,    setBriefReady]    = useState(!!keyword.brief)
  const [draftReady,    setDraftReady]    = useState(!!keyword.draft)

  async function generateBrief() {
    setBriefLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id }),
      })
      if (!res.ok) throw new Error('Brief generation failed')
      await res.json()
      setBriefReady(true)
      onBriefGenerated?.()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Brief generation failed')
    } finally {
      setBriefLoading(false)
    }
  }

  async function generateDraft() {
    setDraftLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id }),
      })
      if (!res.ok) throw new Error('Draft generation failed')
      await res.json()
      setDraftReady(true)
      onDraftGenerated?.()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Draft generation failed')
    } finally {
      setDraftLoading(false)
    }
  }

  async function updateStatus(newStatus: ContentStatus) {
    const previousStatus = status
    setStatus(newStatus)
    try {
      const res = await fetch('/api/keywords/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id, status: newStatus }),
      })
      if (!res.ok) {
        setStatus(previousStatus)
      }
    } catch {
      setStatus(previousStatus)
    }
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
            {briefLoading ? 'Generating…' : briefReady ? '↻ Brief' : '+ Brief'}
          </Button>
          {briefReady && !briefLoading && (
            <a
              href={`/${brand}/briefs`}
              className="text-xs h-7 flex items-center px-2 text-brand-teal underline underline-offset-2 hover:text-brand-teal-dark"
            >
              View Brief
            </a>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={generateDraft}
            disabled={draftLoading}
            className="text-xs h-7 border-brand-teal hover:bg-brand-teal-faint"
          >
            {draftLoading ? 'Generating…' : draftReady ? '↻ Draft' : '+ Draft'}
          </Button>
          {draftReady && !draftLoading && (
            <a
              href={`/${brand}/drafts`}
              className="text-xs h-7 flex items-center px-2 text-brand-teal underline underline-offset-2 hover:text-brand-teal-dark"
            >
              View Draft
            </a>
          )}
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
              Publish
            </Button>
          )}
        </div>
        {actionError && (
          <div className="mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
            {actionError}
          </div>
        )}
      </td>
    </tr>
  )
}
