import Link from 'next/link'

const features = [
  {
    title: 'Spell Library',
    desc: 'Browse the codex of known spells with a cleaner, more magical reading experience.',
  },
  {
    title: 'Spell Details',
    desc: 'Open each spell like a grimoire page: school, range, casting time, components, and description.',
  },
  {
    title: 'Future-Ready',
    desc: 'This foundation is ready for favorites, prepared spells, notes, and magical items in later versions.',
  },
]

export default function HomePage() {
  return (
    <section className="space-y-12">
      <div className="overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-100/10 via-zinc-900 to-zinc-950 p-8 sm:p-12">
        <div className="max-w-3xl space-y-6">
          <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-amber-200">
            v1.0.0 Spellbook
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              A digital spellbook worthy of a true spellcaster.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Build your own beautiful grimoire — not just a plain database.
              Start with spells now, then evolve the project into magical items,
              relic archives, and your full arcane collection later.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/spells"
              className="rounded-xl bg-amber-200 px-5 py-3 font-medium text-zinc-950 transition hover:bg-amber-100"
            >
              Open Spell Library
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-white/15 px-5 py-3 font-medium text-zinc-200 transition hover:border-amber-200 hover:text-amber-200"
            >
              See Foundation
            </a>
          </div>
        </div>
      </div>

      <section id="features" className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <h2 className="mb-2 text-lg font-semibold text-amber-100">
              {feature.title}
            </h2>
            <p className="text-sm leading-6 text-zinc-300">{feature.desc}</p>
          </article>
        ))}
      </section>
    </section>
  )
}