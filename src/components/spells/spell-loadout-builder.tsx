'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useSpellLoadouts } from '@/lib/spell-loadouts'

type LoadoutSpell = {
  name: string
  level_int: number | null
  school: string
  classes: string[]
}

type SpellLoadoutBuilderProps = {
  spells: LoadoutSpell[]
}

function levelLabel(level?: number | null) {
  if (level == null) return 'Unknown'
  if (level === 0) return 'Cantrip'
  return `Level ${level}`
}

function getSpellByName(spells: LoadoutSpell[], spellName: string) {
  return spells.find((spell) => spell.name === spellName) ?? null
}

export function SpellLoadoutButton({
  spellName,
}: {
  spellName: string
}) {
  const {
    isReady,
    activeLoadout,
    isInActiveLoadout,
    toggleSpellInActiveLoadout,
  } = useSpellLoadouts()

  const selected = isReady && isInActiveLoadout(spellName)

  return (
    <button
      type="button"
      disabled={!isReady || !activeLoadout}
      onClick={() => toggleSpellInActiveLoadout(spellName)}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        selected
          ? 'border-cyan-300/30 bg-cyan-300/15 text-cyan-200'
          : 'border-white/10 bg-white/5 text-zinc-200 hover:border-cyan-300 hover:text-cyan-200'
      }`}
      title={
        activeLoadout
          ? `Toggle in ${activeLoadout.name}`
          : 'Create a loadout first'
      }
    >
      {selected ? '✓ In Loadout' : '+ Loadout'}
    </button>
  )
}

export function SpellLoadoutBuilder({
  spells,
}: SpellLoadoutBuilderProps) {
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [selectedSpellName, setSelectedSpellName] = useState(spells[0]?.name ?? '')

  const {
    isReady,
    loadouts,
    activeLoadout,
    activeLoadoutId,
    createLoadout,
    updateLoadout,
    deleteLoadout,
    setActiveLoadout,
    addSpellToLoadout,
    removeSpellFromLoadout,
  } = useSpellLoadouts()

  const activeSpells = useMemo(() => {
    if (!activeLoadout) return []

    return activeLoadout.spellNames.map((spellName) => ({
      name: spellName,
      data: getSpellByName(spells, spellName),
    }))
  }, [activeLoadout, spells])

  function handleCreateLoadout() {
    createLoadout(newName, newDescription)
    setNewName('')
    setNewDescription('')
  }

  function handleAddSelectedSpell() {
    if (!activeLoadout || !selectedSpellName) return
    addSpellToLoadout(activeLoadout.id, selectedSpellName)
  }

  if (!isReady) {
    return (
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-zinc-400">
        Loading loadouts...
      </section>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-[32px] border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 via-zinc-950 to-black p-6"
    >
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
            Spell Loadout Builder
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-50">
            Build spell presets for every situation
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-300">
            Create loadouts such as Boss Fight, Exploration, Dungeon Crawl, or
            Necromancer Build. Loadouts are saved in this browser.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
          {loadouts.length} loadout{loadouts.length === 1 ? '' : 's'} created
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
          <div>
            <h3 className="font-semibold text-zinc-100">Create Loadout</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Start a new collection of spells.
            </p>
          </div>

          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="Boss Fight Loadout"
            className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-200"
          />

          <textarea
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
            placeholder="Short description..."
            className="min-h-24 w-full resize-y rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-cyan-200"
          />

          <button
            type="button"
            onClick={handleCreateLoadout}
            disabled={!newName.trim()}
            className="rounded-full border border-cyan-300/20 bg-cyan-200 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create Loadout
          </button>
        </div>

        <div className="space-y-4 rounded-[24px] border border-white/10 bg-black/20 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-zinc-100">Active Loadout</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Add spells from this page or use the card button.
              </p>
            </div>

            <select
              value={activeLoadoutId ?? ''}
              onChange={(event) => setActiveLoadout(event.target.value)}
              disabled={loadouts.length === 0}
              className="rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-cyan-200 disabled:opacity-40"
            >
              {loadouts.length === 0 ? (
                <option value="">No loadout yet</option>
              ) : (
                loadouts.map((loadout) => (
                  <option key={loadout.id} value={loadout.id}>
                    {loadout.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {activeLoadout ? (
            <>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <input
                  value={activeLoadout.name}
                  onChange={(event) =>
                    updateLoadout(activeLoadout.id, {
                      name: event.target.value,
                    })
                  }
                  className="w-full bg-transparent text-xl font-semibold text-zinc-50 outline-none"
                />
                <textarea
                  value={activeLoadout.description}
                  onChange={(event) =>
                    updateLoadout(activeLoadout.id, {
                      description: event.target.value,
                    })
                  }
                  placeholder="Loadout description..."
                  className="mt-2 min-h-16 w-full resize-y bg-transparent text-sm leading-6 text-zinc-300 outline-none placeholder:text-zinc-600"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={selectedSpellName}
                  onChange={(event) => setSelectedSpellName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-cyan-200"
                >
                  {spells.map((spell) => (
                    <option key={spell.name} value={spell.name}>
                      {spell.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddSelectedSpell}
                  disabled={!selectedSpellName}
                  className="rounded-2xl border border-cyan-300/20 bg-cyan-200 px-4 py-3 text-sm font-medium text-zinc-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              {activeSpells.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-zinc-400">
                  This loadout is empty.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSpells.map((item) => (
                    <div
                      key={item.name}
                      className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <Link
                          href={`/spells/${encodeURIComponent(item.name)}`}
                          className="font-semibold text-zinc-100 transition hover:text-cyan-200"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-1 text-xs text-zinc-500">
                          {item.data
                            ? `${levelLabel(item.data.level_int)} • ${item.data.school}`
                            : 'Not loaded on current page'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSpellFromLoadout(activeLoadout.id, item.name)
                        }
                        className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-red-300 hover:text-red-200"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => deleteLoadout(activeLoadout.id)}
                className="rounded-full border border-red-300/20 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
              >
                Delete Active Loadout
              </button>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
              Create your first loadout to start collecting spells.
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
