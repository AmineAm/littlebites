// Character Unlock Reveal
// Full-screen, non-dismissible until "Meet them" is tapped.
// Auth required: Yes
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { colors } from '@/constants/tokens'

export default function UnlockScreen() {
  const { character } = useLocalSearchParams<{ character: string }>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ── Character silhouette filling with colour (opacity animation) ── */}
        {/* ── Character name (typography.display) ── */}
        {/* ── First member's signature quote ── */}
        {/* ── PrimaryButton: "Meet [name]" → setActivePair + navigate to /(tabs)/ ── */}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
