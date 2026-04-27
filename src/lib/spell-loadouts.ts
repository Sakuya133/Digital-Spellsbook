'use client'

import { useEffect, useMemo, useState } from 'react'

export type SpellLoadout = {
  id: string
  name: string
  description: string
  spellNames: string[]
  createdAt: string
  updatedAt: string
}

type SpellLoadoutState = {
  loadouts: SpellLoadout[]
  activeLoadoutId: string | null
}

const STORAGE_KEY = 'book-of-all-knowing:spell-loadouts:v1'
const STORAGE_EVENT = 'book-of-all-knowing:spell-loadouts-updated'

const defaultState: SpellLoadoutState = {
  loadouts: [],
  activeLoadoutId: null,
}

function normalizeSpellName(name: string) {
  return name.trim().toLowerCase()
}

function createId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function readStorage(): SpellLoadoutState {
  if (typeof window === 'undefined') return defaultState

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState

    const parsed = JSON.parse(raw) as Partial<SpellLoadoutState>
    const loadouts = Array.isArray(parsed.loadouts) ? parsed.loadouts : []

    const activeLoadoutId =
      typeof parsed.activeLoadoutId === 'string'
        ? parsed.activeLoadoutId
        : loadouts[0]?.id ?? null

    return {
      loadouts: loadouts.map((loadout) => ({
        id: String(loadout.id),
        name: String(loadout.name || 'Unnamed Loadout'),
        description: String(loadout.description || ''),
        spellNames: Array.isArray(loadout.spellNames)
          ? loadout.spellNames.map(String)
          : [],
        createdAt: String(loadout.createdAt || new Date().toISOString()),
        updatedAt: String(loadout.updatedAt || new Date().toISOString()),
      })),
      activeLoadoutId,
    }
  } catch {
    return defaultState
  }
}

function writeStorage(state: SpellLoadoutState) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

export function useSpellLoadouts() {
  const [state, setState] = useState<SpellLoadoutState>(defaultState)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setState(readStorage())
    setIsReady(true)

    function handleExternalUpdate() {
      setState(readStorage())
    }

    window.addEventListener('storage', handleExternalUpdate)
    window.addEventListener(STORAGE_EVENT, handleExternalUpdate)

    return () => {
      window.removeEventListener('storage', handleExternalUpdate)
      window.removeEventListener(STORAGE_EVENT, handleExternalUpdate)
    }
  }, [])

  useEffect(() => {
    if (!isReady) return
    writeStorage(state)
  }, [state, isReady])

  const activeLoadout = useMemo(() => {
    return (
      state.loadouts.find((loadout) => loadout.id === state.activeLoadoutId) ??
      state.loadouts[0] ??
      null
    )
  }, [state.loadouts, state.activeLoadoutId])

  const activeSpellSet = useMemo(() => {
    return new Set(activeLoadout?.spellNames.map(normalizeSpellName) ?? [])
  }, [activeLoadout])

  function createLoadout(name: string, description = '') {
    const now = new Date().toISOString()
    const trimmedName = name.trim()

    if (!trimmedName) return

    const newLoadout: SpellLoadout = {
      id: createId(),
      name: trimmedName,
      description: description.trim(),
      spellNames: [],
      createdAt: now,
      updatedAt: now,
    }

    setState((current) => ({
      loadouts: [...current.loadouts, newLoadout],
      activeLoadoutId: newLoadout.id,
    }))
  }

  function updateLoadout(loadoutId: string, data: Partial<Pick<SpellLoadout, 'name' | 'description'>>) {
    setState((current) => ({
      ...current,
      loadouts: current.loadouts.map((loadout) =>
        loadout.id === loadoutId
          ? {
              ...loadout,
              ...data,
              name: data.name?.trim() || loadout.name,
              description:
                data.description === undefined
                  ? loadout.description
                  : data.description.trim(),
              updatedAt: new Date().toISOString(),
            }
          : loadout
      ),
    }))
  }

  function deleteLoadout(loadoutId: string) {
    setState((current) => {
      const nextLoadouts = current.loadouts.filter(
        (loadout) => loadout.id !== loadoutId
      )

      return {
        loadouts: nextLoadouts,
        activeLoadoutId:
          current.activeLoadoutId === loadoutId
            ? nextLoadouts[0]?.id ?? null
            : current.activeLoadoutId,
      }
    })
  }

  function setActiveLoadout(loadoutId: string) {
    setState((current) => ({
      ...current,
      activeLoadoutId: loadoutId,
    }))
  }

  function addSpellToLoadout(loadoutId: string, spellName: string) {
    const spellKey = normalizeSpellName(spellName)

    setState((current) => ({
      ...current,
      loadouts: current.loadouts.map((loadout) => {
        if (loadout.id !== loadoutId) return loadout

        const exists = loadout.spellNames
          .map(normalizeSpellName)
          .includes(spellKey)

        if (exists) return loadout

        return {
          ...loadout,
          spellNames: [...loadout.spellNames, spellName],
          updatedAt: new Date().toISOString(),
        }
      }),
    }))
  }

  function removeSpellFromLoadout(loadoutId: string, spellName: string) {
    const spellKey = normalizeSpellName(spellName)

    setState((current) => ({
      ...current,
      loadouts: current.loadouts.map((loadout) =>
        loadout.id === loadoutId
          ? {
              ...loadout,
              spellNames: loadout.spellNames.filter(
                (item) => normalizeSpellName(item) !== spellKey
              ),
              updatedAt: new Date().toISOString(),
            }
          : loadout
      ),
    }))
  }

  function toggleSpellInActiveLoadout(spellName: string) {
    if (!activeLoadout) return

    const spellKey = normalizeSpellName(spellName)

    if (activeSpellSet.has(spellKey)) {
      removeSpellFromLoadout(activeLoadout.id, spellName)
      return
    }

    addSpellToLoadout(activeLoadout.id, spellName)
  }

  function isInActiveLoadout(spellName: string) {
    return activeSpellSet.has(normalizeSpellName(spellName))
  }

  return {
    isReady,
    loadouts: state.loadouts,
    activeLoadout,
    activeLoadoutId: state.activeLoadoutId,
    createLoadout,
    updateLoadout,
    deleteLoadout,
    setActiveLoadout,
    addSpellToLoadout,
    removeSpellFromLoadout,
    toggleSpellInActiveLoadout,
    isInActiveLoadout,
  }
}
