import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CharacterFaceIcon } from '@/components/character/CharacterFaceIcon'
import { CharacterPairId } from '@/types/character'

interface Props {
  instruction: string
  kidPrompt?: string
  characterPairId: CharacterPairId
}

export function StepCard({ instruction, kidPrompt, characterPairId }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{instruction}</Text>

      {kidPrompt && (
        <View style={styles.kidPrompt}>
          <CharacterFaceIcon pairId={characterPairId} size={28} />
          <View style={styles.kidPromptContent}>
            <Text style={styles.kidPromptIcon}>⭐</Text>
            <Text style={styles.kidPromptText}>{kidPrompt}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
  },
  instruction: {
    ...typography.bodyLg,
    color: colors.gray[900],
    lineHeight: 24,
  },
  kidPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.purple[50],
    borderRadius: radius.lg,
    padding: spacing[4],
    marginTop: spacing[6],
  },
  kidPromptContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  kidPromptIcon: {
    fontSize: 16,
  },
  kidPromptText: {
    ...typography.body,
    color: colors.purple[800],
    flex: 1,
  },
})
