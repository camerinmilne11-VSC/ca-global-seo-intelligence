import Link from 'next/link'

const features = [
  {
    name: 'Keywords',
    description:
      'Your SEMrush keyword library, scored 0–100 by priority. Each score weighs search volume, keyword difficulty, intent, and market fit. Work down from the highest-scoring rows first.',
  },
  {
    name: 'Topics',
    description:
      'Manually add content ideas that did not come from keyword research. Type any title or question and it gets added to the database. Topics follow the exact same generation pipeline as keywords.',
  },
  {
    name: 'Brief',
    description:
      'Generates a structured SEO content brief: recommended title, heading structure, keyword targets, FAQ ideas, and content angle. Takes around 45 seconds. A brief is optional — Draft can run without one.',
  },
  {
    name: 'Draft',
    description:
      'Generates a complete 900–1200 word, publication-ready article. Uses the brief for structure if one exists. Takes around 60 seconds. Carousel and Script both require a draft to exist first.',
  },
  {
    name: 'Social',
    description:
      'Generates an Instagram and LinkedIn caption: image overlay text for the graphic, a punchy caption body, and 3–8 targeted hashtags. Uses the draft content if available.',
  },
  {
    name: 'Carousel',
    description:
      'Generates 5 slides of text for your graphic designer. Slide 1 is the hook, slides 2–4 are key insights, slide 5 is a call to action. Requires a draft to exist first.',
  },
  {
    name: 'Script',
    description:
      'Generates a 45-second talking-head video script with an isolated hook line for the first 7 seconds. Written in natural spoken English, ready for direct-to-camera delivery. Requires a draft.',
  },
  {
    name: 'Reset',
    description:
      'Clears all generated content for a keyword or topic — brief, draft, social, carousel, and script — in one click. Use this to regenerate from scratch without deleting the keyword itself.',
  },
]

export default function CoverPage() {
  return (
    <div className="min-h-screen bg-brand-teal-dark text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 py-16 max-w-4xl mx-auto w-full">

        {/* Brand label */}
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-brand-teal-light mb-5">
          CA Global Group — Internal Tool
        </p>

        {/* Title */}
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-center leading-tight mb-4">
          SEO Content Intelligence
        </h1>

        {/* Subtitle */}
        <p className="font-body text-white/60 text-center text-base max-w-xl leading-relaxed mb-10">
          Keyword research, AI content generation, and publishing pipeline for CA Global, CA Mining, CA Finance, Vogue Hygiene, and CA Global HR.
        </p>

        {/* Divider */}
        <div className="w-12 h-0.5 bg-brand-teal rounded mb-10" />

        {/* How it works */}
        <h2 className="font-heading font-semibold text-sm uppercase tracking-widest text-white/40 mb-6">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-10">
          {features.map((f) => (
            <div
              key={f.name}
              className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors"
            >
              <p className="font-heading font-semibold text-brand-teal-light mb-1.5">{f.name}</p>
              <p className="font-body text-sm text-white/60 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* Status note */}
        <p className="font-body text-xs text-white/35 text-center max-w-md mb-10 leading-relaxed">
          Each keyword and topic has a status you can update as work progresses:{' '}
          <span className="text-white/55">Opportunity · In Progress · Published · Paused</span>
        </p>

        {/* CTA */}
        <Link
          href="/ca-global/keywords"
          className="bg-brand-teal hover:bg-brand-teal-light transition-colors font-heading font-semibold text-white px-10 py-4 rounded-xl text-base tracking-wide"
        >
          Continue to Dashboard
        </Link>
      </div>

      <footer className="text-center py-5 text-xs text-white/25 font-body">
        CA Global Group &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
