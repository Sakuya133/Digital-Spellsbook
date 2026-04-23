import { SpellLibraryClient, type SpellItem } from '@/components/spells/spell-library-client'

type SearchParams = Promise<{
  q?: string | string[]
  page?: string | string[]
}>

type SpellSchool = {
  name?: string
  key?: string
}

type SpellClass = {
  name?: string
  key?: string
}

type Open5eSpell = {
  name: string
  level_int?: number | null
  school?: SpellSchool | null
  classes?: SpellClass[] | null
  ritual?: boolean | null
  concentration?: boolean | null
  casting_time?: string | null
  range?: string | null
  duration?: string | null
}

type SpellListResponse = {
  next?: string | null
  previous?: string | null
  results?: Open5eSpell[]
}

function pickFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

function normalizeSpells(data: Open5eSpell[]): SpellItem[] {
  return data.map((spell) => ({
    name: spell.name,
    level_int: spell.level_int ?? null,
    school: spell.school?.name ?? 'Unknown school',
    schoolKey: spell.school?.key ?? 'UNKNOWN',
    classes: Array.isArray(spell.classes)
      ? spell.classes.map((item) => item.name ?? 'Unknown class')
      : [],
    ritual: spell.ritual ?? false,
    concentration: spell.concentration ?? false,
    casting_time: spell.casting_time ?? '—',
    range: spell.range ?? '—',
    duration: spell.duration ?? '—',
  }))
}

async function getSpells(q: string, page: number) {
  const url = new URL('https://api.open5e.com/v2/spells/')

  if (q) {
    url.searchParams.set('name__icontains', q)
  }

  url.searchParams.set('page', String(page))

  const res = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch spells.')
  }

  return (await res.json()) as SpellListResponse
}

export default async function SpellsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const resolvedSearchParams = await searchParams
  const q = pickFirst(resolvedSearchParams.q).trim()
  const rawPage = Number.parseInt(
    pickFirst(resolvedSearchParams.page) || '1',
    10
  )
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  const data = await getSpells(q, page)
  const spells = normalizeSpells(Array.isArray(data.results) ? data.results : [])

  return (
    <SpellLibraryClient
      initialSpells={spells}
      page={page}
      hasNext={Boolean(data.next)}
      initialQuery={q}
    />
  )
}