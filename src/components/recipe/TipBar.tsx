import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  tip: string
}

export function TipBar({ tip }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💡</Text>
      <Text style={styles.tip}>{tip}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.amber[50],
    borderRadius: radius.lg,
    padding: spacing[4],
    marginHorizontal: spacing[6],
    marginBottom: spacing[4],
  },
  icon: {
    fontSize: 16,
  },
  tip: {
    ...typography.body,
    color: colors.amber[400],
    flex: 1,
  },
})
