'use client'

import { useEffect, useState } from 'react'

export type SpellSlotLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type SpellSlotState = Record<SpellSlotLevel, {
  max: number
  used: number
}>

const STORAGE_KEY = 'book-of-all-knowing:spell-slots:v1'
const STORAGE_EVENT = 'book-of-all-knowing:spell-slots-updated'

const emptySlots: SpellSlotState = {
  1: { max: 0, used: 0 },
  2: { max: 0, used: 0 },
  3: { max: 0, used: 0 },
  4: { max: 0, used: 0 },
  5: { max: 0, used: 0 },
  6: { max: 0, used: 0 },
  7: { max: 0, used: 0 },
  8: { max: 0, used: 0 },
  9: { max: 0, used: 0 },
}

const fullCasterSlotsByLevel: Record<number, number[]> = {
  1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
  13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
  15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
}

const halfCasterSlotsByLevel: Record<number, number[]> = {
  1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
  7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
  9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
  11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
  13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
  15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
  17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
  19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
  20: [4, 3, 3, 3, 2, 0, 0, 0, 0],
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function arrayToSlots(values: number[]): SpellSlotState {
  const result = { ...emptySlots }

  for (let i = 1; i <= 9; i++) {
    const level = i as SpellSlotLevel
    result[level] = {
      max: values[i - 1] ?? 0,
      used: 0,
    }
  }

  return result
}

export function suggestSlotsForClass(className: string, level: number) {
  const normalizedClass = className.toLowerCase()
  const safeLevel = clamp(level, 1, 20)

  if (
    normalizedClass.includes('paladin') ||
    normalizedClass.includes('ranger')
  ) {
    return arrayToSlots(halfCasterSlotsByLevel[safeLevel])
  }

  if (
    normalizedClass.includes('wizard') ||
    normalizedClass.includes('sorcerer') ||
    normalizedClass.includes('cleric') ||
    normalizedClass.includes('druid') ||
    normalizedClass.includes('bard')
  ) {
    return arrayToSlots(fullCasterSlotsByLevel[safeLevel])
  }

  if (normalizedClass.includes('warlock')) {
    return arrayToSlots([2, 0, 0, 0, 0, 0, 0, 0, 0])
  }

  return arrayToSlots(fullCasterSlotsByLevel[safeLevel])
}

function readStorage(): SpellSlotState {
  if (typeof window === 'undefined') return emptySlots

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySlots

    const parsed = JSON.parse(raw) as Partial<SpellSlotState>
    const result = { ...emptySlots }

    for (let i = 1; i <= 9; i++) {
      const level = i as SpellSlotLevel
      const item = parsed[level]

      result[level] = {
        max: clamp(Number(item?.max ?? 0), 0, 99),
        used: clamp(Number(item?.used ?? 0), 0, Number(item?.max ?? 0)),
      }
    }

    return result
  } catch {
    return emptySlots
  }
}

function writeStorage(state: SpellSlotState) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  window.dispatchEvent(new Event(STORAGE_EVENT))
}

export function useSpellSlots() {
  const [slots, setSlots] = useState<SpellSlotState>(emptySlots)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setSlots(readStorage())
    setIsReady(true)

    function handleExternalUpdate() {
      setSlots(readStorage())
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
    writeStorage(slots)
  }, [slots, isReady])

  function setMaxSlots(level: SpellSlotLevel, max: number) {
    setSlots((current) => ({
      ...current,
      [level]: {
        max: clamp(max, 0, 99),
        used: clamp(current[level].used, 0, clamp(max, 0, 99)),
      },
    }))
  }

  function useSlot(level: SpellSlotLevel) {
    setSlots((current) => ({
      ...current,
      [level]: {
        ...current[level],
        used: clamp(current[level].used + 1, 0, current[level].max),
      },
    }))
  }

  function restoreSlot(level: SpellSlotLevel) {
    setSlots((current) => ({
      ...current,
      [level]: {
        ...current[level],
        used: clamp(current[level].used - 1, 0, current[level].max),
      },
    }))
  }

  function resetUsedSlots() {
    setSlots((current) => {
      const next = { ...current }

      for (let i = 1; i <= 9; i++) {
        const level = i as SpellSlotLevel
        next[level] = {
          ...next[level],
          used: 0,
        }
      }

      return next
    })
  }

  function applySuggestedSlots(className: string, level: number) {
    setSlots(suggestSlotsForClass(className, level))
  }

  return {
    slots,
    isReady,
    setMaxSlots,
    useSlot,
    restoreSlot,
    resetUsedSlots,
    applySuggestedSlots,
  }
}
