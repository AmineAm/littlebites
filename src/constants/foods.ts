// Fixed food list for the taste preference quiz (S3).
// IDs are stable — used in ChildPreferences.liked / .disliked.

export interface Food {
  id:       string
  label:    string
  emoji:    string
}

export const FOODS: Food[] = [
  { id: 'pasta',         label: 'Pasta',          emoji: '🍝' },
  { id: 'rice',          label: 'Rice',            emoji: '🍚' },
  { id: 'chicken',       label: 'Chicken',         emoji: '🍗' },
  { id: 'fish',          label: 'Fish',            emoji: '🐟' },
  { id: 'eggs',          label: 'Eggs',            emoji: '🥚' },
  { id: 'broccoli',      label: 'Broccoli',        emoji: '🥦' },
  { id: 'carrots',       label: 'Carrots',         emoji: '🥕' },
  { id: 'tomatoes',      label: 'Tomatoes',        emoji: '🍅' },
  { id: 'cucumber',      label: 'Cucumber',        emoji: '🥒' },
  { id: 'avocado',       label: 'Avocado',         emoji: '🥑' },
  { id: 'cheese',        label: 'Cheese',          emoji: '🧀' },
  { id: 'bread',         label: 'Bread',           emoji: '🍞' },
  { id: 'potato',        label: 'Potato',          emoji: '🥔' },
  { id: 'sweet-potato',  label: 'Sweet Potato',    emoji: '🍠' },
  { id: 'lentils',       label: 'Lentils',         emoji: '🫘' },
  { id: 'chickpeas',     label: 'Chickpeas',       emoji: '🫘' },
  { id: 'beef',          label: 'Beef',            emoji: '🥩' },
  { id: 'lamb',          label: 'Lamb',            emoji: '🥩' },
  { id: 'tofu',          label: 'Tofu',            emoji: '🟡' },
  { id: 'mushrooms',     label: 'Mushrooms',       emoji: '🍄' },
  { id: 'spinach',       label: 'Spinach',         emoji: '🥬' },
  { id: 'corn',          label: 'Corn',            emoji: '🌽' },
  { id: 'peas',          label: 'Peas',            emoji: '🫛' },
  { id: 'noodles',       label: 'Noodles',         emoji: '🍜' },
  { id: 'spicy-food',    label: 'Spicy food',      emoji: '🌶️' },
  { id: 'yoghurt',       label: 'Yoghurt',         emoji: '🥛' },
  { id: 'fruit',         label: 'Fruit',           emoji: '🍓' },
  { id: 'beans',         label: 'Beans',           emoji: '🫘' },
  { id: 'coconut',       label: 'Coconut',         emoji: '🥥' },
  { id: 'olives',        label: 'Olives',          emoji: '🫒' },
]
