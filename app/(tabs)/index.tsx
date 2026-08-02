// Today — the default screen. Answers "what are we cooking tonight".
import { useEffect, useMemo, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Animated, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { colors, spacing, radius, typography, animation } from '@/constants/tokens'
import { CUISINES } from '@/constants/cuisines'
import { CHARACTER_PAIRS } from '@/constants/characters'
import { useCharacter } from '@/hooks/useCharacter'
import { useUnlock } from '@/hooks/useUnlock'
import { useMealPlan } from '@/hooks/useMealPlan'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useProfileStore } from '@/store/profile.store'
import { useCharacterStore } from '@/store/character.store'
import { usePlannerStore } from '@/store/planner.store'
import { deriveShoppingList } from '@/utils/shopping'
import { rankRecipes } from '@/utils/preference'
import { usePreferencesStore } from '@/store/preferences.store'
import { getRecipe, filterRecipes } from '@/data/recipes'
import { DAY_ORDER } from '@/types/planner'
import type { CuisineId, CharacterPairId } from '@/types/character'

export default function TodayScreen() {
  const router = useRouter()
  const { activePair } = useCharacter()
  const { nextUnlockTarget } = useUnlock()
  const { plan, mealsPlanned, plannedRecipes, weekId } = useMealPlan()

  const child    = useProfileStore((s) => s.child)
  const settings = useProfileStore((s) => s.settings)
  const passport = useCharacterStore((s) => s.passport)
  const checked  = usePlannerStore((s) => s.checked[weekId] ?? [])

  const liked          = usePreferencesStore((s) => s.liked)
  const disliked       = usePreferencesStore((s) => s.disliked)
  const cuisineHistory = usePreferencesStore((s) => s.cuisineHistory)

  const homeCuisineId: CuisineId = settings.homeCuisine ?? 'italian'
  const adventureCuisine = CUISINES[homeCuisineId]

  // Tonight's dinner — today's slot if filled, else a preference-appropriate pick
  const tonight = useMemo(() => {
    const todayKey = DAY_ORDER[(new Date().getDay() + 6) % 7]  // JS Sunday=0 → ISO Monday=0
    const planned = plan.days[todayKey]?.dinner
    if (planned) return { recipe: getRecipe(planned), planned: true }

    // Nothing planned — rank what's safe and age-appropriate by taste.
    const safe = filterRecipes({
      ageBand:   child?.ageBand,
      allergies: child?.allergies,
    })
    const ranked = rankRecipes(
      safe,
      { liked, disliked, cuisineHistory },
      child?.allergies ?? [],
    )
    return { recipe: ranked[0]?.recipe ?? null, planned: false }
  }, [plan, child, liked, disliked, cuisineHistory])

  const shoppingCount = useMemo(() => {
    const groups = deriveShoppingList(plan, plannedRecipes)
    const total = groups.reduce((n, g) => n + g.items.length, 0)
    return total - checked.length
  }, [plan, plannedRecipes, checked])

  const stampCount = Object.keys(passport.stamps).length
  const greeting = child?.name ? `${child.name}'s kitchen` : 'Your kitchen'

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <CharacterHero
        pairId={activePair.id}
        displayName={activePair.displayName}
        tagline={greeting}
        accentColor={activePair.accentColor}
        accentBg={activePair.accentBg}
        onSettings={() => router.push('/settings')}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard
            label="Meals planned"
            value={String(mealsPlanned)}
            accentColor={colors.teal[400]}
            accentBg={colors.teal[50]}
            onPress={() => router.push('/(tabs)/plan')}
          />
          <StatCard
            label="Passport stamps"
            value={String(stampCount)}
            accentColor={colors.purple[400]}
            accentBg={colors.purple[50]}
            onPress={() => router.push('/(tabs)/passport')}
          />
        </View>

        {/* ── Tonight ── */}
        <Pressable
          style={styles.recipeCard}
          onPress={() => tonight.recipe && router.push(`/recipe/${tonight.recipe.recipeId}`)}
          accessibilityRole="button"
        >
          <Text style={styles.recipeLabel}>
            {tonight.planned ? "Tonight's dinner" : 'Suggested for tonight'}
          </Text>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {tonight.recipe?.title ?? 'Nothing planned yet'}
          </Text>
          {tonight.recipe && (
            <Text style={styles.recipeSub}>
              {tonight.recipe.prepMinutes} min · {tonight.recipe.difficulty}
            </Text>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {tonight.recipe ? 'Start cooking →' : 'Plan a meal →'}
            </Text>
          </View>
        </Pressable>

        {/* ── Shopping list — one tap from the default screen ── */}
        {shoppingCount > 0 && (
          <Pressable
            style={styles.shopCard}
            onPress={() => router.push('/(tabs)/shop')}
            accessibilityRole="button"
          >
            <Text style={styles.shopIcon}>🛒</Text>
            <View style={styles.shopInfo}>
              <Text style={styles.shopTitle}>This week's list</Text>
              <Text style={styles.shopSub}>{shoppingCount} still to buy</Text>
            </View>
            <Text style={styles.shopChevron}>→</Text>
          </Pressable>
        )}

        {nextUnlockTarget && (
          <UnlockProgressCard
            pairId={nextUnlockTarget.pairId}
            type={nextUnlockTarget.type}
            current={nextUnlockTarget.current}
            required={nextUnlockTarget.required}
          />
        )}

        <Pressable
          style={styles.adventureCard}
          onPress={() => router.push(`/adventure/${homeCuisineId}`)}
          accessibilityRole="button"
        >
          <View style={styles.adventureHeader}>
            <Text style={styles.adventureFlag}>{adventureCuisine.flagEmoji}</Text>
            <Text style={styles.adventureCuisineName}>{adventureCuisine.name}</Text>
          </View>
          <Text style={styles.adventureTeaser} numberOfLines={2}>
            {adventureCuisine.adventureTeaser}
          </Text>
          <Text style={styles.adventureCta}>Explore this week →</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CharacterHero({
  pairId, displayName, tagline, accentColor, accentBg, onSettings,
}: {
  pairId:      CharacterPairId
  displayName: string
  tagline:     string
  accentColor: string
  accentBg:    string
  onSettings:  () => void
}) {
  const reducedMotion = useReducedMotion()
  const pair = CHARACTER_PAIRS[pairId]
  const float = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (reducedMotion) return
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 8, duration: animation.waveLoop / 2, useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0, duration: animation.waveLoop / 2, useNativeDriver: true,
        }),
      ]),
    )
    loop.start()
    return () => loop.stop()
  }, [reducedMotion])

  return (
    <View style={[styles.hero, { backgroundColor: accentBg }]}>
      <LinearGradient
        colors={[accentColor, accentBg]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={styles.heroGradient}
      >
        <Pressable
          style={styles.gear}
          onPress={onSettings}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Text style={styles.gearIcon}>⚙️</Text>
        </Pressable>

        <View style={styles.silhouetteRow}>
          {pair.members.map((member, i) => (
            <Animated.View
              key={member.name}
              style={[
                styles.silhouette,
                i === 0 && { transform: [{ translateY: float }] },
              ]}
            />
          ))}
        </View>

        <Text style={styles.heroName}>{displayName}</Text>
        <Text style={styles.heroTagline}>{tagline}</Text>
      </LinearGradient>
    </View>
  )
}

function StatCard({
  label, value, accentColor, accentBg, onPress,
}: {
  label: string; value: string; accentColor: string; accentBg: string; onPress: () => void
}) {
  return (
    <Pressable
      style={[styles.statCard, { backgroundColor: accentBg }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${value} ${label}`}
    >
      <Text style={[styles.statValue, { color: accentColor }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Pressable>
  )
}

function UnlockProgressCard({
  pairId, type, current, required,
}: {
  pairId: CharacterPairId
  type: 'meals' | 'cuisines' | 'stamps'
  current: number
  required: number
}) {
  const target = CHARACTER_PAIRS[pairId]
  const label = type === 'meals' ? 'meals cooked'
    : type === 'cuisines' ? 'cuisines tried'
    : 'passport stamps'

  return (
    <View style={styles.unlockCard}>
      <View style={styles.unlockRow}>
        <View style={styles.unlockInfo}>
          <Text style={styles.unlockLabel}>Next unlock</Text>
          <Text style={styles.unlockName}>{target.displayName}</Text>
          <Text style={styles.unlockProgress}>{current}/{required} {label}</Text>
        </View>
        <View style={[styles.unlockAvatar, { backgroundColor: target.accentColor }]}>
          <Text style={styles.unlockAvatarText}>{target.displayName.charAt(0)}</Text>
        </View>
      </View>
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },

  hero: { height: 200 },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing[5],
    paddingHorizontal: spacing[6],
  },
  gear:     { position: 'absolute', top: spacing[3], right: spacing[5] },
  gearIcon: { fontSize: 22 },

  silhouetteRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  silhouette: {
    width: 44,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  heroName: {
    ...typography.h1,
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

  content: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
    gap: spacing[3],
  },

  statsRow:  { flexDirection: 'row', gap: spacing[3] },
  statCard: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  statValue: { ...typography.display },
  statLabel: { ...typography.label, color: colors.gray[600], marginTop: spacing[1] },

  recipeCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.teal[400],
    padding: spacing[4],
  },
  recipeLabel: { ...typography.overline, color: colors.gray[400] },
  recipeTitle: { ...typography.h1, color: colors.gray[900], marginTop: spacing[1] },
  recipeSub:   { ...typography.body, color: colors.gray[600], marginTop: spacing[1] },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: colors.teal[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    marginTop: spacing[3],
  },
  badgeText: { ...typography.label, color: colors.teal[800] },

  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  shopIcon:    { fontSize: 26 },
  shopInfo:    { flex: 1 },
  shopTitle:   { ...typography.h2, color: colors.gray[900] },
  shopSub:     { ...typography.bodySm, color: colors.gray[600], marginTop: 2 },
  shopChevron: { ...typography.h2, color: colors.coral[400] },

  unlockCard: { borderRadius: radius.lg, padding: spacing[4], backgroundColor: colors.amber[50] },
  unlockRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  unlockInfo: { flex: 1 },
  unlockLabel:    { ...typography.overline, color: colors.amber[400] },
  unlockName:     { ...typography.h2, color: colors.gray[900], marginTop: spacing[1] },
  unlockProgress: { ...typography.body, color: colors.gray[600], marginTop: spacing[1] },
  unlockAvatar: {
    width: 52, height: 52, borderRadius: radius.full,
    alignItems: 'center', justifyContent: 'center',
  },
  unlockAvatarText: { ...typography.h2, color: colors.white },

  adventureCard: { borderRadius: radius.lg, padding: spacing[4], backgroundColor: colors.purple[50] },
  adventureHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2],
  },
  adventureFlag:        { fontSize: 20 },
  adventureCuisineName: { ...typography.h2, color: colors.purple[800] },
  adventureTeaser:      { ...typography.body, color: colors.gray[600] },
  adventureCta:         { ...typography.label, color: colors.purple[400], marginTop: spacing[3] },
})
