'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

type ComparableSpell = {
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

type SpellComparePanelProps = {
  spells: ComparableSpell[]
  selectedSpellNames: string[]
  onRemove: (spellName: string) => void
  onClear: () => void
}

function levelLabel(level?: number | null) {
  if (level == null) return 'Unknown level'
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
}

function boolLabel(value: boolean) {
  return value ? 'Yes' : 'No'
}

function getSpellByName(spells: ComparableSpell[], name: string) {
  return spells.find((spell) => spell.name === name) ?? null
}

function CompareRow({
  label,
  left,
  right,
}: {
  label: string
  left: string
  right: string
}) {
  const isDifferent = left !== right

  return (
    <div className="grid gap-3 border-t border-white/10 py-4 md:grid-cols-[180px_1fr_1fr]">
      <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </div>

      <div
        className={`rounded-2xl border px-4 py-3 text-sm ${
          isDifferent
            ? 'border-amber-300/20 bg-amber-300/10 text-amber-100'
            : 'border-white/10 bg-white/5 text-zinc-200'
        }`}
      >
        {left}
      </div>

      <div
        className={`rounded-2xl border px-4 py-3 text-sm ${
          isDifferent
            ? 'border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-100'
            : 'border-white/10 bg-white/5 text-zinc-200'
        }`}
      >
        {right}
      </div>
    </div>
  )
}

export function SpellComparePanel({
  spells,
  selectedSpellNames,
  onRemove,
  onClear,
}: SpellComparePanelProps) {
  const selectedSpells = selectedSpellNames
    .map((name) => getSpellByName(spells, name))
    .filter(Boolean) as ComparableSpell[]

  const leftSpell = selectedSpells[0] ?? null
  const rightSpell = selectedSpells[1] ?? null

  if (selectedSpellNames.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[28px] border border-white/10 bg-white/5 p-5"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Spell Compare
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-50">
          Compare two spells side by side
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
          Click the Compare button on any spell card. Pick two spells to compare
          their casting time, range, school, duration, and caster classes.
        </p>
      </motion.section>
    )
  }

  if (!leftSpell || !rightSpell) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[28px] border border-amber-300/20 bg-amber-300/10 p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
              Spell Compare
            </p>
            <h2 className="mt-2 text-2xl font-bold text-zinc-50">
              Pick one more spell
            </h2>
            <p className="mt-2 text-sm leading-7 text-zinc-300">
              Selected:{' '}
              <span className="font-semibold text-amber-100">
                {leftSpell?.name ?? selectedSpellNames[0]}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-red-300 hover:text-red-200"
          >
            Clear Compare
          </button>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black p-5"
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            Spell Compare
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-50">
            {leftSpell.name} vs {rightSpell.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
            Different values are highlighted so you can quickly compare range,
            timing, school, utility, and caster access.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRemove(leftSpell.name)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:border-amber-200 hover:text-amber-200"
          >
            Remove {leftSpell.name}
          </button>

          <button
            type="button"
            onClick={() => onRemove(rightSpell.name)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:border-fuchsia-200 hover:text-fuchsia-200"
          >
            Remove {rightSpell.name}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:border-red-300 hover:text-red-200"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-3 pb-4 md:grid-cols-[180px_1fr_1fr]">
        <div />

        <Link
          href={`/spells/${encodeURIComponent(leftSpell.name)}`}
          className="rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-5 transition hover:border-amber-200"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-amber-200/80">
            First Spell
          </p>
          <h3 className="mt-2 text-2xl font-bold text-amber-50">
            {leftSpell.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-300">
            {levelLabel(leftSpell.level_int)} • {leftSpell.school}
          </p>
        </Link>

        <Link
          href={`/spells/${encodeURIComponent(rightSpell.name)}`}
          className="rounded-[24px] border border-fuchsia-300/20 bg-fuchsia-300/10 p-5 transition hover:border-fuchsia-200"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-200/80">
            Second Spell
          </p>
          <h3 className="mt-2 text-2xl font-bold text-fuchsia-50">
            {rightSpell.name}
          </h3>
          <p className="mt-1 text-sm text-zinc-300">
            {levelLabel(rightSpell.level_int)} • {rightSpell.school}
          </p>
        </Link>
      </div>

      <CompareRow label="Level" left={levelLabel(leftSpell.level_int)} right={levelLabel(rightSpell.level_int)} />
      <CompareRow label="School" left={leftSpell.school} right={rightSpell.school} />
      <CompareRow label="Casting" left={leftSpell.casting_time} right={rightSpell.casting_time} />
      <CompareRow label="Range" left={leftSpell.range} right={rightSpell.range} />
      <CompareRow label="Duration" left={leftSpell.duration} right={rightSpell.duration} />
      <CompareRow label="Ritual" left={boolLabel(leftSpell.ritual)} right={boolLabel(rightSpell.ritual)} />
      <CompareRow label="Concentration" left={boolLabel(leftSpell.concentration)} right={boolLabel(rightSpell.concentration)} />
      <CompareRow
        label="Classes"
        left={leftSpell.classes.length > 0 ? leftSpell.classes.join(', ') : '—'}
        right={rightSpell.classes.length > 0 ? rightSpell.classes.join(', ') : '—'}
      />
    </motion.section>
  )
}