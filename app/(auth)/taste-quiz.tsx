// S3 — Taste Preference Quiz
// Figma: P01-S3 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function TasteQuizScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── QuizProgressBar: current / total ── */}
        {/* ── 2-column FoodPreferenceChip grid ── */}
        {/* ── PrimaryButton: "Continue" (disabled until ≥8 rated) ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
})
