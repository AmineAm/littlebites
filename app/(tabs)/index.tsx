// S5 — Home Dashboard
// Figma: P01-S5 | Auth required: Yes
import { useMemo } from 'react'
import {
  View, Text, StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CUISINES } from '@/constants/cuisines'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { useCharacter } from '@/hooks/useCharacter'
import { useUnlock } from '@/hooks/useUnlock'
import { useMealPlan } from '@/hooks/useMealPlan'
import { useAuthStore } from '@/store/auth.store'
import { useCharacterStore } from '@/store/character.store'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { CuisineId, CharacterPairId } from '@/types/character'

// ── S5 Main Screen ────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const { activePair } = useCharacter()
  const { nextUnlockTarget } = useUnlock()
  const { currentPlan } = useMealPlan()
  const user = useAuthStore((s) => s.user)
  const milestones = useCharacterStore((s) => s.milestones)

  const adventureCuisineId: CuisineId = (user?.homeCuisine as CuisineId) ?? 'italian'
  const adventureCuisine = CUISINES[adventureCuisineId]

  const mealsPlanned = useMemo(() => {
    if (!currentPlan) return 0
    let count = 0
    for (const day of Object.values(currentPlan.days)) {
      if (day.breakfast) count++
      if (day.lunch) count++
      if (day.dinner) count++
    }
    return count
  }, [currentPlan])

  // Tonight's dinner — first non-empty dinner slot this week, or undefined
  const tonightsDinner = useMemo(() => {
    if (!currentPlan) return undefined
    const today = new Date().getDay()
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
    const todayKey = days[today]
    const dinnerRecipeId = currentPlan.days[todayKey]?.dinner
    if (dinnerRecipeId) return dinnerRecipeId
    // Fallback: find first non-empty dinner this week
    for (const d of days) {
      if (currentPlan.days[d]?.dinner) return currentPlan.days[d].dinner
    }
    return undefined
  }, [currentPlan])

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <CharacterHero
        pairId={activePair.id}
        displayName={activePair.displayName}
        tagline={activePair.tagline}
        accentColor={activePair.accentColor}
        accentBg={activePair.accentBg}
      />

      <View style={styles.content}>
        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <StatCard
            label="Meals planned"
            value={String(mealsPlanned)}
            accentColor={colors.teal[400]}
            accentBg={colors.teal[50]}
          />
          <StatCard
            label="Passport stamps"
            value={String(milestones.passportStamps)}
            accentColor={colors.purple[400]}
            accentBg={colors.purple[50]}
          />
        </View>

        {/* ── Tonight's suggestion ── */}
        <RecipeSuggestionCard
          recipeId={tonightsDinner}
          accentColor={colors.teal[400]}
          accentBg={colors.teal[50]}
        />

        {/* ── Unlock progress (hidden if all pairs unlocked) ── */}
        {nextUnlockTarget && (
          <UnlockProgressCard
            pairId={nextUnlockTarget.pairId}
            type={nextUnlockTarget.type}
            current={nextUnlockTarget.current}
            required={nextUnlockTarget.required}
          />
        )}

        {/* ── Adventure teaser ── */}
        <AdventureTeaserCard
          cuisineId={adventureCuisineId}
          cuisineName={adventureCuisine.name}
          flagEmoji={adventureCuisine.flagEmoji}
          teaser={adventureCuisine.adventureTeaser}
        />
      </View>
    </SafeAreaView>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CharacterHero({
  pairId,
  displayName,
  tagline,
  accentColor,
  accentBg,
}: {
  pairId:       CharacterPairId
  displayName:  string
  tagline:      string
  accentColor:  string
  accentBg:     string
}) {
  const reducedMotion = useReducedMotion()
  const pair = CHARACTER_PAIRS[pairId]

  // Gentle floating animation for the silhouette placeholder
  const float = useSharedValue(0)
  if (!reducedMotion) {
    float.value = withRepeat(
      withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    )
  }

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }))

  return (
    <View style={[styles.hero, { backgroundColor: accentBg }]}>
      <LinearGradient
        colors={[accentColor, accentBg]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.heroGradient}
      >
        {/* Silhouette placeholder row */}
        <View style={styles.silhouetteRow}>
          {pair.members.map((member, i) => (
            <Animated.View
              key={member.name}
              style={[
                styles.silhouette,
                i === 0 && floatStyle,
              ]}
            />
          ))}
        </View>

        {/* Name + tagline */}
        <Text style={styles.heroName}>{displayName}</Text>
        <Text style={styles.heroTagline}>{tagline}</Text>
      </LinearGradient>
    </View>
  )
}

function StatCard({
  label,
  value,
  accentColor,
  accentBg,
}: {
  label:       string
  value:       string
  accentColor: string
  accentBg:    string
}) {
  return (
    <View style={[styles.statCard, { backgroundColor: accentBg }]}>
      <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

function RecipeSuggestionCard({
  recipeId,
  accentColor,
  accentBg,
}: {
  recipeId:    string | undefined
  accentColor: string
  accentBg:    string
}) {
  return (
    <View style={[styles.recipeCard, { borderLeftColor: accentColor }]}>
      <Text style={styles.recipeLabel}>Tonight's suggestion</Text>
      {recipeId
        ? (
          <Text style={styles.recipeTitle} numberOfLines={1}>
            Your planned dinner
          </Text>
        )
        : (
          <>
            <Text style={styles.recipeTitle}>
              Nothing planned yet
            </Text>
            <Text style={styles.recipeSub}>
              Tap Plan to add tonight's dinner
            </Text>
          </>
        )}
      <View style={[styles.matchBadge, { backgroundColor: accentBg }]}>
        <Text style={[styles.matchText, { color: accentColor }]}>
          {recipeId ? 'Planned' : 'Tap to start'}
        </Text>
      </View>
    </View>
  )
}

function UnlockProgressCard({
  pairId,
  type,
  current,
  required,
}: {
  pairId:   CharacterPairId
  type:     'meals' | 'cuisines' | 'stamps'
  current:  number
  required: number
}) {
  const target = CHARACTER_PAIRS[pairId]
  const label = type === 'meals'
    ? 'meals cooked'
    : type === 'cuisines'
      ? 'cuisines tried'
      : 'passport stamps'

  return (
    <View style={[styles.unlockCard, { backgroundColor: colors.amber[50] }]}>
      <View style={styles.unlockRow}>
        <View style={styles.unlockInfo}>
          <Text style={styles.unlockLabel}>Next unlock</Text>
          <Text style={styles.unlockName}>{target.displayName}</Text>
          <Text style={styles.unlockProgress}>
            {current}/{required} {label}
          </Text>
        </View>
        <View style={[styles.unlockAvatar, { backgroundColor: target.accentColor }]}>
          <Text style={styles.unlockAvatarText}>
            {target.members.map((m) => m.name.split(' ')[0]).join('+')}
          </Text>
        </View>
      </View>
    </View>
  )
}

function AdventureTeaserCard({
  cuisineId: _cuisineId,
  cuisineName,
  flagEmoji,
  teaser,
}: {
  cuisineId:   string
  cuisineName: string
  flagEmoji:   string
  teaser:      string
}) {
  return (
    <View style={[styles.adventureCard, { backgroundColor: colors.purple[50] }]}>
      <View style={styles.adventureHeader}>
        <Text style={styles.adventureFlag}>{flagEmoji}</Text>
        <Text style={styles.adventureCuisineName}>{cuisineName}</Text>
      </View>
      <Text style={styles.adventureTeaser} numberOfLines={2}>
        {teaser}
      </Text>
      <Text style={styles.adventureCta}>Explore this week →</Text>
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.linen,
  },

  // ── Hero ──
  hero: {
    flex: 0.28,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing[5],
    paddingHorizontal: spacing[6],
  },
  silhouetteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  silhouette: {
    width: 48,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  heroName: {
    ...typography.display,
    color: colors.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroTagline: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing[1],
    opacity: 0.85,
  },

  // ── Content area ──
  content: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    gap: spacing[3],
  },

  // ── Stats row ──
  statsRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  statValue: {
    ...typography.display,
  },
  statLabel: {
    ...typography.label,
    color: colors.gray[600],
    marginTop: spacing[1],
  },

  // ── Recipe suggestion card ──
  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    padding: spacing[4],
  },
  recipeLabel: {
    ...typography.overline,
    color: colors.gray[400],
  },
  recipeTitle: {
    ...typography.h2,
    color: colors.gray[900],
    marginTop: spacing[1],
  },
  recipeSub: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  matchBadge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    marginTop: spacing[3],
  },
  matchText: {
    ...typography.label,
  },

  // ── Unlock progress card ──
  unlockCard: {
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  unlockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unlockInfo: {
    flex: 1,
  },
  unlockLabel: {
    ...typography.overline,
    color: colors.amber[400],
  },
  unlockName: {
    ...typography.h2,
    color: colors.gray[900],
    marginTop: spacing[1],
  },
  unlockProgress: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing[1],
  },
  unlockAvatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unlockAvatarText: {
    ...typography.label,
    color: colors.white,
    fontSize: 9,
  },

  // ── Adventure teaser card ──
  adventureCard: {
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  adventureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  adventureFlag: {
    fontSize: 18,
  },
  adventureCuisineName: {
    ...typography.h2,
    color: colors.purple[800],
  },
  adventureTeaser: {
    ...typography.body,
    color: colors.gray[600],
  },
  adventureCta: {
    ...typography.label,
    color: colors.purple[400],
    marginTop: spacing[3],
  },
})
