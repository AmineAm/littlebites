// S5 — Home Dashboard
// Figma: P01-S5 | Auth required: Yes
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/tokens'

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* ── CharacterHero: active pair in current cuisine outfit + wave ── */}
      {/* ── Stats row: meals planned, passport stamps ── */}
      {/* ── RecipeSuggestionCard: tonight's suggestion ── */}
      {/* ── UnlockProgressCard: next milestone (hidden if all unlocked) ── */}
      {/* ── AdventureTeaserCard: this week's new cuisine ── */}
      <View style={styles.placeholder} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: colors.linen },
  placeholder: { flex: 1 },
})
