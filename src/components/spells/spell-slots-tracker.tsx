'use client'

import { motion } from 'framer-motion'
import { useCasterProfile } from '@/lib/caster-profile'
import {
  SpellSlotLevel,
  useSpellSlots,
} from '@/lib/spell-slots'

const SLOT_LEVELS: SpellSlotLevel[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function slotDots(max: number, used: number) {
  if (max <= 0) {
    return <span className="text-xs text-zinc-600">No slots</span>
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {Array.from({ length: max }).map((_, index) => {
        const isUsed = index < used

        return (
          <span
            key={index}
            className={`h-2.5 w-2.5 rounded-full ${
              isUsed ? 'bg-zinc-600' : 'bg-amber-200'
            }`}
          />
        )
      })}
    </div>
  )
}

export function SpellSlotsTracker() {
  const { profile, isReady: isProfileReady } = useCasterProfile()
  const {
    slots,
    isReady,
    setMaxSlots,
    useSlot,
    restoreSlot,
    resetUsedSlots,
    applySuggestedSlots,
  } = useSpellSlots()

  if (!isReady || !isProfileReady) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-zinc-400">
        Loading spell slots...
      </section>
    )
  }

  const totalMax = SLOT_LEVELS.reduce((sum, level) => sum + slots[level].max, 0)
  const totalUsed = SLOT_LEVELS.reduce((sum, level) => sum + slots[level].used, 0)

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[32px] border border-violet-300/20 bg-gradient-to-br from-violet-500/10 via-zinc-950 to-black p-6"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
            Spell Slots Tracker
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-50">
            Track your remaining spell power
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
            Click Use when a slot is spent and Restore when it comes back. The
            suggested slots are a practical starting point and can be edited.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
          Used{' '}
          <span className="font-semibold text-violet-200">{totalUsed}</span> /{' '}
          <span className="font-semibold text-amber-200">{totalMax}</span>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applySuggestedSlots(profile.className, profile.level)}
          className="rounded-full border border-violet-300/20 bg-violet-200 px-4 py-2 text-xs font-medium text-zinc-950 transition hover:bg-violet-100"
        >
          Apply Suggested for Lv. {profile.level} {profile.className}
        </button>

        <button
          type="button"
          onClick={resetUsedSlots}
          className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:border-amber-200 hover:text-amber-200"
        >
          Long Rest / Reset Used
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {SLOT_LEVELS.map((level) => {
          const slot = slots[level]
          const remaining = Math.max(0, slot.max - slot.used)

          return (
            <div
              key={level}
              className="rounded-[24px] border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
                    Slot Level
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-zinc-50">
                    {level}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-xs text-zinc-500">Remaining</p>
                  <p className="text-lg font-semibold text-amber-100">
                    {remaining}
                  </p>
                </div>
              </div>

              <div className="mb-4 min-h-6">{slotDots(slot.max, slot.used)}</div>

              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Max
                </span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={slot.max}
                  onChange={(event) =>
                    setMaxSlots(level, Number(event.target.value) || 0)
                  }
                  className="w-20 rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-violet-200"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => useSlot(level)}
                  disabled={slot.max <= 0 || slot.used >= slot.max}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-red-300 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Use
                </button>

                <button
                  type="button"
                  onClick={() => restoreSlot(level)}
                  disabled={slot.used <= 0}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-emerald-300 hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Restore
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}
