'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'

type RandomSpell = {
  name: string
  level_int: number | null
  school: string
  classes: string[]
  casting_time: string
  range: string
  duration: string
  ritual: boolean
  concentration: boolean
}

type RandomSpellDiscoveryProps = {
  spells: RandomSpell[]
}

function levelLabel(level?: number | null) {
  if (level == null) return 'Unknown level'
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
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

export function RandomSpellDiscovery({
  spells,
}: RandomSpellDiscoveryProps) {
  const [selectedSpellName, setSelectedSpellName] = useState<string | null>(null)
  const [drawCount, setDrawCount] = useState(0)

  const selectedSpell = useMemo(() => {
    if (!selectedSpellName) return null
    return spells.find((spell) => spell.name === selectedSpellName) ?? null
  }, [selectedSpellName, spells])

  function drawRandomSpell() {
    if (spells.length === 0) return

    const randomIndex = Math.floor(Math.random() * spells.length)
    setSelectedSpellName(spells[randomIndex].name)
    setDrawCount((current) => current + 1)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[32px] border border-amber-300/20 bg-gradient-to-br from-amber-500/10 via-zinc-950 to-black p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
            Random Spell Discovery
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-50">
            Draw a spell from the arcane deck
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
            Use this when you want inspiration. It draws from the currently
            visible spell list after filters.
          </p>
        </div>

        <button
          type="button"
          onClick={drawRandomSpell}
          disabled={spells.length === 0}
          className="rounded-full border border-amber-300/20 bg-amber-200 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Draw Random Spell
        </button>
      </div>

      <AnimatePresence mode="wait">
        {selectedSpell ? (
          <motion.div
            key={`${selectedSpell.name}-${drawCount}`}
            initial={{ opacity: 0, rotateY: -35, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 35, y: -18, scale: 0.94 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mt-6 rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_30%),linear-gradient(135deg,rgba(24,24,27,0.95),rgba(0,0,0,0.95))] p-5"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/10 text-2xl text-amber-100">
                  {runeForSchool(selectedSpell.school)}
                </div>

                <p className="text-xs uppercase tracking-[0.28em] text-amber-200/70">
                  Drawn Spell
                </p>
                <h3 className="mt-2 text-3xl font-bold text-zinc-50">
                  {selectedSpell.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-300">
                  {levelLabel(selectedSpell.level_int)} • {selectedSpell.school}
                </p>
              </div>

              <Link
                href={`/spells/${encodeURIComponent(selectedSpell.name)}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-amber-200 hover:text-amber-200"
              >
                Open Spell
              </Link>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Casting
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {selectedSpell.casting_time}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Range
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {selectedSpell.range}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                  Duration
                </p>
                <p className="mt-2 text-sm text-zinc-200">
                  {selectedSpell.duration}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedSpell.classes.slice(0, 5).map((className) => (
                <span
                  key={className}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
                >
                  {className}
                </span>
              ))}

              {selectedSpell.ritual ? (
                <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-xs text-sky-200">
                  Ritual
                </span>
              ) : null}

              {selectedSpell.concentration ? (
                <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1 text-xs text-fuchsia-200">
                  Concentration
                </span>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.section>
  )
}
