'use client'

import { useState } from 'react'
import { OpportunityScore } from './OpportunityScore'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getStatusColor, getIntentLabel } from '@/lib/component-utils'
import type { KeywordWithRelations, ContentStatus } from '@/types'

const CAROUSEL_EXCLUDED_BRANDS = new Set(['vogue-hygiene'])

type Props = {
  keyword: KeywordWithRelations
  brand: string
  compact?: boolean
  onBriefGenerated?: () => void
  onDraftGenerated?: () => void
}

export function KeywordRow({ keyword, brand, compact = false, onBriefGenerated, onDraftGenerated }: Props) {
  const [briefLoading,    setBriefLoading]    = useState(false)
  const [draftLoading,    setDraftLoading]    = useState(false)
  const [socialLoading,   setSocialLoading]   = useState(false)
  const [carouselLoading, setCarouselLoading] = useState(false)
  const [scriptLoading,   setScriptLoading]   = useState(false)
  const [resetLoading,    setResetLoading]    = useState(false)
  const [status,          setStatus]          = useState<ContentStatus>(keyword.content_status)
  const [actionError,     setActionError]     = useState<string | null>(null)
  const [briefReady,      setBriefReady]      = useState(!!keyword.brief)
  const [draftReady,      setDraftReady]      = useState(!!keyword.draft)
  const [socialReady,     setSocialReady]     = useState(!!keyword.social)
  const [carouselReady,   setCarouselReady]   = useState(!!keyword.carousel)
  const [scriptReady,     setScriptReady]     = useState(!!keyword.video_script)

  const showCarouselScript = !CAROUSEL_EXCLUDED_BRANDS.has(brand)

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

  async function generateSocial() {
    setSocialLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/ai/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id }),
      })
      if (!res.ok) throw new Error('Social generation failed')
      await res.json()
      setSocialReady(true)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Social generation failed')
    } finally {
      setSocialLoading(false)
    }
  }

  async function generateCarousel() {
    setCarouselLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/ai/carousel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Carousel generation failed')
      }
      setCarouselReady(true)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Carousel generation failed')
    } finally {
      setCarouselLoading(false)
    }
  }

  async function generateScript() {
    setScriptLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/ai/script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Script generation failed')
      }
      setScriptReady(true)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Script generation failed')
    } finally {
      setScriptLoading(false)
    }
  }

  async function resetContent() {
    setResetLoading(true)
    setActionError(null)
    try {
      const res = await fetch('/api/keywords/reset', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywordId: keyword.id }),
      })
      if (!res.ok) throw new Error('Reset failed')
      setBriefReady(false)
      setDraftReady(false)
      setSocialReady(false)
      setCarouselReady(false)
      setScriptReady(false)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Reset failed')
    } finally {
      setResetLoading(false)
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
      {!compact && (
        <>
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
        </>
      )}
      <td className="px-4 py-3">
        <Select value={status} onValueChange={(v) => updateStatus(v as ContentStatus)}>
          <SelectTrigger className={`text-xs h-7 w-32 border-0 px-2 py-0.5 rounded-full font-medium ${getStatusColor(status)}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opportunity">Opportunity</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
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
          <Button
            size="sm"
            variant="outline"
            onClick={generateSocial}
            disabled={socialLoading}
            className="text-xs h-7 border-brand-teal hover:bg-brand-teal-faint"
          >
            {socialLoading ? 'Generating…' : socialReady ? '↻ Social' : '+ Social'}
          </Button>
          {socialReady && !socialLoading && (
            <a
              href={`/${brand}/socials`}
              className="text-xs h-7 flex items-center px-2 text-brand-teal underline underline-offset-2 hover:text-brand-teal-dark"
            >
              View Post
            </a>
          )}
          {showCarouselScript && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={generateCarousel}
                disabled={carouselLoading || !draftReady}
                title={!draftReady ? 'Generate a draft first' : undefined}
                className="text-xs h-7 border-brand-teal hover:bg-brand-teal-faint disabled:opacity-40"
              >
                {carouselLoading ? 'Generating…' : carouselReady ? '↻ Carousel' : '+ Carousel'}
              </Button>
              {carouselReady && !carouselLoading && (
                <a
                  href={`/${brand}/carousels`}
                  className="text-xs h-7 flex items-center px-2 text-brand-teal underline underline-offset-2 hover:text-brand-teal-dark"
                >
                  View Slides
                </a>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={generateScript}
                disabled={scriptLoading || !draftReady}
                title={!draftReady ? 'Generate a draft first' : undefined}
                className="text-xs h-7 border-brand-teal hover:bg-brand-teal-faint disabled:opacity-40"
              >
                {scriptLoading ? 'Generating…' : scriptReady ? '↻ Script' : '+ Script'}
              </Button>
              {scriptReady && !scriptLoading && (
                <a
                  href={`/${brand}/scripts`}
                  className="text-xs h-7 flex items-center px-2 text-brand-teal underline underline-offset-2 hover:text-brand-teal-dark"
                >
                  View Script
                </a>
              )}
            </>
          )}
          {(briefReady || draftReady || socialReady || carouselReady || scriptReady) && (
            <Button
              size="sm"
              variant="ghost"
              onClick={resetContent}
              disabled={resetLoading}
              className="text-xs h-7 text-gray-400 hover:text-red-500 hover:bg-red-50 ml-1"
            >
              {resetLoading ? '…' : 'Reset'}
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
