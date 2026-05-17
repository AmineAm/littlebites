// Profile & Settings
// Auth required: Yes
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, spacing } from '@/constants/tokens'

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Active child selector ── */}
        {/* ── Character pair switcher ── */}
        {/* ── Notification settings toggle ── */}
        {/* ── Adventure level display ── */}
        {/* ── Sign out button ── */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.linen },
  content:   { paddingHorizontal: spacing[6], paddingBottom: spacing[8] },
})
