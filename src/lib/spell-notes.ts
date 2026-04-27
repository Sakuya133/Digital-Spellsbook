'use client'

import { useEffect, useMemo, useState } from 'react'

type SpellNote = {
  content: string
  updatedAt: string
}

type SpellNotesState = Record<string, SpellNote>

const STORAGE_KEY = 'book-of-all-knowing:spell-notes:v1'

function normalizeSpellName(name: string) {
  return name.trim().toLowerCase()
}

function readStorage(): SpellNotesState {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') return {}

    return parsed as SpellNotesState
  } catch {
    return {}
  }
}

function writeStorage(state: SpellNotesState) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useSpellNote(spellName: string) {
  const [notes, setNotes] = useState<SpellNotesState>({})
  const [isReady, setIsReady] = useState(false)

  const noteKey = useMemo(() => normalizeSpellName(spellName), [spellName])
  const currentNote = notes[noteKey]

  useEffect(() => {
    setNotes(readStorage())
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    writeStorage(notes)
  }, [notes, isReady])

  function updateNote(content: string) {
    setNotes((current) => ({
      ...current,
      [noteKey]: {
        content,
        updatedAt: new Date().toISOString(),
      },
    }))
  }

  function clearNote() {
    setNotes((current) => {
      const next = { ...current }
      delete next[noteKey]
      return next
    })
  }

  return {
    isReady,
    note: currentNote?.content ?? '',
    updatedAt: currentNote?.updatedAt ?? null,
    updateNote,
    clearNote,
  }
}