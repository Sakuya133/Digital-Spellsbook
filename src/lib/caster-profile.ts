'use client'

import { useEffect, useState } from 'react'

export type CasterTheme =
  | 'Arcane'
  | 'Forbidden'
  | 'Divine'
  | 'Fey'
  | 'Infernal'
  | 'Nature'

export type CasterProfile = {
  characterName: string
  className: string
  subclass: string
  level: number
  theme: CasterTheme
  updatedAt: string | null
}

const STORAGE_KEY = 'book-of-all-knowing:caster-profile:v1'

const defaultProfile: CasterProfile = {
  characterName: 'Unnamed Caster',
  className: 'Wizard',
  subclass: 'None',
  level: 1,
  theme: 'Arcane',
  updatedAt: null,
}

function readProfile(): CasterProfile {
  if (typeof window === 'undefined') return defaultProfile

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProfile

    const parsed = JSON.parse(raw) as Partial<CasterProfile>

    return {
      characterName: parsed.characterName || defaultProfile.characterName,
      className: parsed.className || defaultProfile.className,
      subclass: parsed.subclass || defaultProfile.subclass,
      level:
        typeof parsed.level === 'number' && parsed.level >= 1
          ? parsed.level
          : defaultProfile.level,
      theme: parsed.theme || defaultProfile.theme,
      updatedAt: parsed.updatedAt || null,
    }
  } catch {
    return defaultProfile
  }
}

function writeProfile(profile: CasterProfile) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function useCasterProfile() {
  const [profile, setProfile] = useState<CasterProfile>(defaultProfile)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setProfile(readProfile())
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return
    writeProfile(profile)
  }, [profile, isReady])

  function updateProfile(nextProfile: Partial<CasterProfile>) {
    setProfile((current) => ({
      ...current,
      ...nextProfile,
      updatedAt: new Date().toISOString(),
    }))
  }

  function resetProfile() {
    setProfile({
      ...defaultProfile,
      updatedAt: new Date().toISOString(),
    })
  }

  return {
    profile,
    isReady,
    updateProfile,
    resetProfile,
  }
}