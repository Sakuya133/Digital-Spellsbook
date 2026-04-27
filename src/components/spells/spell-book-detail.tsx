'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SpellActions } from '@/components/spells/spell-actions'
import { SpellNotesPanel } from '@/components/spells/spell-notes-panel'
import { CasterProfileBadge } from '@/components/spells/caster-profile-panel'

export type SpellDetailItem = {
  name: string
  level_int: number | null
  school: string
  schoolKey: string
  classes: string[]
  description: string[]
  higherLevel: string[]
  casting_time: string
  range: string
  duration: string
  components: string
  material: string
  ritual: boolean
  concentration: boolean
}

function levelLabel(level?: number | null) {
  if (level == null) return 'Unknown level'
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
}

function schoolTheme(school: string) {
  const key = school.toLowerCase()

  if (key.includes('necromancy')) {
    return {
      glow: 'bg-emerald-400/15',
      edge: 'border-emerald-400/30',
      badge: 'bg-emerald-300/15 text-emerald-900 border-emerald-700/25',
      accent: 'text-emerald-700',
      darkAccent: 'text-emerald-200',
      aura: 'from-emerald-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('evocation')) {
    return {
      glow: 'bg-red-400/15',
      edge: 'border-red-400/30',
      badge: 'bg-red-300/15 text-red-900 border-red-700/25',
      accent: 'text-red-700',
      darkAccent: 'text-red-200',
      aura: 'from-red-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('illusion')) {
    return {
      glow: 'bg-fuchsia-400/15',
      edge: 'border-fuchsia-400/30',
      badge: 'bg-fuchsia-300/15 text-fuchsia-900 border-fuchsia-700/25',
      accent: 'text-fuchsia-700',
      darkAccent: 'text-fuchsia-200',
      aura: 'from-fuchsia-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('abjuration')) {
    return {
      glow: 'bg-sky-400/15',
      edge: 'border-sky-400/30',
      badge: 'bg-sky-300/15 text-sky-900 border-sky-700/25',
      accent: 'text-sky-700',
      darkAccent: 'text-sky-200',
      aura: 'from-sky-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('divination')) {
    return {
      glow: 'bg-amber-400/15',
      edge: 'border-amber-400/30',
      badge: 'bg-amber-300/15 text-amber-900 border-amber-700/25',
      accent: 'text-amber-700',
      darkAccent: 'text-amber-200',
      aura: 'from-amber-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('transmutation')) {
    return {
      glow: 'bg-violet-400/15',
      edge: 'border-violet-400/30',
      badge: 'bg-violet-300/15 text-violet-900 border-violet-700/25',
      accent: 'text-violet-700',
      darkAccent: 'text-violet-200',
      aura: 'from-violet-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('conjuration')) {
    return {
      glow: 'bg-cyan-400/15',
      edge: 'border-cyan-400/30',
      badge: 'bg-cyan-300/15 text-cyan-900 border-cyan-700/25',
      accent: 'text-cyan-700',
      darkAccent: 'text-cyan-200',
      aura: 'from-cyan-500/20 via-zinc-950 to-black',
    }
  }

  if (key.includes('enchantment')) {
    return {
      glow: 'bg-pink-400/15',
      edge: 'border-pink-400/30',
      badge: 'bg-pink-300/15 text-pink-900 border-pink-700/25',
      accent: 'text-pink-700',
      darkAccent: 'text-pink-200',
      aura: 'from-pink-500/20 via-zinc-950 to-black',
    }
  }

  return {
    glow: 'bg-amber-400/15',
    edge: 'border-amber-400/30',
    badge: 'bg-amber-300/15 text-amber-900 border-amber-700/25',
    accent: 'text-amber-700',
    darkAccent: 'text-amber-200',
    aura: 'from-amber-500/20 via-zinc-950 to-black',
  }
}

function runeForSchool(school: string) {
  const key = school.toLowerCase()

  if (key.includes('necromancy')) return '☠'
  if (key.includes('evocation')) return '✦'
  if (key.includes('illusion')) return '✧'
  if (key.includes('abjuration')) return '⛨'
  if (key.includes('divination')) return '◈'
  if (key.includes('transmutation')) return '⚗'
  if (key.includes('conjuration')) return '✺'
  if (key.includes('enchantment')) return '❂'

  return '✶'
}

function StatRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-stone-800">{value}</p>
    </div>
  )
}

function PageNumber({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <span
          key={index}
          className={`h-2 rounded-full transition-all ${
            currentPage === index
              ? 'w-8 bg-amber-700'
              : 'w-2 bg-stone-400/70'
          }`}
        />
      ))}
    </div>
  )
}

export function SpellBookDetail({
  spell,
}: {
  spell: SpellDetailItem
}) {
  const [currentPage, setCurrentPage] = useState(0)
  const [direction, setDirection] = useState(1)

  const theme = schoolTheme(spell.school)
  const rune = runeForSchool(spell.school)

  const spreads = [
    {
      title: 'Overview',
      left: (
        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
                Book of All Knowing
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                {spell.name}
              </h1>
              <p className="text-sm text-stone-600">
                {levelLabel(spell.level_int)} • {spell.school}
              </p>
            </div>

            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`flex h-16 w-16 items-center justify-center rounded-full border text-2xl ${theme.edge} ${theme.badge}`}
            >
              {rune}
            </motion.div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs ${theme.badge}`}>
              {spell.school}
            </span>

            {spell.ritual ? (
              <span className="rounded-full border border-sky-700/25 bg-sky-300/15 px-3 py-1 text-xs text-sky-900">
                Ritual
              </span>
            ) : null}

            {spell.concentration ? (
              <span className="rounded-full border border-fuchsia-700/25 bg-fuchsia-300/15 px-3 py-1 text-xs text-fuchsia-900">
                Concentration
              </span>
            ) : null}
          </div>

          <div className="mb-5">
            <SpellActions spellName={spell.name} variant="light" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatRow label="Casting Time" value={spell.casting_time} />
            <StatRow label="Range" value={spell.range} />
            <StatRow label="Duration" value={spell.duration} />
            <StatRow label="Components" value={spell.components} />
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-black/5 p-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
              Material
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-800">
              {spell.material}
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-center justify-between border-t border-stone-400/30 pt-4 text-xs uppercase tracking-[0.25em] text-stone-500">
              <span>{spell.schoolKey}</span>
              <span>Arcane Record</span>
            </div>
          </div>
        </div>
      ),
      right: (
        <div className="relative z-10 h-full">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
                Inscribed Description
              </p>
              <h2 className="mt-2 text-2xl font-bold">Spell Manuscript</h2>
            </div>

            <div className={`rounded-full border px-3 py-1 text-xs ${theme.badge}`}>
              {rune} Arcane
            </div>
          </div>

          <div className="space-y-4">
            {spell.description.length > 0 ? (
              spell.description.map((paragraph, index) => (
                <motion.p
                  key={`${spell.name}-desc-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + index * 0.05, duration: 0.3 }}
                  className="text-sm leading-8 text-stone-800"
                >
                  {paragraph}
                </motion.p>
              ))
            ) : (
              <p className="text-sm leading-8 text-stone-600">
                No description available.
              </p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-stone-400/30 pt-5 text-xs uppercase tracking-[0.25em] text-stone-500">
            <span>Page 1</span>
            <span className={theme.accent}>Known Spell Entry</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Casting Ledger',
      left: (
        <div className="relative z-10 h-full">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
            Casting Ledger
          </p>
          <h2 className="mt-2 text-3xl font-bold">How to Cast</h2>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            This page records the practical properties of the spell: timing,
            distance, duration, components, and caster restrictions.
          </p>

          <div className="mt-6 grid gap-3">
            <StatRow label="Casting Time" value={spell.casting_time} />
            <StatRow label="Range" value={spell.range} />
            <StatRow label="Duration" value={spell.duration} />
            <StatRow label="Components" value={spell.components} />
          </div>

          <div className="mt-5 rounded-[24px] border border-black/10 bg-black/5 p-5">
            <h3 className="font-semibold text-stone-900">Arcane Flags</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-xs ${theme.badge}`}>
                {spell.school}
              </span>

              <span className="rounded-full border border-stone-500/25 bg-stone-100/60 px-3 py-1 text-xs text-stone-800">
                {levelLabel(spell.level_int)}
              </span>

              {spell.ritual ? (
                <span className="rounded-full border border-sky-700/25 bg-sky-300/15 px-3 py-1 text-xs text-sky-900">
                  Ritual Spell
                </span>
              ) : null}

              {spell.concentration ? (
                <span className="rounded-full border border-fuchsia-700/25 bg-fuchsia-300/15 px-3 py-1 text-xs text-fuchsia-900">
                  Requires Concentration
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ),
      right: (
        <div className="relative z-10 h-full">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
            Usable By
          </p>
          <h2 className="mt-2 text-3xl font-bold">Caster Classes</h2>

          <div className="mt-6 flex flex-wrap gap-2">
            {spell.classes.length > 0 ? (
              spell.classes.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-stone-500/25 bg-stone-100/70 px-3 py-1 text-xs text-stone-800"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-stone-600">Unknown classes</span>
            )}
          </div>

          <div className="mt-7 rounded-[24px] border border-black/10 bg-black/5 p-5">
            <h3 className="font-semibold text-stone-900">Material Notes</h3>
            <p className="mt-3 text-sm leading-7 text-stone-800">
              {spell.material}
            </p>
          </div>

          <div className="mt-7 rounded-[24px] border border-black/10 bg-black/5 p-5">
            <h3 className="font-semibold text-stone-900">Spell Handling</h3>
            <div className="mt-4">
              <SpellActions spellName={spell.name} variant="light" />
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-800">
              Mark this spell as favorite or prepared. For now it is saved in
              localStorage, later it can be synced with your Go Gin backend.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-stone-400/30 pt-5 text-xs uppercase tracking-[0.25em] text-stone-500">
            <span>Page 2</span>
            <span className={theme.accent}>Casting Record</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Higher Magic',
      left: (
        <div className="relative z-10 h-full">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
            Higher Magic
          </p>
          <h2 className="mt-2 text-3xl font-bold">At Higher Levels</h2>

          {spell.higherLevel.length > 0 ? (
            <div className="mt-6 space-y-4">
              {spell.higherLevel.map((paragraph, index) => (
                <p
                  key={`${spell.name}-higher-${index}`}
                  className="text-sm leading-8 text-stone-800"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-black/10 bg-black/5 p-5">
              <p className="text-sm leading-7 text-stone-700">
                This spell has no listed higher-level scaling in the current
                source data.
              </p>
            </div>
          )}

          <div className="mt-7 rounded-[24px] border border-black/10 bg-black/5 p-5">
            <h3 className="font-semibold text-stone-900">Future Feature</h3>
            <p className="mt-3 text-sm leading-7 text-stone-800">
              Later, this area can become a spell upgrade path or recommended
              slot level guide.
            </p>
          </div>
        </div>
      ),
      right: (
        <div className="relative z-10 h-full">
          <p className="text-xs uppercase tracking-[0.4em] text-stone-500">
            Personal Grimoire
          </p>
          <h2 className="mt-2 text-3xl font-bold">Caster Notes</h2>

          <div className="mt-6">
  <SpellNotesPanel spellName={spell.name} />
</div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                Prepared
              </p>
              <p className="mt-2 text-sm text-stone-800">
                Use the Prepare button to add this spell to your active list.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                Favorite
              </p>
              <p className="mt-2 text-sm text-stone-800">
                Use the Favorite button to keep this spell in your archive.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <SpellActions spellName={spell.name} variant="light" />
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-stone-400/30 pt-5 text-xs uppercase tracking-[0.25em] text-stone-500">
            <span>Page 3</span>
            <span className={theme.accent}>Personal Archive</span>
          </div>
        </div>
      ),
    },
  ]

  const totalPages = spreads.length
  const canGoPrev = currentPage > 0
  const canGoNext = currentPage < totalPages - 1

  function goPrev() {
    if (!canGoPrev) return
    setDirection(-1)
    setCurrentPage((page) => Math.max(page - 1, 0))
  }

  function goNext() {
    if (!canGoNext) return
    setDirection(1)
    setCurrentPage((page) => Math.min(page + 1, totalPages - 1))
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        setDirection(-1)
        setCurrentPage((page) => Math.max(page - 1, 0))
      }

      if (event.key === 'ArrowRight') {
        setDirection(1)
        setCurrentPage((page) => Math.min(page + 1, totalPages - 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const currentSpread = spreads[currentPage]

  return (
    <section className="relative overflow-hidden py-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className={`absolute left-[-80px] top-10 h-72 w-72 rounded-full blur-3xl ${theme.glow}`} />
        <div className="absolute right-[-100px] top-24 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-4"
      >
        <Link
          href="/spells"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition hover:border-amber-200 hover:text-amber-200"
        >
          ← Back to Library
        </Link>

        <div className="flex flex-wrap items-center gap-3">
            <CasterProfileBadge />
          <SpellActions spellName={spell.name} />

          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-35"
          >
            ← Prev Page
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:border-amber-200 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-35"
          >
            Next Page →
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, rotateX: 12, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative mx-auto max-w-7xl"
        style={{ perspective: 1800 }}
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">
              Current Chapter
            </p>
            <p className={`mt-1 font-semibold ${theme.darkAccent}`}>
              {currentSpread.title}
            </p>
          </div>

          <PageNumber currentPage={currentPage} totalPages={totalPages} />
        </div>

        <div className="relative rounded-[36px] border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-3 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
          <div className={`absolute inset-0 rounded-[36px] bg-gradient-to-br ${theme.aura} opacity-70`} />
          <div className="absolute inset-0 rounded-[36px] opacity-15 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />

          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#e9dcc3] shadow-inner">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                initial={{
                  opacity: 0,
                  rotateY: direction > 0 ? -18 : 18,
                  x: direction > 0 ? 50 : -50,
                  scale: 0.985,
                }}
                animate={{
                  opacity: 1,
                  rotateY: 0,
                  x: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  rotateY: direction > 0 ? 18 : -18,
                  x: direction > 0 ? -50 : 50,
                  scale: 0.985,
                }}
                transition={{
                  duration: 0.45,
                  ease: 'easeInOut',
                }}
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin:
                    direction > 0 ? 'left center' : 'right center',
                }}
              >
                <div className="grid min-h-[760px] lg:grid-cols-[1fr_1fr]">
                  <div className="relative border-b border-stone-400/30 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.65),transparent_42%)] p-6 text-stone-900 sm:p-8 lg:border-b-0 lg:border-r lg:border-stone-400/30">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_bottom,rgba(0,0,0,0.4)_1px,transparent_1px)] [background-size:100%_28px]" />
                    {currentSpread.left}
                  </div>

                  <div className="relative bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_38%)] p-6 text-stone-900 sm:p-8">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_bottom,rgba(0,0,0,0.4)_1px,transparent_1px)] [background-size:100%_28px]" />
                    {currentSpread.right}
                  </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[22px] -translate-x-1/2 bg-gradient-to-r from-black/10 via-black/20 to-black/10 lg:block" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              <motion.div
                key={`page-flash-${currentPage}`}
                initial={{
                  opacity: 0,
                  scaleX: 0,
                  rotateY: direction > 0 ? -75 : 75,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  scaleX: [0, 1, 0],
                  rotateY: direction > 0 ? [-75, 0, 75] : [75, 0, -75],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className={`pointer-events-none absolute top-0 z-20 hidden h-full w-1/2 bg-gradient-to-r from-[#f4e7cb] via-[#d8c39b] to-[#f4e7cb] shadow-2xl lg:block ${
                  direction > 0 ? 'left-1/2 origin-left' : 'left-0 origin-right'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous page"
              className="absolute left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-stone-800/10 bg-stone-100/70 px-3 py-2 text-sm text-stone-800 shadow-lg transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-0 lg:block"
            >
              ←
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next page"
              className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-stone-800/10 bg-stone-100/70 px-3 py-2 text-sm text-stone-800 shadow-lg transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-0 lg:block"
            >
              →
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-500">
          Tip: pakai keyboard ← dan → untuk membalik halaman.
        </p>
      </motion.div>
    </section>
  )
}