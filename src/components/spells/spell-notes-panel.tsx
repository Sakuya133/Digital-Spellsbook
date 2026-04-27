'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSpellNote } from '@/lib/spell-notes'

type SpellNotesPanelProps = {
  spellName: string
}

function formatDate(value: string | null) {
  if (!value) return 'Not saved yet'

  try {
    return new Intl.DateTimeFormat('en', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return 'Saved'
  }
}

export function SpellNotesPanel({ spellName }: SpellNotesPanelProps) {
  const { isReady, note, updatedAt, updateNote, clearNote } =
    useSpellNote(spellName)

  const [draft, setDraft] = useState(note)

  const hasUnsavedChanges = draft !== note

  const characterCount = useMemo(() => draft.length, [draft])

  if (!isReady) {
    return (
      <div className="rounded-[24px] border border-black/10 bg-black/5 p-5">
        <p className="text-sm text-stone-700">Loading notes...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-[24px] border border-black/10 bg-black/5 p-5"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-stone-900">Personal Notes</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">
            {formatDate(updatedAt)}
          </p>
        </div>

        <span className="rounded-full border border-stone-500/25 bg-stone-100/70 px-3 py-1 text-xs text-stone-700">
          {characterCount} chars
        </span>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={`Write your notes for ${spellName}...`}
        className="min-h-40 w-full resize-y rounded-2xl border border-stone-500/25 bg-stone-100/70 px-4 py-3 text-sm leading-7 text-stone-900 outline-none placeholder:text-stone-500 focus:border-amber-700/40"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-stone-600">
          {hasUnsavedChanges
            ? 'Unsaved changes'
            : note
              ? 'Notes saved in this browser'
              : 'No notes yet'}
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setDraft('')
              clearNote()
            }}
            disabled={!note && !draft}
            className="rounded-full border border-stone-500/25 bg-stone-100/70 px-4 py-2 text-xs font-medium text-stone-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => updateNote(draft)}
            disabled={!hasUnsavedChanges}
            className="rounded-full border border-amber-700/25 bg-amber-200 px-4 py-2 text-xs font-medium text-amber-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Note
          </button>
        </div>
      </div>
    </motion.div>
  )
}