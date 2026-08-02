// seeds Firestore with recipes from docs/recipes-template.csv and cuisines from constants.
// Usage: npx tsx scripts/import-recipes.ts [--dry-run]
// Requires: service-account.json in project root or GOOGLE_APPLICATION_CREDENTIALS env var.

import { parse } from 'csv-parse/sync'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

// ── Config ──────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url)
const ROOT = resolve(dirname(__filename), '..')
const CSV_PATH = resolve(ROOT, 'docs', 'recipes-template.csv')
const SERVICE_ACCOUNT_PATH =
  process.env.GOOGLE_APPLICATION_CREDENTIALS
  || resolve(ROOT, 'service-account.json')

const DRY_RUN = process.argv.includes('--dry-run')

type Allergy = 'nuts' | 'dairy' | 'gluten' | 'eggs' | 'soy' | 'shellfish' | 'fish' | 'sesame'
type NutritionTag = 'protein' | 'veg' | 'carbs' | 'dairy' | 'fruit'
type Difficulty = 'easy' | 'medium' | 'hard'

// ── Cuisine definitions (mirrored from src/constants/cuisines.ts) ───────────────

interface CuisineDoc {
  cuisineId:       string
  name:            string
  country:         string
  flagEmoji:       string
  launchWave:      1 | 2 | 3
  accentBg:        string
  accentText:      string
  adventureTeaser: string
}

const CUISINES: Record<string, CuisineDoc> = {
  italian:     { cuisineId:'italian',     name:'Italian',      country:'Italy',          flagEmoji:'🇮🇹', launchWave:1, accentBg:'#FFF3E0', accentText:'#8B4513', adventureTeaser:'From sun-dried tomatoes to fresh pasta — Italy on your table tonight.' },
  japanese:    { cuisineId:'japanese',    name:'Japanese',     country:'Japan',          flagEmoji:'🇯🇵', launchWave:1, accentBg:'#FCE4EC', accentText:'#880E4F', adventureTeaser:'Umami, balance, and a bento box full of wonder.' },
  moroccan:    { cuisineId:'moroccan',    name:'Moroccan',     country:'Morocco',        flagEmoji:'🇲🇦', launchWave:1, accentBg:'#E8F5E9', accentText:'#1B5E20', adventureTeaser:'Warm spices and slow-cooked magic from North Africa.' },
  mexican:     { cuisineId:'mexican',     name:'Mexican',      country:'Mexico',         flagEmoji:'🇲🇽', launchWave:1, accentBg:'#FFF8E1', accentText:'#F57F17', adventureTeaser:'Bold, bright, and made to be shared with your hands.' },
  indian:      { cuisineId:'indian',      name:'Indian',       country:'India',          flagEmoji:'🇮🇳', launchWave:1, accentBg:'#FBE9E7', accentText:'#BF360C', adventureTeaser:'A spice journey with something for every palate.' },
  lebanese:    { cuisineId:'lebanese',    name:'Lebanese',     country:'Lebanon',        flagEmoji:'🇱🇧', launchWave:1, accentBg:'#E3F2FD', accentText:'#0D47A1', adventureTeaser:'Fresh herbs, mezze, and the taste of the Mediterranean.' },
  korean:      { cuisineId:'korean',      name:'Korean',       country:'South Korea',    flagEmoji:'🇰🇷', launchWave:1, accentBg:'#FCE4EC', accentText:'#880E4F', adventureTeaser:'Bibimbap, banchan, and bold flavours for curious kids.' },
  greek:       { cuisineId:'greek',       name:'Greek',        country:'Greece',         flagEmoji:'🇬🇷', launchWave:1, accentBg:'#E3F2FD', accentText:'#0D47A1', adventureTeaser:'Sun, olives, and flavours from the Aegean coast.' },
  peruvian:    { cuisineId:'peruvian',    name:'Peruvian',     country:'Peru',           flagEmoji:'🇵🇪', launchWave:2, accentBg:'#E8EAF6', accentText:'#1A237E', adventureTeaser:'Where Inca tradition meets modern taste.' },
  ethiopian:   { cuisineId:'ethiopian',   name:'Ethiopian',    country:'Ethiopia',       flagEmoji:'🇪🇹', launchWave:2, accentBg:'#FFF3E0', accentText:'#E65100', adventureTeaser:'Eat with your hands and share something ancient.' },
  thai:        { cuisineId:'thai',        name:'Thai',         country:'Thailand',       flagEmoji:'🇹🇭', launchWave:2, accentBg:'#E8F5E9', accentText:'#1B5E20', adventureTeaser:'Sweet, sour, salty — Thai food hits all the notes.' },
  'west-african': { cuisineId:'west-african', name:'West African', country:'West Africa', flagEmoji:'🌍', launchWave:2, accentBg:'#FFF8E1', accentText:'#F57F17', adventureTeaser:'Rich stews and vibrant flavours from the heart of Africa.' },
  french:      { cuisineId:'french',      name:'French',       country:'France',         flagEmoji:'🇫🇷', launchWave:2, accentBg:'#F3E5F5', accentText:'#4A148C', adventureTeaser:'Oui chef! Classic French cooking made fun and family-friendly.' },
  spanish:     { cuisineId:'spanish',     name:'Spanish',      country:'Spain',          flagEmoji:'🇪🇸', launchWave:2, accentBg:'#FFEBEE', accentText:'#B71C1C', adventureTeaser:'Tapas, paella, and the spirit of a Spanish kitchen.' },
}

// ── Firebase init ──────────────────────────────────────────────────────────────

function initFirebase() {
  if (getApps().length > 0) return getFirestore()

  if (!existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('Service account file not found:', SERVICE_ACCOUNT_PATH)
    console.error('Download it from Firebase Console → Project Settings → Service Accounts → Generate new private key')
    console.error('Save it as service-account.json in the project root.')
    process.exit(1)
  }

  const sa = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'))
  initializeApp({ credential: cert(sa) })
  const db = getFirestore()
  db.settings({ ignoreUndefinedProperties: true })
  return db
}

const db = initFirebase()

// ── CSV parsing ────────────────────────────────────────────────────────────────

interface RawRow {
  RECIPE_ID:        string
  SOURCE:           string
  CUISINE_ID:       string
  TITLE:            string
  TITLE_ADAPTED:    string
  PREP_MINUTES:     string
  SERVINGS:         string
  DIFFICULTY:       string
  AGE_MIN:          string
  AGE_MAX:          string
  ALLERGENS:        string
  NUTRITION_TAGS:   string
  CORE_FLAVOURS:    string
  // INGREDIENT_N_*  — dynamic
  // STEP_N_*         — dynamic
  KID_ADAPTATION_REMOVE:        string
  KID_ADAPTATION_SUBSTITUTE:     string
  KID_ADAPTATION_PRESENTATION:   string
  KID_ADAPTATION_AGE_NOTES:      string
  IMAGE_FILENAME:   string
  SOURCE_RECIPE_ID: string
  REVIEWER_NAME:    string
  LAUNCH_WAVE:      string
  [key: string]:    string  // allow dynamic columns
}

function parseCsv(): RawRow[] {
  const raw = readFileSync(CSV_PATH, 'utf-8')

  // Find the actual header row (first row with RECIPE_ID as first column)
  const lines = raw.split(/\r?\n/)
  let headerIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('RECIPE_ID,')) { headerIdx = i; break }
  }
  if (headerIdx < 0) {
    console.error('Could not find header row in CSV')
    process.exit(1)
  }

  const dataRaw = lines.slice(headerIdx).join('\n')
  const allRows = parse(dataRaw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
  })

  return allRows.filter((r: Record<string, string>) => {
    const id = (r.RECIPE_ID || '').trim()
    return !!id
  }) as RawRow[]
}

// ── Transform helpers ──────────────────────────────────────────────────────────

function parseList(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) return []
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
}

function parseAllergens(raw: string | undefined): Allergy[] {
  return parseList(raw).filter((a): a is Allergy =>
    ['nuts','dairy','gluten','eggs','soy','shellfish','fish','sesame'].includes(a),
  )
}

function parseNutritionTags(raw: string | undefined): NutritionTag[] {
  return parseList(raw).filter((t): t is NutritionTag =>
    ['protein','veg','carbs','dairy','fruit'].includes(t),
  )
}

function parseIntSafe(raw: string | undefined, fallback: number): number {
  if (!raw || !raw.trim()) return fallback
  const n = parseInt(raw.trim(), 10)
  return Number.isFinite(n) ? n : fallback
}

function parseDifficulty(raw: string | undefined): Difficulty {
  const d = (raw || '').trim().toLowerCase()
  if (d === 'hard') return 'hard'
  if (d === 'medium') return 'medium'
  return 'easy'
}

function parseSource(raw: string | undefined): 'original' | 'adapted' | undefined {
  const s = (raw || '').trim().toLowerCase()
  if (s === 'original' || s === 'adapted') return s
  return undefined
}

function parseLaunchWave(raw: string | undefined): 1 | 2 | 3 {
  const n = parseIntSafe(raw, 1)
  return n === 2 ? 2 : n === 3 ? 3 : 1
}

function parseIngredients(row: RawRow): Array<{
  name:         string
  amount:       number
  unit:         string
  notes:        string | undefined
  isGlobal:     boolean
  substitution: string | undefined
}> {
  const ingredients: ReturnType<typeof parseIngredients> = []

  for (let i = 1; i <= 8; i++) {
    const name = (row[`INGREDIENT_${i}_NAME`] || '').trim()
    if (!name) continue

    const amountRaw = (row[`INGREDIENT_${i}_AMOUNT`] || '').trim()
    ingredients.push({
      name,
      amount:       amountRaw ? parseFloat(amountRaw) : 0,
      unit:         (row[`INGREDIENT_${i}_UNIT`] || 'g').trim(),
      notes:        (row[`INGREDIENT_${i}_NOTES`] || '').trim() || undefined,
      isGlobal:     (row[`INGREDIENT_${i}_IS_GLOBAL`] || '').trim().toLowerCase() === 'true',
      substitution: (row[`INGREDIENT_${i}_SUBSTITUTION`] || '').trim() || undefined,
    })
  }

  return ingredients
}

function parseSteps(row: RawRow): Array<{
  stepNumber:       number
  instruction:      string
  timerSeconds:     number | undefined
  kidParticipation: string | undefined
}> {
  const steps: ReturnType<typeof parseSteps> = []

  for (let i = 1; i <= 8; i++) {
    const instruction = (row[`STEP_${i}_INSTRUCTION`] || '').trim()
    if (!instruction) continue

    const timerRaw = (row[`STEP_${i}_TIMER_SECONDS`] || '').trim()

    steps.push({
      stepNumber:       steps.length + 1,
      instruction,
      timerSeconds:     timerRaw ? parseIntSafe(timerRaw, 0) : undefined,
      kidParticipation: (row[`STEP_${i}_KID_PARTICIPATION`] || '').trim() || undefined,
    })
  }

  return steps
}

function parseKidAdaptation(row: RawRow): {
  remove?:       string
  substitute?:   string
  presentation?: string
  ageNotes?:     string
} | undefined {
  const ka = {
    remove:       (row.KID_ADAPTATION_REMOVE || '').trim() || undefined,
    substitute:   (row.KID_ADAPTATION_SUBSTITUTE || '').trim() || undefined,
    presentation: (row.KID_ADAPTATION_PRESENTATION || '').trim() || undefined,
    ageNotes:     (row.KID_ADAPTATION_AGE_NOTES || '').trim() || undefined,
  }
  return Object.values(ka).some(Boolean) ? ka : undefined
}

function parseCultureCard(row: RawRow): {
  countryName: string
  flagEmoji:   string
  facts:       { age2to4: string; age5to8: string; age9to12: string }
} | undefined {
  const country = (row.CULTURE_COUNTRY || '').trim()
  const flag = (row.CULTURE_FLAG || '').trim()
  const age2to4 = (row.CULTURE_AGE_2_TO_4 || '').trim()
  const age5to8 = (row.CULTURE_AGE_5_TO_8 || '').trim()
  const age9to12 = (row.CULTURE_AGE_9_TO_12 || '').trim()

  if (!country && !flag && !age2to4 && !age5to8 && !age9to12) return undefined

  return {
    countryName: country || '',
    flagEmoji:   flag || '',
    facts:       { age2to4, age5to8, age9to12 },
  }
}

function buildSubstitutionsMap(
  ingredients: ReturnType<typeof parseIngredients>,
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const ing of ingredients) {
    if (ing.substitution) {
      map[ing.name] = ing.substitution
    }
  }
  return map
}

// ── Main import ────────────────────────────────────────────────────────────────

async function importRecipes() {
  const rows = parseCsv()
  console.log(`Parsed ${rows.length} recipes from CSV\n`)

  if (DRY_RUN) {
    console.log('── DRY RUN — nothing will be written ──\n')
  }

  // Validate
  const errors: string[] = []
  for (const row of rows) {
    if (!row.TITLE?.trim()) errors.push(`${row.RECIPE_ID}: missing TITLE`)
    if (!row.CUISINE_ID?.trim()) errors.push(`${row.RECIPE_ID}: missing CUISINE_ID`)
    const ingredients = parseIngredients(row)
    if (ingredients.length === 0) errors.push(`${row.RECIPE_ID}: no ingredients`)
    const steps = parseSteps(row)
    if (steps.length === 0) errors.push(`${row.RECIPE_ID}: no steps`)
  }
  if (errors.length > 0) {
    console.error('Validation errors:')
    for (const e of errors) console.error('  -', e)
    console.error('\nFix these before importing.')
    process.exit(1)
  }

  // Transform
  const recipes = rows.map((row) => {
    const ingredients = parseIngredients(row)
    const steps = parseSteps(row)
    const now = Timestamp.now()

    return {
      recipeId:      row.RECIPE_ID.trim(),
      title:         row.TITLE.trim(),
      titleAdapted:  row.TITLE_ADAPTED?.trim() || undefined,
      cuisineId:     row.CUISINE_ID.trim(),
      source:        parseSource(row.SOURCE),
      ageRange:      { min: parseIntSafe(row.AGE_MIN, 2), max: parseIntSafe(row.AGE_MAX, 12) },
      prepMinutes:   parseIntSafe(row.PREP_MINUTES, 20),
      difficulty:    parseDifficulty(row.DIFFICULTY),
      servings:      parseIntSafe(row.SERVINGS, 4),
      allergens:     parseAllergens(row.ALLERGENS),
      nutritionTags: parseNutritionTags(row.NUTRITION_TAGS),
      ingredients,
      steps,
      coreFlavours:  parseList(row.CORE_FLAVOURS),
      textures:      [] as string[],
      mainProteins:  ingredients.filter((i) => parseList(row.NUTRITION_TAGS).includes('protein') && i.amount > 0).map((i) => i.name),
      mainVeg:       ingredients.filter((i) => parseList(row.NUTRITION_TAGS).includes('veg') && i.amount > 0).map((i) => i.name),
      substitutions: buildSubstitutionsMap(ingredients),
      kidAdaptation: parseKidAdaptation(row),
      cultureCard:   parseCultureCard(row),
      imageFilename: row.IMAGE_FILENAME?.trim() || undefined,
      launchWave:    parseLaunchWave(row.LAUNCH_WAVE),
      createdAt:     now,
      updatedAt:     now,
    }
  })

  // Print summary
  console.log('Recipes to import:')
  for (const r of recipes) {
    const tags = [r.cuisineId, r.difficulty, `${r.ingredients.length} ingredients`, `${r.steps.length} steps`]
    console.log(`  ${r.recipeId.padEnd(32)} ${r.title.padEnd(36)} [${tags.join(', ')}]`)
  }

  if (DRY_RUN) {
    console.log('\nDry run complete. Run without --dry-run to import.')
    return
  }

  // ── Write to Firestore ──────────────────────────────────────────────────

  console.log('\nWriting to Firestore...')

  // Batch 1: recipes
  const recipeBatch = db.batch()
  for (const recipe of recipes) {
    const ref = db.collection('recipes').doc(recipe.recipeId)
    recipeBatch.set(ref, recipe)
  }
  await recipeBatch.commit()
  console.log(`  ✅ ${recipes.length} recipes written`)

  // Batch 2: cuisines
  const cuisineBatch = db.batch()
  const cuisineEntries = Object.values(CUISINES)
  for (const c of cuisineEntries) {
    const ref = db.collection('cuisines').doc(c.cuisineId)
    cuisineBatch.set(ref, {
      ...c,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  }
  await cuisineBatch.commit()
  console.log(`  ✅ ${cuisineEntries.length} cuisines written`)

  console.log('\nImport complete.')
}

importRecipes().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
