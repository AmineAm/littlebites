import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CUISINES } from '@/constants/cuisines'
import { CuisineId } from '@/types/character'

interface Props {
  cuisineId: string
}

export function AdventureHeroBar({ cuisineId }: Props) {
  const cuisine = CUISINES[cuisineId as CuisineId]

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.icon}>🪐</Text>
        <View style={styles.textBlock}>
          <Text style={styles.label}>New cuisine unlocked</Text>
          <Text style={styles.name}>
            {cuisine?.flagEmoji} {cuisine?.name ?? cuisineId}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.purple[400],
    borderRadius: radius.lg,
    padding: spacing[4],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  icon: {
    fontSize: 28,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    ...typography.label,
    color: colors.purple[100],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    ...typography.h1,
    color: colors.white,
    marginTop: spacing[1],
  },
})
