// S9 — Guided Prep Mode
// Figma: P01-S9 | Auth required: Yes
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { colors } from '@/constants/tokens'

export default function CookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ── PrepHeader: recipe name, step N of M, progress bar ── */}
        {/* ── StepCard: instruction, kidPrompt (purple), characterFace ── */}
        {/* ── PrepTimer: countdown with start button (if step.timerSeconds) ── */}
        {/* ── TipBar: amber, bottom ── */}
        {/* ── StepNavigation: ← Back / Next step → ── */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { flex: 1 },
})
