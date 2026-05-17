// S6 — Meal Planner
// Figma: P01-S6 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function PlanScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header: week label + "Auto-fill" button ── */}
        {/* ── PlannerGrid: 3 rows × 7 cols ── */}
        {/* ── NutritionWeekSummary: 4 food group badges ── */}
        {/* ── Legend: familiar (teal) vs adventure (purple) ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
})
