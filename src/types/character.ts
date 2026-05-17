import { ImageSourcePropType } from 'react-native'

export type CharacterPairId =
  | 'marco-lily'
  | 'mei-theo'
  | 'nour-boo'
  | 'elsa-kit-finn'

export type CuisineId =
  | 'italian' | 'japanese' | 'moroccan' | 'mexican'
  | 'indian'  | 'lebanese' | 'korean'   | 'peruvian'
  | 'greek'   | 'ethiopian'| 'thai'     | 'west-african'
  | 'french'  | 'spanish'

export type MemberRole =
  | 'dad' | 'mum' | 'grandma' | 'big-sister'
  | 'daughter' | 'son' | 'toddler' | 'twin'

export interface CharacterMember {
  name:  string
  role:  MemberRole
  age:   string
  quote: string
  trait: string
}

export interface CharacterOutfit {
  hero:     ImageSourcePropType
  heroWave: ImageSourcePropType
  stamp:    ImageSourcePropType
}

export interface CharacterAssets {
  face:       ImageSourcePropType
  silhouette: ImageSourcePropType
  outfits:    Partial<Record<CuisineId, CharacterOutfit>>
}

export interface CharacterPair {
  id:          CharacterPairId
  displayName: string
  tagline:     string
  background:  string
  accentColor: string
  accentBg:    string
  members:     CharacterMember[]
}
