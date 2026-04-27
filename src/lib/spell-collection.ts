'use client'

import { useEffect, useMemo, useState } from 'react'

type SpellCollectionState = {
  favorites: string[]
  prepared: string[]
}

const STORAGE_KEY = 'book-of-all-knowing:spell-collection:v1'

const defaultState: SpellCollectionState = {
  favorites: [],
  prepared: [],
}

function normalizeSpellName(name: string) {
  return name.trim().toLowerCase()
}

function readStorage(): SpellCollectionState {
  if (typeof window === 'undefined') return defaultState

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState

    const parsed = JSON.parse(raw) as Partial<SpellCollectionState>

    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      prepared: Array.isArray(parsed.prepared) ? parsed.prepared : [],
    }
  } catch {
    return defaultState
  }
}

function writeStorage(state: SpellCollectionState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useSpellCollection() {
  const [collection, setCollection] = useState<SpellCollectionState>(defaultState)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setCollection(readStorage())
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    writeStorage(collection)
  }, [collection, isReady])

  const favoriteSet = useMemo(
    () => new Set(collection.favorites.map(normalizeSpellName)),
    [collection.favorites]
  )

  const preparedSet = useMemo(
    () => new Set(collection.prepared.map(normalizeSpellName)),
    [collection.prepared]
  )

  function isFavorite(spellName: string) {
    return favoriteSet.has(normalizeSpellName(spellName))
  }

  function isPrepared(spellName: string) {
    return preparedSet.has(normalizeSpellName(spellName))
  }

  function toggleFavorite(spellName: string) {
    const key = normalizeSpellName(spellName)

    setCollection((current) => {
      const exists = current.favorites.map(normalizeSpellName).includes(key)

      return {
        ...current,
        favorites: exists
          ? current.favorites.filter((item) => normalizeSpellName(item) !== key)
          : [...current.favorites, spellName],
      }
    })
  }

  function togglePrepared(spellName: string) {
    const key = normalizeSpellName(spellName)

    setCollection((current) => {
      const exists = current.prepared.map(normalizeSpellName).includes(key)

      return {
        ...current,
        prepared: exists
          ? current.prepared.filter((item) => normalizeSpellName(item) !== key)
          : [...current.prepared, spellName],
      }
    })
  }

  return {
    collection,
    isReady,
    isFavorite,
    isPrepared,
    toggleFavorite,
    togglePrepared,
  }
}