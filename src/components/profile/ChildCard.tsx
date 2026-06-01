import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  name:     string
  age:      number
  onRemove: () => void
}

export function ChildCard({ name, age, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.age}>{age} year{age !== 1 ? 's' : ''} old</Text>
      </View>
      <Pressable
        style={styles.removeBtn}
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${name}`}
        hitSlop={8}
      >
        <Text style={styles.removeIcon}>×</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray[100],
    padding: spacing[3],
    gap: spacing[3],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.teal[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.teal[400],
  },
  info: { flex: 1 },
  name: {
    ...typography.h2,
    color: colors.gray[900],
  },
  age: {
    ...typography.bodySm,
    color: colors.gray[600],
    marginTop: 1,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: colors.gray[600],
    lineHeight: 20,
  },
})
