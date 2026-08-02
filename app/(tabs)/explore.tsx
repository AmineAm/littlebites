// S10 — Passport & Rewards
// Figma: P01-S10 | Auth required: Yes
import { useMemo } from 'react'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { colors, spacing, typography } from '@/constants/tokens'
import { useCharacter } from '@/hooks/useCharacter'
import { useCharacterStore } from '@/store/character.store'
import { WAVE_1_CUISINES } from '@/constants/cuisines'
import { WorldMapDisplay } from '@/components/passport/WorldMapDisplay'
import { StampGrid } from '@/components/passport/StampGrid'
import { BadgeChip } from '@/components/passport/BadgeChip'
import { BadgeId } from '@/types/passport'

export default function ExploreScreen() {
  const router = useRouter()
  const { activePair } = useCharacter()
  const milestones = useCharacterStore((s) => s.milestones)

  // Mock stamp data — in production this would come from Firestore passport
  const earnedStamps: Record<string, number> = useMemo(() => ({
    italian: 3,
    japanese: 1,
  }), [])

  const earnedCount = Object.keys(earnedStamps).length
  const totalStamps = WAVE_1_CUISINES.length

  // Mock badges
  const earnedBadges: BadgeId[] = ['first-bite']

  function handleTapStamp(cuisineId: string, earned: boolean) {
    if (earned) {
      router.push(`/adventure/${cuisineId}`)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── World Map ── */}
        <WorldMapDisplay
          activeCharacterPairId={activePair.id}
          totalStamps={totalStamps}
          earnedCount={earnedCount}
        />

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.heading}>Passport Stamps</Text>
          <Text style={styles.sub}>
            {totalStamps - earnedCount} countries to go!
          </Text>
        </View>

        {/* ── Stamp Grid ── */}
        <StampGrid
          earnedStamps={earnedStamps}
          onTapStamp={handleTapStamp}
        />

        {/* ── Badges ── */}
        {earnedBadges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={styles.badgesTitle}>Badges earned</Text>
            <View style={styles.badgesRow}>
              {earnedBadges.map((badge) => (
                <BadgeChip key={badge} badge={badge} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.linen },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[8],
    gap: spacing[4],
  },

  header: {
    paddingTop: spacing[2],
  },
  heading: {
    ...typography.display,
    color: colors.gray[900],
  },
  sub: {
    ...typography.body,
    color: colors.gray[600],
    marginTop: spacing[1],
  },

  badgesSection: {
    marginTop: spacing[2],
  },
  badgesTitle: {
    ...typography.h2,
    color: colors.gray[900],
    marginBottom: spacing[3],
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
})
