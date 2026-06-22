'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { buildSyncUrl, parseSyncResponse } from '@/lib/component-utils'

type Props = { brand: string; onSynced?: (count: number) => void }

export function SyncButton({ brand, onSynced }: Props) {
  const [loading, setLoading] = useState(false)
  const [last, setLast]       = useState<string | null>(null)

  async function handleSync() {
    setLoading(true)
    try {
      const res  = await fetch(buildSyncUrl(brand), { method: 'POST' })
      const json = await res.json()
      if (res.ok) {
        const msg = parseSyncResponse(json, true)
        setLast(msg)
        onSynced?.(json.synced as number)
      } else {
        setLast(parseSyncResponse(json, false))
      }
    } catch {
      setLast('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleSync}
        disabled={loading}
        variant="outline"
        size="sm"
        className="border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Syncing…' : 'Sync SEMrush'}
      </Button>
      {last && <span className="text-xs text-gray-500">{last}</span>}
    </div>
  )
}
