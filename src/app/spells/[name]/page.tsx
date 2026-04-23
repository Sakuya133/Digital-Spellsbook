import Link from 'next/link'
import { notFound } from 'next/navigation'

type Params = Promise<{
  name: string
}>

type SpellDetail = {
  name: string
  level_int?: number | null
  school?: string | null
  desc?: string | string[] | null
  higher_level?: string | string[] | null
  casting_time?: string | null
  range?: string | null
  duration?: string | null
  components?: string | string[] | null
  material?: string | null
  ritual?: boolean | null
  concentration?: boolean | null
}

type SpellDetailResponse = {
  results?: SpellDetail[]
}

function levelLabel(level?: number | null) {
  if (level == null) return 'Unknown level'
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
}

function normalizeText(value: string | string[] | null | undefined) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeComponents(value: string | string[] | null | undefined) {
  if (!value) return '—'
  if (Array.isArray(value)) return value.join(', ')
  return value
}

async function getSpellByName(name: string) {
  const url = new URL('https://api.open5e.com/v2/spells/')
  url.searchParams.set('name__iexact', name)

  const res = await fetch(url.toString())

  if (!res.ok) {
    throw new Error('Failed to fetch spell detail.')
  }

  const data = (await res.json()) as SpellDetailResponse
  const results = Array.isArray(data.results) ? data.results : []
  return results[0] ?? null
}

export default async function SpellDetailPage({
  params,
}: {
  params: Params
}) {
  const { name } = await params
  const spell = await getSpellByName(name)

  if (!spell) {
    notFound()
  }

  const description = normalizeText(spell.desc)
  const higherLevel = normalizeText(spell.higher_level)

  return (
    <article className="space-y-8">
      <Link
        href="/spells"
        className="inline-flex rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-amber-200 hover:text-amber-200"
      >
        ← Back to library
      </Link>

      <section className="overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-300/10 via-zinc-900 to-zinc-950 p-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300/80">
            Spell Entry
          </p>
          <h1 className="text-4xl font-bold text-amber-50">{spell.name}</h1>
          <p className="text-zinc-300">
            {levelLabel(spell.level_int)} • {spell.school ?? 'Unknown school'}
          </p>

          <div className="flex flex-wrap gap-2 pt-3">
            {spell.ritual ? (
              <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
                Ritual
              </span>
            ) : null}

            {spell.concentration ? (
              <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs text-fuchsia-200">
                Concentration
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Casting Time
          </p>
          <p className="text-zinc-100">{spell.casting_time ?? '—'}</p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Range
          </p>
          <p className="text-zinc-100">{spell.range ?? '—'}</p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Duration
          </p>
          <p className="text-zinc-100">{spell.duration ?? '—'}</p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Components
          </p>
          <p className="text-zinc-100">{normalizeComponents(spell.components)}</p>
        </div>

        <div className="md:col-span-2">
          <p className="mb-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
            Material
          </p>
          <p className="text-zinc-100">{spell.material ?? '—'}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-amber-100">Description</h2>

        <div className="space-y-4 text-sm leading-7 text-zinc-200">
          {description.length > 0 ? (
            description.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-zinc-400">No description available.</p>
          )}
        </div>
      </section>

      {higherLevel.length > 0 ? (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-amber-100">
            At Higher Levels
          </h2>

          <div className="space-y-4 text-sm leading-7 text-zinc-200">
            {higherLevel.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-wrap">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}