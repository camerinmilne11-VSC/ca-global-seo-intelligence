'use client'

import type { Carousel } from '@/types'

type Props = { carousel: Carousel }

export function CarouselViewer({ carousel }: Props) {
  return (
    <div className="space-y-3">
      {carousel.slides.map((slide) => (
        <div
          key={slide.slide_number}
          className="flex gap-3 items-start border border-gray-200 rounded-lg p-4 bg-white"
        >
          <span className="shrink-0 w-7 h-7 rounded-full bg-brand-teal text-white text-xs font-bold flex items-center justify-center">
            {slide.slide_number}
          </span>
          <p className="text-sm text-brand-neutral-dark leading-relaxed">{slide.text}</p>
        </div>
      ))}
      <p className="text-xs text-gray-400 pt-1">
        {carousel.slides.length} slide{carousel.slides.length !== 1 ? 's' : ''} — text only, pass to graphic designer
      </p>
    </div>
  )
}
