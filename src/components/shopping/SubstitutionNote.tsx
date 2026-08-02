import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  original: string
  substitute: string
}

export function SubstitutionNote({ original, substitute }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>ℹ️</Text>
      <Text style={styles.text}>
        Can't find <Text style={styles.original}>{original}</Text>? Try{' '}
        <Text style={styles.substitute}>{substitute}</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    backgroundColor: colors.amber[50],
    borderRadius: radius.md,
    padding: spacing[3],
    marginTop: spacing[2],
  },
  icon: {
    fontSize: 12,
    marginTop: 2,
  },
  text: {
    ...typography.bodySm,
    color: colors.gray[600],
    flex: 1,
  },
  original: {
    color: colors.gray[900],
    textDecorationLine: 'line-through',
  },
  substitute: {
    color: colors.amber[400],
    fontWeight: '500',
  },
})
