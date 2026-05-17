# AI Workflow — Task Routing

This file tells the team which AI tool to use for which task.
The goal is to use each tool where it performs best, not to use one for everything.

---

## The principle

**Claude Code** = architecture, context, debugging, multi-file reasoning
**DeepSeek** = high-volume generation, boilerplate, repetitive patterns

Think of Claude Code as the senior engineer who holds the full picture.
Think of DeepSeek as a fast pair-programmer for well-defined, contained tasks.

---

## Claude Code — use for these tasks

### Architecture decisions
- Any decision that affects more than one file
- Folder structure choices
- State management patterns
- Data fetching strategy
- Navigation flow changes

### Complex component logic
- The meal planner grid (drag-and-drop, auto-fill logic)
- The preference matching algorithm (`src/utils/preference.ts`)
- The unlock milestone tracking system (`src/hooks/useUnlock.ts`)
- The character wave animation component
- The passport world map interaction

### Firebase integration
- Schema design and Firestore queries
- Cloud Function logic
- Authentication flows
- Real-time listener setup

### Debugging
- Any runtime crash or unexpected behaviour
- TypeScript errors that span multiple files
- Performance issues (re-render loops, slow screens)
- Build errors from Expo / Metro

### Multi-file features
- Any feature that touches 3+ files
- New screen creation (always touches route, store, service, component files)
- New character pair addition (touches constants, assets manifest, store)

### Start every Claude Code session with
```
Read CLAUDE.md first. Then read docs/[RELEVANT-DOC].md.
Here is the task: [describe task]
```

---

## DeepSeek — use for these tasks

### Boilerplate screen shells
Generate the initial file for each of the 11 screens.
Provide this prompt:

```
Generate a React Native TypeScript screen component for [Screen Name].
Stack: Expo Router, NativeWind, react-native-fast-image.
Import colors and spacing from '@/constants/tokens'.
The screen has a SafeAreaView with backgroundColor colors.linen.
Screen padding is 24px on left and right.
Include a ScrollView where content exceeds one screen.
Include placeholder sections for: [list the sections from SCREENS.md].
Do not add any logic — placeholder comments only for data fetching.
```

### Repetitive UI components
- Shopping list items (once you have one, ask DeepSeek to produce variants)
- Planner day cells (familiar, adventure, empty — same structure, different tokens)
- Cuisine tag chips (one template, 14 variants)
- Nutrition badge chips (one template, 5 food group variants)
- Passport stamp grid items (earned vs locked)

### Data type definitions
Generate TypeScript interfaces from the schema in `docs/DATA-SCHEMA.md`:

```
Generate TypeScript interfaces for the following Firestore documents.
Use the exact field names from the schema.
All optional fields should be typed as T | undefined, not T | null.
[paste the relevant schema section]
```

### Content data files
- Recipe lookup table (`src/assets/recipes/index.ts`) — the static require map
- Character asset manifest (`src/assets/characters/index.ts`)
- Cuisine definitions (`src/constants/cuisines.ts`)

### Test data
- Mock recipe objects for development
- Mock child profiles for Storybook / testing
- Mock meal plan week for planner testing

---

## Do NOT use DeepSeek for

- Anything involving Firebase rules or Cloud Functions
- The preference matching algorithm
- The unlock system logic
- Any file that already has substantial Claude Code output
  (DeepSeek will not understand the existing patterns and will contradict them)
- Debugging — DeepSeek lacks the context window to reason across files
- Architecture decisions of any kind

---

## Handoff protocol between tools

When Claude Code produces a file that DeepSeek will later work on:

1. Claude Code produces the file with clear section comments:
   ```typescript
   // ── DEEPSEEK: generate list item component here ──
   // Props: { item: ShoppingItem; onToggle: (id: string) => void }
   // Uses: colors.teal[400] for checked state, colors.gray[100] border
   ```

2. DeepSeek fills in the marked section only — it does not touch other parts of the file

3. Human developer reviews the output and verifies it matches the token system

---

## Context to paste at the start of every DeepSeek session

```
Project: Little Bites, Big World — a React Native + Expo mobile app.
Stack: Expo Router, TypeScript, NativeWind, react-native-fast-image, Zustand, Firebase.

Design rules (non-negotiable):
- All colors from: colors object in src/constants/tokens.ts
- All spacing from: spacing object — spacing[6] = 24 is the screen edge margin
- All font sizes from: typography object — font is Nunito, weights 400 and 500 only
- All border radius from: radius object
- Background color of every screen: colors.linen = #F1EFE8 (never pure white)
- All images via FastImage, not Image
- No hardcoded hex values, pixel values, or font sizes anywhere

Current task: [describe task]
```

---

## Session log (update this as the project progresses)

Keep a brief log of which AI produced which files.
This helps when debugging — you know whose output to inspect.

| Date | File | AI | Notes |
|------|------|----|-------|
| — | `src/constants/tokens.ts` | Claude Code | Design token file — do not edit without full review |
| — | `app/(auth)/index.tsx` | — | Not yet started |
| — | `app/(tabs)/index.tsx` | — | Not yet started |
| — | `src/store/character.store.ts` | — | Not yet started |
