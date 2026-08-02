import { View, StyleSheet } from 'react-native'
import { NutritionTag } from '@/types/recipe'
import { NutritionBadge } from '@/components/ui/NutritionBadge'
import { getNutritionStatus } from '@/utils/nutrition'
import { spacing } from '@/constants/tokens'

interface Props {
  tags: NutritionTag[]
  counts?: Record<NutritionTag, number>
}

const ALL_TAGS: NutritionTag[] = ['protein', 'veg', 'carbs', 'dairy']

export function NutritionBadges({ tags, counts }: Props) {
  const displayTags = tags.length > 0 ? tags : ALL_TAGS

  return (
    <View style={styles.row}>
      {displayTags.map((tag) => {
        const count = counts?.[tag] ?? (tags.includes(tag) ? 1 : 0)
        return (
          <NutritionBadge
            key={tag}
            tag={tag}
            status={getNutritionStatus(count)}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
})
