import { colors } from './tokens'
import { CharacterPair, CharacterPairId } from '@/types/character'

export const CHARACTER_PAIRS: Record<CharacterPairId, CharacterPair> = {
  'marco-lily': {
    id:          'marco-lily',
    displayName: 'Marco & Lily',
    tagline:     'The explorer pair',
    background:  'Caribbean',
    accentColor: colors.coral[400],
    accentBg:    colors.coral[50],
    members: [
      {
        name:  'Marco',
        role:  'dad',
        age:   'late 30s',
        quote: "I have absolutely no idea what we're making — let's start!",
        trait: 'Joyful chaos',
      },
      {
        name:  'Lily',
        role:  'daughter',
        age:   '5 years',
        quote: 'Does this one come in purple?',
        trait: 'Fearless foodie',
      },
    ],
  },

  'mei-theo': {
    id:          'mei-theo',
    displayName: 'Mei & Theo',
    tagline:     'The slow-burn pair',
    background:  'East Asian',
    accentColor: colors.teal[400],
    accentBg:    colors.teal[50],
    members: [
      {
        name:  'Mei',
        role:  'mum',
        age:   'early 40s',
        quote: 'Watch. Not everything needs words.',
        trait: 'Quiet mastery',
      },
      {
        name:  'Theo',
        role:  'son',
        age:   '11 years',
        quote: "I'm not excited. I'm just… standing here. Near the food.",
        trait: 'Secretly obsessed',
      },
    ],
  },

  'nour-boo': {
    id:          'nour-boo',
    displayName: 'Nour & Boo',
    tagline:     'The wisdom pair',
    background:  'North African',
    accentColor: colors.purple[400],
    accentBg:    colors.purple[50],
    members: [
      {
        name:  'Nour',
        role:  'grandma',
        age:   'late 60s',
        quote: 'My mother made this. Her mother made this. Now you will make this.',
        trait: 'Living memory',
      },
      {
        name:  'Boo',
        role:  'toddler',
        age:   '2 years',
        quote: '[intense staring at the food]',
        trait: 'Pure presence',
      },
    ],
  },

  'elsa-kit-finn': {
    id:          'elsa-kit-finn',
    displayName: 'Elsa, Kit & Finn',
    tagline:     'The chaos trio',
    background:  'Caucasian',
    accentColor: colors.amber[200],
    accentBg:    colors.amber[50],
    members: [
      {
        name:  'Elsa',
        role:  'big-sister',
        age:   '14 years',
        quote: "I've already pre-measured everything. You're welcome.",
        trait: 'Meticulous leader',
      },
      {
        name:  'Kit',
        role:  'twin',
        age:   '7 years',
        quote: 'What if we added more?',
        trait: 'The instigator',
        // Kit always has a smudge on his face. Always.
      },
      {
        name:  'Finn',
        role:  'twin',
        age:   '7 years',
        quote: 'We already added more.',
        trait: 'The builder',
        // Finn is always spotless.
      },
    ],
  },
}

export const CHARACTER_PAIR_ORDER: CharacterPairId[] = [
  'marco-lily',
  'mei-theo',
  'nour-boo',
  'elsa-kit-finn',
]

export const UNLOCK_MILESTONES = {
  mealsForPair2:    5,
  cuisinesForPair3: 3,
  stampsForPair4:   10,
} as const
