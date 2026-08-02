// Adds CULTURE_COUNTRY, CULTURE_FLAG, CULTURE_AGE_2_TO_4, CULTURE_AGE_5_TO_8, CULTURE_AGE_9_TO_12
// columns to the recipe CSV. Country and flag are pre-filled from cuisine data; age facts left blank.
// Usage: npx tsx scripts/add-culture-columns.ts

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'csv-parse/sync'

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')
const CSV_PATH = resolve(ROOT, 'docs', 'recipes-template.csv')

// Cuisine → country + flag lookup
const CUISINE_META: Record<string, { country: string; flag: string }> = {
  italian:      { country: 'Italy',        flag: '🇮🇹' },
  japanese:     { country: 'Japan',        flag: '🇯🇵' },
  moroccan:     { country: 'Morocco',      flag: '🇲🇦' },
  mexican:      { country: 'Mexico',       flag: '🇲🇽' },
  indian:       { country: 'India',        flag: '🇮🇳' },
  lebanese:     { country: 'Lebanon',      flag: '🇱🇧' },
  korean:       { country: 'South Korea',  flag: '🇰🇷' },
  greek:        { country: 'Greece',       flag: '🇬🇷' },
  peruvian:     { country: 'Peru',         flag: '🇵🇪' },
  ethiopian:    { country: 'Ethiopia',     flag: '🇪🇹' },
  thai:         { country: 'Thailand',     flag: '🇹🇭' },
  'west-african': { country: 'West Africa', flag: '🌍' },
  french:       { country: 'France',       flag: '🇫🇷' },
  spanish:      { country: 'Spain',        flag: '🇪🇸' },
}

// ── Parse ───────────────────────────────────────────────────────────────────────

const raw = readFileSync(CSV_PATH, 'utf-8')

// Keep metadata rows (1-3) as-is; parse from row 4 onward
const lines = raw.split(/\r?\n/)

// Find header row index (first row with RECIPE_ID)
let headerIdx = -1
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('RECIPE_ID,')) { headerIdx = i; break }
}
if (headerIdx < 0) {
  console.error('Could not find header row')
  process.exit(1)
}

const metadataLines = lines.slice(0, headerIdx)

// Parse only the data portion
const dataRaw = lines.slice(headerIdx).join('\n')
const rows: Record<string, string>[] = parse(dataRaw, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
})

// ── Add culture columns ────────────────────────────────────────────────────────

const CULTURE_COLS = [
  'CULTURE_COUNTRY',
  'CULTURE_FLAG',
  'CULTURE_AGE_2_TO_4',
  'CULTURE_AGE_5_TO_8',
  'CULTURE_AGE_9_TO_12',
]

// Find position to insert — after KID_ADAPTATION_AGE_NOTES, before IMAGE_FILENAME
const firstRow = rows[0] as Record<string, string>
const existingCols = Object.keys(firstRow)
const insertAfter = existingCols.findIndex((c) => c === 'KID_ADAPTATION_AGE_NOTES')
if (insertAfter < 0) {
  console.error('Could not find KID_ADAPTATION_AGE_NOTES column')
  process.exit(1)
}

const newRows = rows.map((row: Record<string, string>) => {
  const cuisineId = (row.CUISINE_ID || '').trim()
  const meta = CUISINE_META[cuisineId] || { country: '', flag: '' }

  const entries = Object.entries(row)
  const newEntries: [string, string][] = []

  for (const [key, value] of entries) {
    newEntries.push([key, value])
    if (key === 'KID_ADAPTATION_AGE_NOTES') {
      newEntries.push(['CULTURE_COUNTRY', meta.country])
      newEntries.push(['CULTURE_FLAG', meta.flag])
      newEntries.push(['CULTURE_AGE_2_TO_4', ''])
      newEntries.push(['CULTURE_AGE_5_TO_8', ''])
      newEntries.push(['CULTURE_AGE_9_TO_12', ''])
    }
  }

  return Object.fromEntries(newEntries)
})

// ── Write ──────────────────────────────────────────────────────────────────────

// Build CSV manually to avoid extra dependency
const headers = Object.keys(newRows[0])
const csvLines = [headers.join(',')]

for (const row of newRows) {
  const values = headers.map((h) => {
    const v = (row[h] ?? '') as string
    // Quote fields that contain commas, quotes, or newlines
    if (v.includes(',') || v.includes('"') || v.includes('\n')) {
      return `"${v.replace(/"/g, '""')}"`
    }
    return v
  })
  csvLines.push(values.join(','))
}

const allLines = [...metadataLines, ...csvLines, '']

writeFileSync(CSV_PATH, allLines.join('\n'), 'utf-8')

// Summary
console.log(`Added 5 culture columns after KID_ADAPTATION_AGE_NOTES`)
console.log(`Country + flag pre-filled for ${newRows.length} recipes`)
console.log('Age-specific fact columns (CULTURE_AGE_2_TO_4, CULTURE_AGE_5_TO_8, CULTURE_AGE_9_TO_12) left blank for you to fill.')
