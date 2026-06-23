'use client'

import { useState, useMemo } from 'react'
import { KeywordRow } from './KeywordRow'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { filterKeywords, sortKeywords } from '@/lib/component-utils'
import type { SortField } from '@/lib/component-utils'
import type { KeywordWithRelations, ContentStatus } from '@/types'

type Props = {
  keywords: KeywordWithRelations[]
  brand: string
  onRefresh?: () => void
}

export function KeywordTable({ keywords, brand, onRefresh }: Props) {
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all')
  const [sortField,    setSortField]    = useState<SortField>('priority_score')
  const [sortDir,      setSortDir]      = useState<'asc' | 'desc'>('desc')

  const filtered = useMemo(
    () => sortKeywords(filterKeywords(keywords, search, statusFilter), sortField, sortDir),
    [keywords, search, statusFilter, sortField, sortDir],
  )

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function SortHeader({ field, label }: { field: SortField; label: string }) {
    const active = sortField === field
    return (
      <th
        className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none transition-colors
          ${active ? 'text-brand-teal' : 'text-gray-500 hover:text-brand-neutral-dark'}`}
        onClick={() => toggleSort(field)}
      >
        {label}{active ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
      </th>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 items-center flex-wrap">
        <Input
          placeholder="Filter keywords…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs border-brand-teal focus:ring-brand-teal"
        />
        <Select
          value={statusFilter}
          onValueChange={v => setStatusFilter(v as ContentStatus | 'all')}
        >
          <SelectTrigger className="w-40 border-brand-teal">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="opportunity">Opportunity</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-brand-neutral-dark">{filtered.length} keywords</span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-neutral border-b border-gray-200">
            <tr>
              <SortHeader field="keyword"        label="Keyword" />
              <SortHeader field="priority_score" label="Score" />
              <SortHeader field="volume"         label="Volume" />
              <SortHeader field="difficulty"     label="KD" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Intent
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
            {filtered.map(kw => (
              <KeywordRow
                key={kw.id}
                keyword={kw}
                brand={brand}
                onBriefGenerated={onRefresh}
                onDraftGenerated={onRefresh}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-neutral-dark">
                  No keywords found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
