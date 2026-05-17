// S10 — Passport & Rewards
// Figma: P01-S10 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── WorldMapDisplay: illustrated map with dot markers ── */}
        {/* ── CharacterFaceIcon + "Leila's world" label ── */}
        {/* ── StampCount: earned / total + "X to go" link ── */}
        {/* ── StampGrid: 2×4 earned/locked grid ── */}
        {/* ── BadgeChip row: earned badges ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
})
