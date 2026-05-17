import { NutritionTag } from '@/types/recipe'
import { WeekPlan } from '@/types/planner'

export type NutritionStatus = 'met' | 'partial' | 'missing'

const TAG_LABELS: Record<NutritionTag, string> = {
  protein: 'Protein',
  veg:     'Vegetables',
  carbs:   'Carbs',
  dairy:   'Dairy',
  fruit:   'Fruit',
}

export function getTagLabel(tag: NutritionTag): string {
  return TAG_LABELS[tag]
}

// Returns per-tag counts for a set of recipe nutrition tag arrays.
export function aggregateNutritionTags(
  tagArrays: NutritionTag[][],
): Record<NutritionTag, number> {
  const counts: Record<NutritionTag, number> = {
    protein: 0,
    veg:     0,
    carbs:   0,
    dairy:   0,
    fruit:   0,
  }
  for (const tags of tagArrays) {
    for (const tag of tags) {
      counts[tag]++
    }
  }
  return counts
}

// Simple status thresholds — met ≥ 5 servings/week, partial ≥ 2
export function getNutritionStatus(count: number): NutritionStatus {
  if (count >= 5) return 'met'
  if (count >= 2) return 'partial'
  return 'missing'
}
