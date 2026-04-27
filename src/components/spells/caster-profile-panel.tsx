'use client'

import { motion } from 'framer-motion'
import {
  CasterTheme,
  useCasterProfile,
} from '@/lib/caster-profile'

const CLASS_OPTIONS = [
  'Wizard',
  'Sorcerer',
  'Warlock',
  'Cleric',
  'Druid',
  'Bard',
  'Paladin',
  'Ranger',
  'Artificer',
]

const THEME_OPTIONS: CasterTheme[] = [
  'Arcane',
  'Forbidden',
  'Divine',
  'Fey',
  'Infernal',
  'Nature',
]

function themeClass(theme: CasterTheme) {
  switch (theme) {
    case 'Forbidden':
      return 'from-emerald-500/20 via-zinc-950 to-black border-emerald-400/30'
    case 'Divine':
      return 'from-yellow-300/20 via-zinc-950 to-black border-yellow-300/30'
    case 'Fey':
      return 'from-pink-400/20 via-zinc-950 to-black border-pink-300/30'
    case 'Infernal':
      return 'from-red-500/20 via-zinc-950 to-black border-red-400/30'
    case 'Nature':
      return 'from-green-500/20 via-zinc-950 to-black border-green-400/30'
    default:
      return 'from-violet-500/20 via-zinc-950 to-black border-violet-400/30'
  }
}

function themeLabel(theme: CasterTheme) {
  switch (theme) {
    case 'Forbidden':
      return '☠ Forbidden Tome'
    case 'Divine':
      return '✦ Divine Scripture'
    case 'Fey':
      return '✧ Fey Grimoire'
    case 'Infernal':
      return '🔥 Infernal Pact'
    case 'Nature':
      return '🌿 Grove Codex'
    default:
      return '✶ Arcane Tome'
  }
}

export function CasterProfilePanel() {
  const { profile, isReady, updateProfile, resetProfile } = useCasterProfile()

  if (!isReady) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 text-zinc-400">
        Loading caster profile...
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className={`rounded-[32px] border bg-gradient-to-br p-6 ${themeClass(
        profile.theme
      )}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
            Caster Profile
          </p>

          <div>
            <h2 className="text-3xl font-bold text-zinc-50">
              {profile.characterName}
            </h2>
            <p className="mt-2 text-zinc-300">
              Level {profile.level} {profile.className}
              {profile.subclass && profile.subclass !== 'None'
                ? ` • ${profile.subclass}`
                : ''}
            </p>
          </div>

          <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-amber-100">
            {themeLabel(profile.theme)}
          </div>

          <p className="max-w-md text-sm leading-7 text-zinc-300">
            This profile will shape your spellbook identity. Later, this can
            control recommended spells, prepared spell limits, class themes, and
            campaign-specific loadouts.
          </p>
        </div>

        <div className="grid gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              Character Name
            </span>
            <input
              value={profile.characterName}
              onChange={(event) =>
                updateProfile({ characterName: event.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200"
              placeholder="Elric Veyr"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              Class
            </span>
            <select
              value={profile.className}
              onChange={(event) =>
                updateProfile({ className: event.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200"
            >
              {CLASS_OPTIONS.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              Subclass / Path
            </span>
            <input
              value={profile.subclass}
              onChange={(event) =>
                updateProfile({ subclass: event.target.value })
              }
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200"
              placeholder="Necromancer"
            />
          </label>

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              Level
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={profile.level}
              onChange={(event) =>
                updateProfile({
                  level: Math.min(
                    20,
                    Math.max(1, Number(event.target.value) || 1)
                  ),
                })
              }
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              Tome Theme
            </span>
            <select
              value={profile.theme}
              onChange={(event) =>
                updateProfile({ theme: event.target.value as CasterTheme })
              }
              className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-amber-200"
            >
              {THEME_OPTIONS.map((theme) => (
                <option key={theme} value={theme}>
                  {themeLabel(theme)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={resetProfile}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:border-red-300 hover:text-red-200"
            >
              Reset Profile
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export function CasterProfileBadge() {
  const { profile, isReady } = useCasterProfile()

  if (!isReady) return null

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br px-4 py-3 text-sm ${themeClass(
        profile.theme
      )}`}
    >
      <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
        Current Caster
      </p>
      <p className="mt-1 font-semibold text-zinc-100">
        {profile.characterName}
      </p>
      <p className="text-xs text-zinc-400">
        Lv. {profile.level} {profile.className}
      </p>
    </div>
  )
}