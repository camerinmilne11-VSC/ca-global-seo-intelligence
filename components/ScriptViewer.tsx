'use client'

import type { VideoScript } from '@/types'

type Props = { script: VideoScript }

export function ScriptViewer({ script }: Props) {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-brand-teal pl-4 py-1">
        <p className="text-xs font-semibold text-brand-teal uppercase tracking-wide mb-1">
          Hook — first 7 seconds
        </p>
        <p className="text-sm font-medium text-brand-neutral-dark">{script.hook_line}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Full 45-second script
        </p>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-brand-neutral-dark leading-relaxed whitespace-pre-line">
          {script.script}
        </div>
      </div>
      <p className="text-xs text-gray-400">Approx. 45 seconds at a natural speaking pace</p>
    </div>
  )
}
