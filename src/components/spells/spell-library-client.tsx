'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

export type SpellItem = {
  name: string
  level_int: number | null
  school: string
  schoolKey: string
  classes: string[]
  ritual: boolean
  concentration: boolean
  casting_time: string
  range: string
  duration: string
}

type SpellLibraryClientProps = {
  initialSpells: SpellItem[]
  page: number
  hasNext: boolean
  initialQuery: string
}

type FilterMode = 'all' | 'class' | 'school'

function levelLabel(level?: number | null) {
  if (level == null) return 'Unknown level'
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
}

function buildHref(q: string, page: number) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/spells?${query}` : '/spells'
}

function schoolAccent(school: string) {
  const key = school.toLowerCase()

  if (key.includes('necromancy')) {
    return 'from-emerald-500/20 via-zinc-950 to-black border-emerald-400/30'
  }
  if (key.includes('evocation')) {
    return 'from-red-500/20 via-zinc-950 to-black border-red-400/30'
  }
  if (key.includes('illusion')) {
    return 'from-fuchsia-500/20 via-zinc-950 to-black border-fuchsia-400/30'
  }
  if (key.includes('abjuration')) {
    return 'from-sky-500/20 via-zinc-950 to-black border-sky-400/30'
  }
  if (key.includes('divination')) {
    return 'from-amber-500/20 via-zinc-950 to-black border-amber-400/30'
  }
  if (key.includes('transmutation')) {
    return 'from-violet-500/20 via-zinc-950 to-black border-violet-400/30'
  }
  if (key.includes('conjuration')) {
    return 'from-cyan-500/20 via-zinc-950 to-black border-cyan-400/30'
  }
  if (key.includes('enchantment')) {
    return 'from-pink-500/20 via-zinc-950 to-black border-pink-400/30'
  }

  return 'from-amber-300/10 via-zinc-950 to-black border-white/10'
}

export function SpellLibraryClient({
  initialSpells,
  page,
  hasNext,
  initialQuery,
}: SpellLibraryClientProps) {
  const [localQuery, setLocalQuery] = useState(initialQuery)
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [selectedClass, setSelectedClass] = useState<string>('All')
  const [selectedSchool, setSelectedSchool] = useState<string>('All')

  const allClasses = useMemo(() => {
    const set = new Set<string>()
    for (const spell of initialSpells) {
      for (const c of spell.classes) {
        if (c) set.add(c)
      }
    }
    return ['All', ...Array.from(set).sort()]
  }, [initialSpells])

  const allSchools = useMemo(() => {
    const set = new Set<string>()
    for (const spell of initialSpells) {
      if (spell.school) set.add(spell.school)
    }
    return ['All', ...Array.from(set).sort()]
  }, [initialSpells])

  const filteredSpells = useMemo(() => {
    return initialSpells.filter((spell) => {
      const qMatch = spell.name.toLowerCase().includes(localQuery.toLowerCase())

      const classMatch =
        selectedClass === 'All' || spell.classes.includes(selectedClass)

      const schoolMatch =
        selectedSchool === 'All' || spell.school === selectedSchool

      return qMatch && classMatch && schoolMatch
    })
  }, [initialSpells, localQuery, selectedClass, selectedSchool])

  const featuredSchool =
    selectedSchool !== 'All'
      ? selectedSchool
      : filteredSpells[0]?.school ?? 'Arcane'

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-120px] top-8 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
        <div className="absolute right-[-100px] top-24 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-[32px] border border-amber-300/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-8 sm:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.14),transparent_30%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:36px_36px]" />

          <div className="relative z-10 max-w-4xl space-y-5">
            <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-amber-200">
              Book of All Knowing
            </span>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold leading-tight text-zinc-50 sm:text-5xl">
                Enter the living grimoire of known spells
              </h1>
              <p className="max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                Search, filter, and explore spells by class, school, or arcane
                discipline. Make it feel less like a database and more like a
                forbidden book.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Spells Loaded
                </p>
                <p className="mt-2 text-2xl font-semibold text-amber-100">
                  {initialSpells.length}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Classes Found
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-100">
                  {allClasses.length - 1}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                  Schools Found
                </p>
                <p className="mt-2 text-2xl font-semibold text-zinc-100">
                  {allSchools.length - 1}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className={`rounded-[32px] border bg-gradient-to-br p-6 ${schoolAccent(featuredSchool)}`}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
                Featured Arcane Shelf
              </p>
              <h2 className="text-3xl font-bold text-zinc-50">
                {featuredSchool === 'All' ? 'Arcane Collection' : `${featuredSchool} Collection`}
              </h2>
              <p className="max-w-2xl text-zinc-300">
                This shelf changes vibe based on your selected school. Try
                Necromancy for a darker, cursed tone.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
              Showing <span className="font-semibold text-amber-200">{filteredSpells.length}</span> matching spells
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.45 }}
          className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-5"
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {(['all', 'class', 'school'] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filterMode === mode
                      ? 'bg-amber-200 text-zinc-950'
                      : 'border border-white/10 bg-zinc-900 text-zinc-200 hover:border-amber-200 hover:text-amber-200'
                  }`}
                >
                  {mode === 'all'
                    ? 'All Spells'
                    : mode === 'class'
                    ? 'By Class'
                    : 'By School'}
                </button>
              ))}
            </div>

            <div className="w-full xl:max-w-md">
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Quick filter on this page..."
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-amber-200"
              />
            </div>
          </div>

          {filterMode === 'class' ? (
            <div className="flex flex-wrap gap-2">
              {allClasses.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedClass(item)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedClass === item
                      ? 'bg-fuchsia-300 text-zinc-950'
                      : 'border border-white/10 bg-zinc-900/80 text-zinc-200 hover:border-fuchsia-300 hover:text-fuchsia-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {filterMode === 'school' ? (
            <div className="flex flex-wrap gap-2">
              {allSchools.map((item) => (
                <button
                  key={item}
                  onClick={() => setSelectedSchool(item)}
                  className={`rounded-full px-4 py-2 text-sm transition ${
                    selectedSchool === item
                      ? 'bg-emerald-300 text-zinc-950'
                      : 'border border-white/10 bg-zinc-900/80 text-zinc-200 hover:border-emerald-300 hover:text-emerald-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {filterMode === 'all' ? (
            <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
              <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1.5">
                Explore everything
              </span>
              <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1.5">
                Switch to Class mode for role-based spells
              </span>
              <span className="rounded-full border border-white/10 bg-zinc-900/80 px-3 py-1.5">
                Switch to School mode for themes like Necromancy
              </span>
            </div>
          ) : null}
        </motion.div>

        {filteredSpells.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 p-10 text-center text-zinc-300">
            No spells found for this filter.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpells.map((spell, index) => (
              <motion.div
                key={`${spell.name}-${spell.level_int ?? 'x'}`}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.03, duration: 0.35 }}
              >
                <Link
                  href={`/spells/${encodeURIComponent(spell.name)}`}
                  className={`group relative block overflow-hidden rounded-[28px] border bg-gradient-to-br p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(251,191,36,0.09)] ${schoolAccent(
                    spell.school
                  )}`}
                >
                  <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-zinc-50 group-hover:text-amber-100">
                          {spell.name}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {levelLabel(spell.level_int)} • {spell.school}
                        </p>
                      </div>

                      <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
                        Open
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm">
                      <div>
                        <p className="text-zinc-500">Casting</p>
                        <p className="mt-1 text-zinc-200">{spell.casting_time}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Range</p>
                        <p className="mt-1 text-zinc-200">{spell.range}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Duration</p>
                        <p className="mt-1 text-zinc-200">{spell.duration}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Type</p>
                        <p className="mt-1 text-zinc-200">
                          {spell.ritual ? 'Ritual' : 'Standard'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {spell.classes.slice(0, 4).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
                        >
                          {item}
                        </span>
                      ))}

                      {spell.concentration ? (
                        <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs text-fuchsia-200">
                          Concentration
                        </span>
                      ) : null}

                      {spell.ritual ? (
                        <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
                          Ritual
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div>
            {page > 1 ? (
              <Link
                href={buildHref(initialQuery, page - 1)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200 hover:text-amber-200"
              >
                Previous
              </Link>
            ) : (
              <span className="text-sm text-zinc-600">Previous</span>
            )}
          </div>

          <span className="text-sm text-zinc-400">Page {page}</span>

          <div>
            {hasNext ? (
              <Link
                href={buildHref(initialQuery, page + 1)}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200 hover:text-amber-200"
              >
                Next
              </Link>
            ) : (
              <span className="text-sm text-zinc-600">Next</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}