import Link from 'next/link'

const features = [
  {
    name: 'Keywords',
    description: 'SEMrush keywords scored 0 to 100 by priority. Work from the top down.',
  },
  {
    name: 'Topics',
    description: 'Add any content idea manually. It goes through the same pipeline as keywords.',
  },
  {
    name: 'Brief',
    description: 'AI-generated SEO brief with title options, heading structure, keyword targets, and FAQs.',
  },
  {
    name: 'Draft',
    description: 'Full 900 to 1200 word article, publication-ready. Uses the brief if one exists.',
  },
  {
    name: 'Social',
    description: 'Instagram and LinkedIn caption with image overlay text and targeted hashtags.',
  },
  {
    name: 'Carousel',
    description: '5 slides of text for your graphic designer. Requires a draft to exist first.',
  },
  {
    name: 'Script',
    description: '45-second talking-head video script with a standalone hook line. Requires a draft.',
  },
  {
    name: 'Reset',
    description: 'Clears all generated content for a keyword in one click so you can regenerate.',
  },
]

export default function CoverPage() {
  return (
    <div className="min-h-screen bg-brand-teal-dark text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 max-w-5xl mx-auto w-full">

        {/* Brand label */}
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-brand-teal-light mb-3">
          CA Global Group · Internal Tool
        </p>

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center leading-tight mb-2">
          SEO Content Intelligence
        </h1>

        {/* Subtitle */}
        <p className="font-body text-white/55 text-center text-sm max-w-lg leading-relaxed mb-6">
          Keyword research, AI content generation, and publishing pipeline for CA Global, CA Mining, CA Finance, Vogue Hygiene, and CA Global HR.
        </p>

        {/* Section label */}
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-white/35 mb-3">
          How it works
        </p>

        {/* Feature grid — 4 cols on desktop, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 w-full mb-5">
          {features.map((f) => (
            <div
              key={f.name}
              className="bg-white/5 border border-white/10 rounded-lg p-3.5"
            >
              <p className="font-heading font-semibold text-brand-teal-light text-sm mb-1">{f.name}</p>
              <p className="font-body text-xs text-white/55 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Status note */}
        <p className="font-body text-xs text-white/30 text-center mb-6">
          Status per keyword:{' '}
          <span className="text-white/50">Opportunity · In Progress · Published · Paused</span>
        </p>

        {/* CTA */}
        <Link
          href="/ca-global/keywords"
          className="bg-brand-teal hover:bg-brand-teal-light transition-colors font-heading font-semibold text-white px-10 py-3.5 rounded-xl text-sm tracking-wide"
        >
          Continue to Dashboard
        </Link>
      </div>

      <footer className="text-center py-4 text-xs text-white/20 font-body">
        CA Global Group &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
