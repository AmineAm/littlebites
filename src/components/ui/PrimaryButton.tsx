import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native'
import { colors, spacing, radius, typography, touchTarget } from '@/constants/tokens'

interface Props {
  label:      string
  onPress:    () => void
  loading?:   boolean
  disabled?:  boolean
  style?:     ViewStyle
}

export function PrimaryButton({ label, onPress, loading, disabled, style }: Props) {
  const inactive = loading || disabled

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading
        ? <ActivityIndicator color={colors.white} />
        : <Text style={styles.label}>{label}</Text>
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor:  colors.coral[400],
    borderRadius:     radius.pill,
    paddingVertical:  spacing[4],
    paddingHorizontal: spacing[6],
    alignItems:       'center',
    justifyContent:   'center',
    minHeight:        touchTarget.min,
  },
  pressed: {
    backgroundColor: colors.coral[800],
  },
  disabled: {
    backgroundColor: colors.gray[100],
  },
  label: {
    ...typography.h2,
    color: colors.white,
  },
})
