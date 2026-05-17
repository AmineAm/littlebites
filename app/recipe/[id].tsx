// S7 — Recipe Detail
// Figma: P01-S7 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { colors } from '@/constants/tokens'

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* ── RecipeHeroImage: sticky header, 120px tall, full width ── */}
        {/* ── CharacterFaceIcon: top-right corner of hero ── */}
        {/* ── Title + InfoChips: time, age, "Healthy" ── */}
        {/* ── CultureCard: teal left-border, age-appropriate fact ── */}
        {/* ── NutritionBadges: 3 food group pills ── */}
        {/* ── IngredientsList: collapsible, substitution notes inline ── */}
        {/* ── PrimaryButton: "Start cooking" → /cook/{id} ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
})
