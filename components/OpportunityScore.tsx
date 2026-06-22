import { cn } from '@/lib/utils'
import { getScoreColor } from '@/lib/component-utils'

type Props = { score: number; size?: 'sm' | 'md' }

export function OpportunityScore({ score, size = 'md' }: Props) {
  const color = getScoreColor(score)

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded border',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm',
        color,
      )}
    >
      {score}
    </span>
  )
}
