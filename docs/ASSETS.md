# Little Bites, Big World — Asset Specification

> **This document describes the ORIGINAL ~300-file specification and is kept for
> reference only. It is superseded by littlebites#1.**
>
> The launch requirement is now **~36 files**:
>
> | Asset | Count | Approach |
> |---|---|---|
> | Character hero / face / silhouette | 12 | Real illustration — 4 pairs × 3 |
> | Recipe images | ~24 | Real photography — food must look worth cooking |
> | Passport stamps | **0** | Rendered: flag emoji on cuisine accent colour |
> | Culture cards | **0** | Rendered: cuisine accent gradient + flag emoji |
>
> **There are no per-cuisine character outfits.** That system multiplied every
> pair by nine and accounted for most of the original count. Each pair now has
> exactly one look.
>
> Everything below the line still applies to the assets that ARE commissioned —
> sizes, transparency, naming, and the static-require rule.

---


**Read this before touching any file in `src/assets/`.**
This document defines every asset the app requires, exactly how files must be named,
and how to provide new assets to the development team.

---

## How to provide assets to developers

### If you are the illustrator

Deliver a `.zip` file organised exactly as the folder structure below.
File names are case-sensitive and must match exactly.
Deliver at 2× and 3× resolution. 1× is not required.

### If you are sharing via cloud storage (Google Drive / Dropbox)

Mirror the folder structure below exactly.
Share the root folder with the development team.
The developer will copy the contents into `src/assets/` without renaming anything.

### If you are adding assets mid-project

Drop new files into the correct subfolder.
Run `npx expo start --clear` after adding any new asset.
New assets do not require a code change unless a new character pair or cuisine is being added for the first time.

---

## Folder structure — `src/assets/`

```
src/assets/
│
├── characters/
│   ├── marco-lily/
│   │   ├── face@2x.png              ← face icon, 128×128px, circular crop
│   │   ├── face@3x.png              ← face icon, 192×192px
│   │   ├── silhouette@2x.png        ← unlock teaser, dark shape, 800×1200px
│   │   ├── silhouette@3x.png        ← 1200×1800px
│   │   ├── italian/
│   │   │   ├── hero@2x.png          ← full body, 800×1200px, transparent bg
│   │   │   ├── hero@3x.png          ← 1200×1800px
│   │   │   ├── hero-wave@2x.png     ← arm layer only, same canvas size
│   │   │   ├── hero-wave@3x.png
│   │   │   └── stamp@2x.png         ← oval stamp, 128×144px
│   │   ├── greek/
│   │   │   ├── hero@2x.png
│   │   │   ├── hero@3x.png
│   │   │   ├── hero-wave@2x.png
│   │   │   ├── hero-wave@3x.png
│   │   │   └── stamp@2x.png
│   │   ├── japanese/
│   │   ├── moroccan/
│   │   ├── mexican/
│   │   ├── lebanese/
│   │   ├── thai/
│   │   ├── french/
│   │   └── spanish/
│   │
│   ├── mei-theo/
│   │   ├── face@2x.png
│   │   ├── face@3x.png
│   │   ├── silhouette@2x.png
│   │   ├── silhouette@3x.png
│   │   └── [same cuisine folders as marco-lily]
│   │
│   ├── nour-boo/
│   │   └── [same structure]
│   │
│   └── elsa-kit-finn/
│       └── [same structure]
│
├── stamps/
│   ├── japanese@2x.png              ← 128×144px oval, earned state
│   ├── japanese@3x.png              ← 192×216px
│   ├── japanese-locked@2x.png       ← same dims, dark silhouette version
│   ├── italian@2x.png
│   ├── italian@3x.png
│   ├── italian-locked@2x.png
│   ├── moroccan@2x.png
│   ├── moroccan@3x.png
│   ├── moroccan-locked@2x.png
│   ├── mexican@2x.png
│   ├── mexican@3x.png
│   ├── mexican-locked@2x.png
│   ├── indian@2x.png
│   ├── indian@3x.png
│   ├── indian-locked@2x.png
│   ├── lebanese@2x.png
│   ├── lebanese@3x.png
│   ├── lebanese-locked@2x.png
│   ├── korean@2x.png
│   ├── korean@3x.png
│   ├── korean-locked@2x.png
│   ├── peruvian@2x.png
│   ├── peruvian@3x.png
│   ├── peruvian-locked@2x.png
│   ├── greek@2x.png
│   ├── greek@3x.png
│   ├── greek-locked@2x.png
│   ├── ethiopian@2x.png
│   ├── ethiopian@3x.png
│   ├── ethiopian-locked@2x.png
│   ├── thai@2x.png
│   ├── thai@3x.png
│   ├── thai-locked@2x.png
│   ├── west-african@2x.png
│   ├── west-african@3x.png
│   ├── west-african-locked@2x.png
│   ├── french@2x.png
│   ├── french@3x.png
│   ├── french-locked@2x.png
│   ├── spanish@2x.png
│   ├── spanish@3x.png
│   └── spanish-locked@2x.png
│
├── recipes/
│   │   ← Recipe photography or illustration
│   │   ← Named by recipe ID matching Firestore document ID
│   │   ← Format: {recipe-id}@2x.png
│   │   ← Size: 800×480px (landscape 5:3 ratio) at 1×
│   │
│   ├── chicken-teriyaki-bento@2x.png
│   ├── chicken-teriyaki-bento@3x.png
│   ├── margherita-pizza@2x.png
│   ├── margherita-pizza@3x.png
│   └── [one file per recipe, named by recipe Firestore ID]
│
├── cuisine-cards/
│   │   ← Culture story card background illustrations
│   │   ← One per cuisine, landscape, 1200×720px at 1×
│   │   ← Character NOT included — overlaid in code
│   │
│   ├── japanese-card@2x.png
│   ├── italian-card@2x.png
│   ├── moroccan-card@2x.png
│   ├── mexican-card@2x.png
│   ├── indian-card@2x.png
│   ├── lebanese-card@2x.png
│   ├── korean-card@2x.png
│   ├── peruvian-card@2x.png
│   ├── greek-card@2x.png
│   ├── ethiopian-card@2x.png
│   ├── thai-card@2x.png
│   ├── west-african-card@2x.png
│   ├── french-card@2x.png
│   └── spanish-card@2x.png
│
└── icons/
    ├── app-icon.png                 ← 1024×1024px, no transparency, no rounding
    ├── splash.png                   ← 1284×2778px (iPhone 14 Pro Max)
    ├── adaptive-icon.png            ← Android adaptive icon foreground, 1024×1024px
    └── favicon.png                  ← 48×48px for web
```

---

## Asset specifications — by type

### Character hero (full-body)

| Property | Value |
|---|---|
| Canvas size (1×) | 400×600px |
| Export at | 2× (800×1200px) and 3× (1200×1800px) |
| Background | Transparent (PNG alpha) |
| Format | PNG-24 with alpha |
| Naming | `{character-id}/{cuisine-id}/hero@{scale}x.png` |

### Character hero-wave (arm layer)

| Property | Value |
|---|---|
| Canvas size | Identical to hero — same 400×600px |
| Content | Waving arm + held prop only — rest transparent |
| Registration | Must align pixel-perfectly to hero body |
| Purpose | Overlaid on hero in code, animated independently |
| Naming | `{character-id}/{cuisine-id}/hero-wave@{scale}x.png` |

The developer overlays hero-wave on top of hero using `position: absolute`.
CSS rotation is applied to hero-wave only. Hero body stays static.

### Character face icon

| Property | Value |
|---|---|
| Canvas size (1×) | 64×64px |
| Export at | 2× (128×128px) and 3× (192×192px) |
| Shape | Circular crop — the artwork itself is circular |
| Background | Transparent |
| Content | Head only, no body, no outfit — base face |
| Naming | `{character-id}/face@{scale}x.png` |

### Character silhouette

| Property | Value |
|---|---|
| Canvas size | Same as hero — 400×600px |
| Content | Character shape filled solid #22252A — no detail |
| Purpose | Pre-unlock teaser on home dashboard |
| Naming | `{character-id}/silhouette@{scale}x.png` |

### Passport stamps

| Property | Value |
|---|---|
| Canvas size (1×) | 64×72px |
| Export at | 2× (128×144px) and 3× (192×216px) |
| Shape | Rounded rectangle: rx 8px top, rx 4px bottom |
| Background | Transparent |
| Earned version | Full colour illustration + country name |
| Locked version | Same shape, solid #22252A fill, no detail |
| Naming | `stamps/{cuisine-id}@{scale}x.png` and `stamps/{cuisine-id}-locked@{scale}x.png` |

### Recipe images

| Property | Value |
|---|---|
| Canvas size (1×) | 400×240px (landscape, 5:3 ratio) |
| Export at | 2× (800×480px) and 3× (1200×720px) |
| Background | Included (food on surface, natural scene) |
| Format | PNG or JPEG (JPEG acceptable for photography) |
| Naming | `recipes/{recipe-firestore-id}@{scale}x.png` |

The recipe Firestore document ID is the canonical identifier.
The illustrator or photographer must coordinate with the content team to use the correct ID.
If the ID is not yet assigned, use a placeholder name and rename before launch.

### Culture story card backgrounds

| Property | Value |
|---|---|
| Canvas size (1×) | 600×360px (landscape) |
| Export at | 2× (1200×720px) |
| Content | Scene background only — character is overlaid in code |
| Style | Illustrated, matching the cuisine's visual world |
| Naming | `cuisine-cards/{cuisine-id}-card@{scale}x.png` |

---

## How the developer loads assets in code

```typescript
// Character hero — static require (correct)
const characterAssets = {
  'marco-lily': {
    italian: {
      hero:     require('@/assets/characters/marco-lily/italian/hero@2x.png'),
      heroWave: require('@/assets/characters/marco-lily/italian/hero-wave@2x.png'),
      stamp:    require('@/assets/characters/marco-lily/italian/stamp@2x.png'),
    },
    greek: {
      hero:     require('@/assets/characters/marco-lily/greek/hero@2x.png'),
      heroWave: require('@/assets/characters/marco-lily/greek/hero-wave@2x.png'),
      stamp:    require('@/assets/characters/marco-lily/greek/stamp@2x.png'),
    },
    // ... all 8 Wave 1 cuisines
    face:       require('@/assets/characters/marco-lily/face@2x.png'),
    silhouette: require('@/assets/characters/marco-lily/silhouette@2x.png'),
  },
}

// Recipe image — dynamic require IS NOT possible in React Native
// Recipe images must be pre-mapped in a lookup table:
const recipeImages: Record<string, ImageSourcePropType> = {
  'chicken-teriyaki-bento': require('@/assets/recipes/chicken-teriyaki-bento@2x.png'),
  'margherita-pizza':       require('@/assets/recipes/margherita-pizza@2x.png'),
  // add each recipe here as content is produced
}
```

**Why static require?**
React Native's Metro bundler cannot resolve dynamic `require()` paths at runtime.
Every image must be statically referenced. This means every new recipe image
requires a code change to add it to the lookup table.

---

## Wave animation — how it works in code

```typescript
import FastImage from 'react-native-fast-image'
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing
} from 'react-native-reanimated'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { animation } from '@/constants/tokens'

function CharacterHero({ characterId, cuisine }: Props) {
  const reducedMotion = useReducedMotion()
  const rotation = useSharedValue(0)

  useEffect(() => {
    if (reducedMotion) return
    rotation.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: animation.waveLoop / 2, easing: Easing.inOut(Easing.ease) }),
        withTiming( 8, { duration: animation.waveLoop / 2, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,  // infinite
      true // reverse
    )
  }, [reducedMotion])

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  const assets = characterAssets[characterId][cuisine]

  return (
    <View style={styles.container}>
      {/* Static body layer */}
      <FastImage
        source={assets.hero}
        style={styles.hero}
        resizeMode={FastImage.resizeMode.contain}
      />
      {/* Animated arm layer — exactly same position */}
      <Animated.View style={[StyleSheet.absoluteFill, waveStyle]}>
        <FastImage
          source={assets.heroWave}
          style={styles.hero}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>
    </View>
  )
}
```

---

## Launch asset checklist

Before submitting to App Store / Play Store, confirm all of the following exist:

- [ ] All 4 character pairs × face icon at 2× and 3×
- [ ] All 4 character pairs × silhouette at 2× and 3×
- [ ] All 4 character pairs × 8 Wave 1 cuisines × hero at 2× and 3×
- [ ] All 4 character pairs × 8 Wave 1 cuisines × hero-wave at 2× and 3×
- [ ] All 4 character pairs × 8 Wave 1 cuisines × stamp at 2×
- [ ] All 14 cuisines × passport stamp earned at 2× and 3×
- [ ] All 14 cuisines × passport stamp locked at 2×
- [ ] All 8 Wave 1 cuisines × culture card background at 2×
- [ ] All launch recipes × recipe image at 2× and 3×
- [ ] App icon 1024×1024px
- [ ] Splash screen at iPhone 14 Pro Max dimensions
- [ ] Android adaptive icon foreground
