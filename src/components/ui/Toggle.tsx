import { Pressable, Text, View, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  label:    string
  value:    boolean
  onChange: (next: boolean) => void
}

export function Toggle({ label, value, onChange }: Props) {
  return (
    <Pressable
      style={styles.row}
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value && styles.thumbOn]} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[2],
  },
  label: {
    ...typography.body,
    color: colors.gray[900],
    flex: 1,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.gray[100],
    padding: 2,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: colors.teal[400] },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    transform: [{ translateX: 0 }],
  },
  thumbOn: { transform: [{ translateX: 20 }] },
})
