// S4 — Adventure Level
// Figma: P01-S4 | Auth required: Yes
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function AdventureLevelScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ── AdventureLevelOption × 3 (cautious / curious / adventurous) ── */}
        {/* ── CuisineDropdown: home cuisine ── */}
        {/* ── UnlockTeaserCard: first milestone ── */}
        {/* ── ProgressDots: step 3 of 3 ── */}
        {/* ── PrimaryButton: "Start exploring!" ── */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { flex: 1, paddingHorizontal: spacing[6] },
})
