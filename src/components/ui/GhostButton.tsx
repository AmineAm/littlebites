import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  label:   string
  onPress: () => void
  style?:  ViewStyle
}

export function GhostButton({ label, onPress, style }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius:     radius.pill,
    borderWidth:      1.5,
    borderColor:      colors.gray[100],
    paddingVertical:  spacing[4],
    paddingHorizontal: spacing[6],
    alignItems:       'center',
    justifyContent:   'center',
    minHeight:        52,
    backgroundColor:  colors.white,
  },
  pressed: {
    backgroundColor: colors.linen,
  },
  label: {
    ...typography.h2,
    color: colors.gray[900],
  },
})
