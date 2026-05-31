import { Pressable, Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  variant:  'google'
  onPress:  () => void
  loading?: boolean
}

// Simple inline Google G mark — no external icon library needed
function GoogleIcon() {
  return (
    <View style={icon.container}>
      <Text style={icon.letter}>G</Text>
    </View>
  )
}

const LABELS = { google: 'Continue with Google' }

export function SocialLoginButton({ variant, onPress, loading }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
      disabled={loading}
      accessibilityRole="button"
      accessibilityLabel={LABELS[variant]}
    >
      {loading
        ? <ActivityIndicator color={colors.gray[600]} />
        : (
          <>
            <GoogleIcon />
            <Text style={styles.label}>{LABELS[variant]}</Text>
          </>
        )
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'center',
    gap:              spacing[3],
    borderRadius:     radius.pill,
    borderWidth:      1.5,
    borderColor:      colors.gray[100],
    backgroundColor:  colors.white,
    paddingVertical:  spacing[4],
    paddingHorizontal: spacing[6],
    minHeight:        52,
  },
  pressed: { backgroundColor: colors.linen },
  label:   { ...typography.h2, color: colors.gray[900] },
})

const icon = StyleSheet.create({
  container: {
    width:           24,
    height:          24,
    borderRadius:    12,
    backgroundColor: '#4285F4',
    alignItems:      'center',
    justifyContent:  'center',
  },
  letter: {
    fontSize:   13,
    fontWeight: '700',
    color:      colors.white,
  },
})
