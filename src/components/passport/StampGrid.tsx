import { View, StyleSheet } from 'react-native'
import { colors, spacing, radius } from '@/constants/tokens'
import { PassportStamp } from './PassportStamp'
import { WAVE_1_CUISINES } from '@/constants/cuisines'

interface Props {
  earnedStamps: Record<string, number>
  onTapStamp: (cuisineId: string, earned: boolean) => void
}

export function StampGrid({ earnedStamps, onTapStamp }: Props) {
  return (
    <View style={styles.grid}>
      {WAVE_1_CUISINES.map((cuisineId) => (
        <PassportStamp
          key={cuisineId}
          cuisineId={cuisineId}
          earned={!!earnedStamps[cuisineId]}
          count={earnedStamps[cuisineId] ?? 0}
          onTap={() => onTapStamp(cuisineId, !!earnedStamps[cuisineId])}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
    justifyContent: 'center',
  },
})
