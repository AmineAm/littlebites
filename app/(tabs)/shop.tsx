// S8 — Shopping List
// Figma: P01-S8 | Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function ShopScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Header: "This week's list" + item count + "Order all" link ── */}
        {/* ── ShoppingCategory × N (Produce, Pantry, Protein, Dairy, Bakery) ── */}
        {/* Each ShoppingItem: checkbox, name+qty, cuisine flag, substitution note ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
})
