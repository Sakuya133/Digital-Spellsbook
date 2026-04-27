import { notFound } from 'next/navigation'
import { SpellBookDetail, type SpellDetailItem } from '../../../components/spells/spell-book-detail'

type Params = Promise<{
  name: string
}>

type SpellSchool = {
  name?: string
  key?: string
}

type SpellClass = {
  name?: string
  key?: string
}

type Open5eSpellDetail = {
  name: string
  level_int?: number | null
  school?: SpellSchool | null
  classes?: SpellClass[] | null
  desc?: string | string[] | null
  higher_level?: string | string[] | null
  casting_time?: string | null
  range?: string | null
  duration?: string | null
  components?: string | string[] | null
  material?: string | null
  ritual?: boolean | null
  concentration?: boolean | null
}

type SpellDetailResponse = {
  results?: Open5eSpellDetail[]
}

function normalizeText(value: string | string[] | null | undefined) {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean)
  }

  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeComponents(value: string | string[] | null | undefined) {
  if (!value) return '—'
  if (Array.isArray(value)) return value.join(', ')
  return value
}

function normalizeSpell(raw: Open5eSpellDetail): SpellDetailItem {
  return {
    name: raw.name,
    level_int: raw.level_int ?? null,
    school: raw.school?.name ?? 'Unknown school',
    schoolKey: raw.school?.key ?? 'UNKNOWN',
    classes: Array.isArray(raw.classes)
      ? raw.classes.map((item) => item.name ?? 'Unknown class')
      : [],
    description: normalizeText(raw.desc),
    higherLevel: normalizeText(raw.higher_level),
    casting_time: raw.casting_time ?? '—',
    range: raw.range ?? '—',
    duration: raw.duration ?? '—',
    components: normalizeComponents(raw.components),
    material: raw.material ?? '—',
    ritual: raw.ritual ?? false,
    concentration: raw.concentration ?? false,
  }
}

async function getSpellByName(name: string) {
  const url = new URL('https://api.open5e.com/v2/spells/')
  url.searchParams.set('name__iexact', name)

  const res = await fetch(url.toString(), {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch spell detail.')
  }

  const data = (await res.json()) as SpellDetailResponse
  const results = Array.isArray(data.results) ? data.results : []

  return results[0] ?? null
}

export default async function SpellDetailPage({
  params,
}: {
  params: Params
}) {
  const { name } = await params
  const spell = await getSpellByName(name)

  if (!spell) {
    notFound()
  }

  const normalizedSpell = normalizeSpell(spell)

  return <SpellBookDetail spell={normalizedSpell} />
}