import { View, Text, StyleSheet } from 'react-native'
import { colors, spacing, radius, typography } from '@/constants/tokens'
import { CUISINES } from '@/constants/cuisines'
import { CuisineId } from '@/types/character'

interface Props {
  cuisineId: string
  countryName: string
  flagEmoji: string
  fact: string
}

export function CultureCard({ cuisineId, countryName, flagEmoji, fact }: Props) {
  const cuisine = CUISINES[cuisineId as CuisineId]

  return (
    <View style={styles.card}>
      <View style={[styles.accent, { backgroundColor: cuisine?.accentBg ?? colors.teal[50] }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.flag}>{flagEmoji}</Text>
          <Text style={styles.title}>{countryName}</Text>
        </View>
        <Text style={styles.fact}>{fact}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: spacing[4],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  flag: {
    fontSize: 18,
  },
  title: {
    ...typography.h2,
    color: colors.gray[900],
  },
  fact: {
    ...typography.cultureCard,
    color: colors.gray[600],
  },
})
