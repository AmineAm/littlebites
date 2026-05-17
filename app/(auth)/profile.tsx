// S2 — Child Profile Setup
// Figma: P01-S2 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function ProfileSetupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header: "Who are we cooking for?" ── */}
        {/* ── ChildCard list + AddChildField ── */}
        {/* ── AllergyChip multi-select grid ── */}
        {/* ── CharacterPickerGrid: 2×2 grid of pairs ── */}
        {/* ── ProgressDots: step 1 of 3 ── */}
        {/* ── PrimaryButton: "Next" ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
})
