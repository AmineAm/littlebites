// S1 — Splash & Sign Up
// Figma: P01-S1 | Auth required: No
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors } from '@/constants/tokens'

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* ── GradientHero: amber-to-coral gradient, character silhouettes ── */}
      <View style={styles.hero} />

      {/* ── AuthCard: Google sign-in + email sign-up ── */}
      <View style={styles.card} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  hero:      { flex: 0.4 },
  card:      { flex: 0.6, backgroundColor: colors.white },
})
