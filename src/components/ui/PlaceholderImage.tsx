import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { CUISINES } from '@/constants/cuisines'
import { CharacterPairId, CuisineId } from '@/types/character'

// ---------------------------------------------------------------------------
// PlaceholderImage — stand-in for all five asset types while real artwork is
// pending.  To swap in real assets later, replace <PlaceholderImage> with
// <Image> from expo-image using the same dimensions and asset path.
// ---------------------------------------------------------------------------

type PlaceholderType =
  | 'character-hero'
  | 'character-face'
  | 'recipe'
  | 'stamp'
  | 'cuisine-card'

interface Props {
  type: PlaceholderType

  // Character-specific --------------------------------------------------
  characterId?: CharacterPairId
  memberIndex?: number // which member of the pair (0-based, defaults to 0)

  // Recipe-specific -----------------------------------------------------
  title?:      string
  cuisineId?:  CuisineId

  // Stamp-specific ------------------------------------------------------
  emoji?: string   // preferred — shows as the stamp motif
  label?: string   // fallback text if no emoji (2–3 chars works best)

  // Sizing --------------------------------------------------------------
  /** Sets both width & height (square types / circles). Overridden by explicit width/height. */
  size?:   number
  width?:  number
  height?: number

  style?: ViewStyle
}

// ---- helpers -----------------------------------------------------------

/** Extract initials from a pair's display name.
 *  "Marco & Lily" → "ML", "Elsa, Kit & Finn" → "EKF" */
function pairInitials(displayName: string): string {
  return displayName
    .split(/[,&]+/)
    .map(s => s.trim().charAt(0))
    .filter(Boolean)
    .join('')
}

/** Fallback colour when a cuisineId isn't in the catalogue. */
const FALLBACK_CUISINE = { bg: colors.gray[100], text: colors.gray[600] }

function cuisineStyle(cuisineId?: CuisineId) {
  if (!cuisineId) return FALLBACK_CUISINE
  return CUISINES[cuisineId]
    ? { bg: CUISINES[cuisineId].accentBg, text: CUISINES[cuisineId].accentText }
    : FALLBACK_CUISINE
}

// ---- component ---------------------------------------------------------

export function PlaceholderImage({
  type,
  characterId,
  memberIndex = 0,
  title,
  cuisineId,
  emoji,
  label,
  size,
  width: explicitWidth,
  height: explicitHeight,
  style,
}: Props) {
  // Resolve dimensions ---------------------------------------------------
  const resolvedWidth  = explicitWidth  ?? size ?? DEFAULT_SIZES[type].width
  const resolvedHeight = explicitHeight ?? size ?? DEFAULT_SIZES[type].height

  const containerStyle: ViewStyle = {
    width:  resolvedWidth,
    height: resolvedHeight,
  }

  switch (type) {
    // -- character-hero --------------------------------------------------
    case 'character-hero': {
      const pair     = characterId ? CHARACTER_PAIRS[characterId] : null
      const member   = pair?.members[memberIndex] ?? null
      const accentBg = pair?.accentBg ?? colors.coral[50]
      const accent   = pair?.accentColor ?? colors.coral[400]

      return (
        <View style={[styles.hero, containerStyle, { backgroundColor: accentBg }, style]}>
          {/* large initial */}
          <Text style={[styles.heroInitial, { color: accent }]}>
            {member?.name?.charAt(0) ?? '?'}
          </Text>
          {/* member name */}
          <Text style={[styles.heroName, { color: accent }]}>
            {member?.name ?? (pair ? pair.displayName : 'Character')}
          </Text>
          {/* pair context line */}
          {pair && (
            <Text style={[styles.heroPair, { color: accent }]}>
              {pair.displayName}
            </Text>
          )}
        </View>
      )
    }

    // -- character-face --------------------------------------------------
    case 'character-face': {
      const pair   = characterId ? CHARACTER_PAIRS[characterId] : null
      const accent = pair?.accentColor ?? colors.coral[400]
      const bg     = pair?.accentBg ?? colors.coral[50]

      return (
        <View style={[styles.face, containerStyle, { backgroundColor: bg, borderColor: accent }, style]}>
          <Text style={[styles.faceInitials, { color: accent }]}>
            {pair ? pairInitials(pair.displayName) : '?'}
          </Text>
        </View>
      )
    }

    // -- recipe ----------------------------------------------------------
    case 'recipe': {
      const cuisine = cuisineStyle(cuisineId)
      const c       = cuisineId ? CUISINES[cuisineId] : null

      return (
        <View style={[styles.recipe, containerStyle, { backgroundColor: cuisine.bg }, style]}>
          {/* flag / emoji */}
          <Text style={styles.recipeEmoji}>
            {c?.flagEmoji ?? '🍽️'}
          </Text>
          {/* cuisine label */}
          {c && (
            <Text style={[styles.recipeCuisine, { color: cuisine.text }]}>
              {c.name}
            </Text>
          )}
          {/* recipe title */}
          <Text style={[styles.recipeTitle, { color: cuisine.text }]} numberOfLines={2}>
            {title ?? 'Recipe'}
          </Text>
        </View>
      )
    }

    // -- stamp -----------------------------------------------------------
    case 'stamp': {
      const cuisine = cuisineStyle(cuisineId)

      return (
        <View style={[styles.stamp, containerStyle, { borderColor: cuisine.text, backgroundColor: cuisine.bg }, style]}>
          {emoji ? (
            <Text style={styles.stampEmoji}>{emoji}</Text>
          ) : (
            <Text style={[styles.stampLabel, { color: cuisine.text }]}>
              {label ?? '?'}
            </Text>
          )}
        </View>
      )
    }

    // -- cuisine-card ----------------------------------------------------
    case 'cuisine-card': {
      const cuisine = cuisineStyle(cuisineId)
      const c       = cuisineId ? CUISINES[cuisineId] : null

      return (
        <View style={[styles.cuisineCard, containerStyle, { backgroundColor: cuisine.bg }, style]}>
          <Text style={styles.cuisineEmoji}>
            {c?.flagEmoji ?? '🌍'}
          </Text>
          <Text style={[styles.cuisineName, { color: cuisine.text }]}>
            {c?.name ?? 'Cuisine'}
          </Text>
          {c && (
            <Text style={[styles.cuisineCountry, { color: cuisine.text }]}>
              {c.country}
            </Text>
          )}
        </View>
      )
    }

    default:
      return null
  }
}

// ---- default dimensions per type ----------------------------------------

const DEFAULT_SIZES: Record<PlaceholderType, { width: number; height: number }> = {
  'character-hero': { width: 160, height: 200 },
  'character-face': { width: 48,  height: 48 },
  recipe:           { width: 320, height: 180 },
  stamp:            { width: 64,  height: 64 },
  'cuisine-card':   { width: 280, height: 160 },
}

// ---- styles -------------------------------------------------------------

const styles = StyleSheet.create({
  /* character-hero ---------------------------------------------------- */
  hero: {
    borderRadius: radius.lg,
    alignItems:    'center',
    justifyContent: 'center',
    padding:        spacing[4],
  },
  heroInitial: {
    fontSize:   56,
    fontWeight: '700',
    lineHeight:  64,
  },
  heroName: {
    ...typography.h2,
    marginTop:  spacing[2],
  },
  heroPair: {
    ...typography.bodySm,
    marginTop: spacing[1],
    opacity:   0.7,
  },

  /* character-face ---------------------------------------------------- */
  face: {
    borderRadius:  radius.full,
    borderWidth:   2,
    alignItems:    'center',
    justifyContent: 'center',
  },
  faceInitials: {
    ...typography.h2,
  },

  /* recipe ------------------------------------------------------------ */
  recipe: {
    borderRadius: radius.lg,
    padding:      spacing[4],
    justifyContent: 'flex-end',
  },
  recipeEmoji: {
    fontSize:   40,
    marginBottom: spacing[2],
  },
  recipeCuisine: {
    ...typography.label,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom:   spacing[1],
    opacity:        0.7,
  },
  recipeTitle: {
    ...typography.h1,
  },

  /* stamp ------------------------------------------------------------- */
  stamp: {
    borderRadius:  radius.full,
    borderWidth:   2,
    alignItems:    'center',
    justifyContent: 'center',
    borderStyle:   'dashed' as const,
  },
  stampEmoji: {
    fontSize: 24,
  },
  stampLabel: {
    ...typography.h2,
    textTransform: 'uppercase',
    letterSpacing:  1,
  },

  /* cuisine-card ------------------------------------------------------ */
  cuisineCard: {
    borderRadius: radius.lg,
    padding:      spacing[4],
    alignItems:   'center',
    justifyContent: 'center',
  },
  cuisineEmoji: {
    fontSize:     40,
    marginBottom: spacing[2],
  },
  cuisineName: {
    ...typography.h2,
    marginBottom: spacing[1],
  },
  cuisineCountry: {
    ...typography.bodySm,
    opacity: 0.7,
  },
})
