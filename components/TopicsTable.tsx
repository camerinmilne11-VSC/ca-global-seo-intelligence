'use client'

import { useState } from 'react'
import { KeywordRow } from './KeywordRow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { KeywordWithRelations } from '@/types'

type Props = {
  topics: KeywordWithRelations[]
  brand: string
}

export function TopicsTable({ topics: initialTopics, brand }: Props) {
  const [topics,      setTopics]      = useState<KeywordWithRelations[]>(initialTopics)
  const [showForm,    setShowForm]    = useState(false)
  const [topicInput,  setTopicInput]  = useState('')
  const [adding,      setAdding]      = useState(false)
  const [addError,    setAddError]    = useState<string | null>(null)

  async function addTopic(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = topicInput.trim()
    if (!trimmed) return

    setAdding(true)
    setAddError(null)
    try {
      const res = await fetch('/api/keywords/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmed, brandSlug: brand }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? 'Failed to add topic')
      }
      const newTopic = await res.json() as KeywordWithRelations
      setTopics(prev => [newTopic, ...prev])
      setTopicInput('')
      setShowForm(false)
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add topic')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add topic form */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        {!showForm ? (
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="bg-brand-teal hover:bg-brand-teal-dark text-white text-xs h-8"
          >
            + Add Topic
          </Button>
        ) : (
          <form onSubmit={addTopic} className="flex gap-2 items-start flex-wrap">
            <Input
              autoFocus
              placeholder="e.g. How to hire engineers in Nigeria"
              value={topicInput}
              onChange={e => setTopicInput(e.target.value)}
              className="max-w-sm border-brand-teal focus:ring-brand-teal text-sm h-8"
            />
            <Button
              type="submit"
              size="sm"
              disabled={adding || !topicInput.trim()}
              className="bg-brand-teal hover:bg-brand-teal-dark text-white text-xs h-8"
            >
              {adding ? 'Adding…' : 'Add'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => { setShowForm(false); setTopicInput(''); setAddError(null) }}
              className="text-xs h-8 text-gray-400 hover:text-gray-600"
            >
              Cancel
            </Button>
            {addError && (
              <p className="w-full text-xs text-red-600 mt-1">{addError}</p>
            )}
          </form>
        )}
      </div>

      {/* Topics table */}
      {topics.length > 0 ? (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-neutral border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Topic
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {topics.map(topic => (
                <KeywordRow
                  key={topic.id}
                  keyword={topic}
                  brand={brand}
                  compact
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12 border border-dashed border-gray-200 rounded-lg">
          No manual topics yet. Click &quot;+ Add Topic&quot; to add your first inspiration.
        </p>
      )}
    </div>
  )
}
