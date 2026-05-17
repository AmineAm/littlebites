import { CuisineId } from '@/types/character'

export interface Cuisine {
  cuisineId:       CuisineId
  name:            string
  country:         string
  flagEmoji:       string
  launchWave:      1 | 2 | 3
  accentBg:        string
  accentText:      string
  adventureTeaser: string
}

export const CUISINES: Record<CuisineId, Cuisine> = {
  italian: {
    cuisineId:       'italian',
    name:            'Italian',
    country:         'Italy',
    flagEmoji:       '🇮🇹',
    launchWave:      1,
    accentBg:        '#FFF3E0',
    accentText:      '#8B4513',
    adventureTeaser: 'From sun-dried tomatoes to fresh pasta — Italy on your table tonight.',
  },
  japanese: {
    cuisineId:       'japanese',
    name:            'Japanese',
    country:         'Japan',
    flagEmoji:       '🇯🇵',
    launchWave:      1,
    accentBg:        '#FCE4EC',
    accentText:      '#880E4F',
    adventureTeaser: 'Umami, balance, and a bento box full of wonder.',
  },
  moroccan: {
    cuisineId:       'moroccan',
    name:            'Moroccan',
    country:         'Morocco',
    flagEmoji:       '🇲🇦',
    launchWave:      1,
    accentBg:        '#E8F5E9',
    accentText:      '#1B5E20',
    adventureTeaser: 'Warm spices and slow-cooked magic from North Africa.',
  },
  mexican: {
    cuisineId:       'mexican',
    name:            'Mexican',
    country:         'Mexico',
    flagEmoji:       '🇲🇽',
    launchWave:      1,
    accentBg:        '#FFF8E1',
    accentText:      '#F57F17',
    adventureTeaser: 'Bold, bright, and made to be shared with your hands.',
  },
  indian: {
    cuisineId:       'indian',
    name:            'Indian',
    country:         'India',
    flagEmoji:       '🇮🇳',
    launchWave:      1,
    accentBg:        '#FBE9E7',
    accentText:      '#BF360C',
    adventureTeaser: 'A spice journey with something for every palate.',
  },
  lebanese: {
    cuisineId:       'lebanese',
    name:            'Lebanese',
    country:         'Lebanon',
    flagEmoji:       '🇱🇧',
    launchWave:      1,
    accentBg:        '#E3F2FD',
    accentText:      '#0D47A1',
    adventureTeaser: 'Fresh herbs, mezze, and the taste of the Mediterranean.',
  },
  korean: {
    cuisineId:       'korean',
    name:            'Korean',
    country:         'South Korea',
    flagEmoji:       '🇰🇷',
    launchWave:      1,
    accentBg:        '#FCE4EC',
    accentText:      '#880E4F',
    adventureTeaser: 'Bibimbap, banchan, and bold flavours for curious kids.',
  },
  peruvian: {
    cuisineId:       'peruvian',
    name:            'Peruvian',
    country:         'Peru',
    flagEmoji:       '🇵🇪',
    launchWave:      2,
    accentBg:        '#E8EAF6',
    accentText:      '#1A237E',
    adventureTeaser: 'Where Inca tradition meets modern taste.',
  },
  greek: {
    cuisineId:       'greek',
    name:            'Greek',
    country:         'Greece',
    flagEmoji:       '🇬🇷',
    launchWave:      1,
    accentBg:        '#E3F2FD',
    accentText:      '#0D47A1',
    adventureTeaser: 'Sun, olives, and flavours from the Aegean coast.',
  },
  ethiopian: {
    cuisineId:       'ethiopian',
    name:            'Ethiopian',
    country:         'Ethiopia',
    flagEmoji:       '🇪🇹',
    launchWave:      2,
    accentBg:        '#FFF3E0',
    accentText:      '#E65100',
    adventureTeaser: 'Eat with your hands and share something ancient.',
  },
  thai: {
    cuisineId:       'thai',
    name:            'Thai',
    country:         'Thailand',
    flagEmoji:       '🇹🇭',
    launchWave:      2,
    accentBg:        '#E8F5E9',
    accentText:      '#1B5E20',
    adventureTeaser: 'Sweet, sour, salty — Thai food hits all the notes.',
  },
  'west-african': {
    cuisineId:       'west-african',
    name:            'West African',
    country:         'West Africa',
    flagEmoji:       '🌍',
    launchWave:      2,
    accentBg:        '#FFF8E1',
    accentText:      '#F57F17',
    adventureTeaser: 'Rich stews and vibrant flavours from the heart of Africa.',
  },
  french: {
    cuisineId:       'french',
    name:            'French',
    country:         'France',
    flagEmoji:       '🇫🇷',
    launchWave:      2,
    accentBg:        '#F3E5F5',
    accentText:      '#4A148C',
    adventureTeaser: 'Oui chef! Classic French cooking made fun and family-friendly.',
  },
  spanish: {
    cuisineId:       'spanish',
    name:            'Spanish',
    country:         'Spain',
    flagEmoji:       '🇪🇸',
    launchWave:      2,
    accentBg:        '#FFEBEE',
    accentText:      '#B71C1C',
    adventureTeaser: 'Tapas, paella, and the spirit of a Spanish kitchen.',
  },
}

export const WAVE_1_CUISINES: CuisineId[] = [
  'italian', 'japanese', 'moroccan', 'mexican', 'indian', 'lebanese', 'korean', 'greek',
]
