// S11 — Adventure Mode
// Figma: P01-S11 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { colors } from '@/constants/tokens'

export default function AdventureModeScreen() {
  const { cuisine } = useLocalSearchParams<{ cuisine: string }>()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* ── AdventureHeroBar: purple bg, planet icon, cuisine name ── */}
        {/* ── CultureFactCard: blue left-border, age-appropriate fact ── */}
        {/* ── RecipeTeaser: "Try this week" section ── */}
        {/* ── CharacterOutfitTeaser: amber card (hidden if no outfit asset) ── */}
        {/* ── "Not ready?" note ── */}
        {/* ── PrimaryButton: "Add to this week's plan" ── */}
        {/* ── GhostButton: "Skip for now — no pressure" ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
})
