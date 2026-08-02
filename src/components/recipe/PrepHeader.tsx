import { View, Text, Pressable, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'

interface Props {
  recipeName: string
  stepNumber: number
  totalSteps: number
  onBack: () => void
}

export function PrepHeader({ recipeName, stepNumber, totalSteps, onBack }: Props) {
  const progress = stepNumber / totalSteps

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.stepCounter}>
          Step {stepNumber} of {totalSteps}
        </Text>
      </View>

      <Text style={styles.recipeName} numberOfLines={1}>{recipeName}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[6],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  backButton: {
    paddingVertical: spacing[1],
  },
  backText: {
    ...typography.body,
    color: colors.gray[600],
  },
  stepCounter: {
    ...typography.label,
    color: colors.gray[400],
  },
  recipeName: {
    ...typography.h2,
    color: colors.gray[900],
    marginBottom: spacing[3],
  },
  progressBar: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.gray[100],
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.coral[400],
    borderRadius: radius.pill,
  },
})
