'use client'

import { useSpellCollection } from '@/lib/spell-collection'

type SpellActionsProps = {
  spellName: string
  variant?: 'dark' | 'light'
}

export function SpellActions({
  spellName,
  variant = 'dark',
}: SpellActionsProps) {
  const {
    isReady,
    isFavorite,
    isPrepared,
    toggleFavorite,
    togglePrepared,
  } = useSpellCollection()

  const favorite = isReady && isFavorite(spellName)
  const prepared = isReady && isPrepared(spellName)

  const baseClass =
    variant === 'light'
      ? 'border-stone-500/25 bg-stone-100/70 text-stone-800 hover:bg-amber-100'
      : 'border-white/10 bg-white/5 text-zinc-200 hover:border-amber-200 hover:text-amber-200'

  const favoriteActiveClass =
    variant === 'light'
      ? 'border-amber-700/30 bg-amber-200 text-amber-950'
      : 'border-amber-300/30 bg-amber-300/15 text-amber-200'

  const preparedActiveClass =
    variant === 'light'
      ? 'border-emerald-700/30 bg-emerald-200 text-emerald-950'
      : 'border-emerald-300/30 bg-emerald-300/15 text-emerald-200'

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-pressed={favorite}
        onClick={() => toggleFavorite(spellName)}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${baseClass} ${
          favorite ? favoriteActiveClass : ''
        }`}
      >
        {favorite ? '★ Favorited' : '☆ Favorite'}
      </button>

      <button
        type="button"
        aria-pressed={prepared}
        onClick={() => togglePrepared(spellName)}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${baseClass} ${
          prepared ? preparedActiveClass : ''
        }`}
      >
        {prepared ? '✓ Prepared' : '+ Prepare'}
      </button>
    </div>
  )
}