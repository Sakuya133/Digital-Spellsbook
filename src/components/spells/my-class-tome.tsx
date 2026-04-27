'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useCasterProfile } from '@/lib/caster-profile'

type TomeSpell = {
  name: string
  school: string
  classes: string[]
}

type MyClassTomeProps = {
  spells: TomeSpell[]
  activeClass: string
  activeFilterMode: string
  onApply: () => void
  onClear: () => void
}

function themeForClass(className: string) {
  const key = className.toLowerCase()

  if (key.includes('wizard')) {
    return 'from-blue-500/20 via-zinc-950 to-black border-blue-300/30 text-blue-100'
  }
  if (key.includes('cleric') || key.includes('paladin')) {
    return 'from-yellow-300/20 via-zinc-950 to-black border-yellow-300/30 text-yellow-100'
  }
  if (key.includes('druid') || key.includes('ranger')) {
    return 'from-green-500/20 via-zinc-950 to-black border-green-300/30 text-green-100'
  }
  if (key.includes('warlock')) {
    return 'from-purple-500/20 via-zinc-950 to-black border-purple-300/30 text-purple-100'
  }
  if (key.includes('sorcerer')) {
    return 'from-red-500/20 via-zinc-950 to-black border-red-300/30 text-red-100'
  }
  if (key.includes('bard')) {
    return 'from-pink-500/20 via-zinc-950 to-black border-pink-300/30 text-pink-100'
  }

  return 'from-amber-500/20 via-zinc-950 to-black border-amber-300/30 text-amber-100'
}

function tomeTitle(className: string) {
  const key = className.toLowerCase()

  if (key.includes('wizard')) return 'Wizard Tome'
  if (key.includes('cleric')) return 'Divine Prayerbook'
  if (key.includes('druid')) return 'Grove Codex'
  if (key.includes('warlock')) return 'Pact Grimoire'
  if (key.includes('sorcerer')) return 'Bloodline Codex'
  if (key.includes('bard')) return 'Songbook of Spells'
  if (key.includes('paladin')) return 'Oath Scripture'
  if (key.includes('ranger')) return 'Warden Field Notes'
  if (key.includes('artificer')) return 'Artificer Formulae'

  return 'Class Tome'
}

export function MyClassTome({
  spells,
  activeClass,
  activeFilterMode,
  onApply,
  onClear,
}: MyClassTomeProps) {
  const { profile, isReady } = useCasterProfile()

  const classSpells = useMemo(() => {
    if (!isReady) return []
    return spells.filter((spell) => spell.classes.includes(profile.className))
  }, [spells, profile.className, isReady])

  const topSchools = useMemo(() => {
    const counter = new Map<string, number>()

    for (const spell of classSpells) {
      counter.set(spell.school, (counter.get(spell.school) ?? 0) + 1)
    }

    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
  }, [classSpells])

  if (!isReady) {
    return (
      <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 text-zinc-400">
        Loading class tome...
      </section>
    )
  }

  const isApplied =
    activeFilterMode === 'class' && activeClass === profile.className

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06, duration: 0.45 }}
      className={`rounded-[32px] border bg-gradient-to-br p-6 ${themeForClass(
        profile.className
      )}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            My Class Tome
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-50">
            {tomeTitle(profile.className)}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
            Your current caster is{' '}
            <span className="font-semibold text-amber-100">
              {profile.characterName}
            </span>
            , a level {profile.level} {profile.className}. This tome can focus
            the library to spells usable by your class.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onApply}
            className="rounded-full border border-amber-300/20 bg-amber-200 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-amber-100"
          >
            {isApplied ? '✓ Tome Active' : `Open ${profile.className} Tome`}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-red-300 hover:text-red-200"
          >
            Clear Tome
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
            Spells on page
          </p>
          <p className="mt-2 text-2xl font-semibold text-zinc-50">
            {classSpells.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
            Common schools
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {topSchools.length > 0 ? (
              topSchools.map(([school, count]) => (
                <span
                  key={school}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200"
                >
                  {school}: {count}
                </span>
              ))
            ) : (
              <span className="text-sm text-zinc-400">
                No matching spells on this page.
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
