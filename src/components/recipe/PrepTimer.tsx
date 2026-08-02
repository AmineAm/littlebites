import { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import * as Haptics from 'expo-haptics'

interface Props {
  seconds: number
  onComplete: () => void
}

export function PrepTimer({ seconds, onComplete }: Props) {
  const reducedMotion = useReducedMotion()
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, onComplete])

  const minutes = Math.floor(remaining / 60)
  const secs = remaining % 60
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Timer</Text>
      <Text style={styles.time}>{display}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && !reducedMotion && styles.pressed,
        ]}
        onPress={() => setRunning(!running)}
      >
        <Text style={styles.buttonText}>{running ? 'Pause' : 'Start'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[6],
  },
  label: {
    ...typography.overline,
    color: colors.gray[400],
    marginBottom: spacing[2],
  },
  time: {
    ...typography.display,
    fontSize: 48,
    color: colors.gray[900],
    marginBottom: spacing[4],
  },
  button: {
    backgroundColor: colors.coral[400],
    borderRadius: radius.pill,
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[3],
  },
  pressed: {
    backgroundColor: colors.coral[800],
  },
  buttonText: {
    ...typography.h2,
    color: colors.white,
  },
})
