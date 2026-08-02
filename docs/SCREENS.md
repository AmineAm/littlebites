# Little Bites, Big World — Screen Specifications

Read the relevant section before building any screen.
Each screen spec includes: route, data sources, components needed, and key UX rules.

**There is no auth.** Every screen is reachable once onboarding is done.
Screen IDs (S5–S11) are retained because they match the design file.

---

## Onboarding — the whole of it
**Route:** `/onboarding`  **Replaces:** the former S1–S4

The entire setup flow is one screen, roughly three taps. There is no sign-up,
no account, and no taste quiz. See littlebites#1 for why.

### Layout
- Single scroll, tap-only except the optional name field
- Character pair — 4 cards, tap one (this is the delight moment, not friction)
- Age band — 3 big buttons: 2-4 / 5-8 / 9-12
- Allergies — 8 emoji chips, none selected by default
- Name — one optional field, skippable
- Primary CTA: "Start cooking"

### Data
- Writes the single child to the profile store (persisted to AsyncStorage)
- Writes the chosen pair as the starter pair to the character store
- Sets `onboardingComplete`, which is what the root layout gates on

### Key rules
- Age is a **band**, never an exact number. The three bands map exactly onto
  the culture-card fact tiers (`age2to4`, `age5to8`, `age9to12`)
- Allergy selection filters every future suggestion — safety critical
- Adventure level and home cuisine are deliberately NOT asked here. Nobody
  knows what "adventure level" means before using the app once; both live in
  Settings with defaults of `curious` and unset
- The child profile is singular. There is no children array

---


## S5 — Home Dashboard
**Route:** `/(tabs)/`  **Figma:** P01-S5

### Layout
- Not a scroll view — fixed sections
- Character hero area (top ~30%): active character in current cuisine outfit + wave animation
- Stats row: meals planned this week, passport stamps
- Tonight's suggestion card (hero recipe card)
- Unlock progress card (amber, shows next milestone)
- Adventure teaser card (purple, this week's new cuisine)
- Bottom: nav bar

### Data
- Real-time listener: `users/{userId}/unlocks/{userId}` — for unlock trigger
- Reads the passport from the character store — stamp count
- Read: current week's meal plan from `users/{userId}/mealPlans/{weekId}`
- Read: tonight's suggested recipe (first non-empty dinner slot, or preference-matched suggestion)

### Components needed
- `<CharacterHero pairId={} cuisineId={} />` — hero + wave layer
- `<StatCard label={} value={} accentColor={} />`
- `<RecipeSuggestionCard recipe={} matchScore={} />`
- `<UnlockProgressCard pairId={} current={} required={} type={} />`
- `<AdventureTeaserCard cuisineId={} />`

### Key rules
- Character outfit matches the adventure cuisine for the current week
- If no adventure cuisine set, use the user's home cuisine
- No match percentage is shown. A score from a handful of signals cannot
  support that precision — suggestions are simply ordered by it
- Unlock progress card only shows if ≥1 pair still locked

---

## S6 — Meal Planner
**Route:** `/(tabs)/plan`  **Figma:** P01-S6

### Layout
- Scroll view
- Header: week label + "Auto-fill" button
- 3 meal rows (Breakfast, Lunch, Dinner) × 7 day columns
- Each cell: cuisine-coloured if filled, dashed if empty
- Nutrition week summary (4 food group badges)
- Legend: familiar (teal dot) vs adventure (purple dot)

### Data
- Read + write: `users/{userId}/mealPlans/{weekId}`
- Read: recipe data for filled slots (to show cuisine colour)

### Components needed
- `<PlannerGrid weekPlan={} onCellTap={} />`
- `<PlannerCell recipe={} mealType={} day={} onTap={} />` — familiar / adventure / empty variants
- `<NutritionWeekSummary weekPlan={} />`
- `<NutritionBadge tag={'protein'|'veg'|'carbs'|'dairy'} status={'met'|'partial'|'missing'} />`
- `<RecipePickerSheet cuisineId={} onSelect={} onDismiss={} />` — bottom sheet for slot filling

### Key rules
- Tapping a filled cell opens recipe detail (S7)
- Tapping an empty cell opens the recipe picker sheet
- Familiar cells: teal[50] bg, teal[800] text
- Adventure cells: purple[50] bg, purple[800] text
- Empty cells: linen bg, dashed gray[200] border, "+" text
- Auto-fill uses the preference engine — never fills adventure slots without checking adventure level

---

## S7 — Recipe Detail
**Route:** `/recipe/[id]`  **Figma:** P01-S7

### Layout
- Scroll view with sticky header image
- Recipe image (120px tall, full width)
- Character face icon (top right corner of image)
- Title + info chips (time, age, healthy)
- Culture card (teal left-border accent)
- Nutrition badges row (3 food group pills)
- Ingredients list (preview: 3 shown, expandable)
- Primary CTA: "Start cooking" → navigates to S9

### Data
- Read: `recipes/{recipeId}` — all recipe data
- Read: active character face icon from assets

### Components needed
- `<RecipeHeroImage recipeId={} />`
- `<CharacterFaceIcon pairId={} size={32} />`
- `<InfoChip icon={} label={} />`
- `<CultureCard cuisineId={} ageGroup={} />` — shows the right age-tier fact
- `<NutritionBadges tags={} />`
- `<IngredientsList ingredients={} />` — collapsible
- `<PrimaryButton label="Start cooking" onPress={} />`

### Key rules
- Culture card shows the fact for the child's age group (from child profile)
- "Healthy" chip always shown (all recipes in library are nutritionist-reviewed)
- No calorie count anywhere on this screen
- Substitution notes shown inline next to relevant ingredients (orange info icon)

---

## S8 — Shopping List
**Route:** `/(tabs)/shop`  **Figma:** P01-S8

### Layout
- Scroll view
- Header: "This week's list" + "Order all" link
- Subtitle: item count
- Grouped by category: Produce, Pantry, Protein, etc.
- Each item: checkbox, name + quantity, cuisine flag, substitution note if applicable
- Character face icon next to items linked to adventure recipes

### Data
- Derived from current week's meal plan — aggregated client-side from recipe ingredients
- Checked state persisted in the planner store, keyed by weekId

### Components needed
- `<ShoppingCategory category={} items={} />`
- `<ShoppingItem item={} checked={} onToggle={} />`
- `<SubstitutionNote original={} substitute={} />`
- `<OrderAllLink />` — placeholder for future grocery integration

### Key rules
- Items are deduplicated and quantities summed across recipes
- Checked items move to bottom of their category (or show strike-through)
- Category grouping: Produce, Protein, Pantry, Dairy, Bakery
- Global ingredients (hard-to-source) show an orange info icon with substitution

---

## S9 — Guided Prep Mode
**Route:** `/cook/[id]`  **Figma:** P01-S9

### Layout
- No scroll — single screen per step
- Header bar: recipe name, step N of M, progress bar
- Step card: instruction text, kid participation prompt (if applicable), character face icon
- Timer block (if step has timer)
- Navigation: "← Back" and "Next step →"
- Tip bar at bottom (amber)

### Data
- Read: `recipes/{recipeId}` — steps array
- Write: on final step complete → calls `MealCompleteService.recordCompletion()`

### Components needed
- `<PrepHeader recipeName={} stepNumber={} totalSteps={} progress={} />`
- `<StepCard instruction={} kidPrompt={} characterPairId={} />`
- `<PrepTimer seconds={} onComplete={} />` — countdown with start button
- `<StepNavigation onBack={} onNext={} isFirst={} isLast={} />`
- `<TipBar tip={} />`

### Key rules
- "Next step" on final step shows a "Meal complete 🎉" confirmation
- Meal complete calls `recordMealCooked(cuisineId)` on the character store,
  then offers a one-tap 👍/👎 which feeds `applyMealVerdict`
- Kid participation prompt is shown with purple background + character face icon + star icon
- Timer is optional — only shown if `step.timerSeconds` is defined
- Back button on step 1 shows a "Leave cooking?" confirmation dialog

---

## S10 — Passport & Rewards
**Route:** `/(tabs)/passport`  **Figma:** P01-S10

### Layout
- Scroll view
- World map area (top, non-interactive map illustration with dot markers)
- Character face icon + "Leila's world" label
- Country count + "X to go" link
- Stamps collected: 2×4 grid (earned and locked)
- Badges earned: horizontal chip row

### Data
- Reads the passport from the character store

### Components needed
- `<WorldMapDisplay stamps={} activeCharacterPairId={} />`
- `<StampCount earned={} total={} />`
- `<StampGrid stamps={} allCuisines={} />`
- `<PassportStamp cuisineId={} earned={} />`
- `<BadgeChip badge={} />`

### Key rules
- Locked stamps show dark silhouette + lock icon
- Tapping an earned stamp navigates to adventure mode for that cuisine (S11)
- Tapping a locked stamp shows "Cook a [cuisine] recipe to unlock!"
- Badge chips: first-bite (teal star), explorer (purple globe), little-chef (amber chef-hat)

---

## S11 — Adventure Mode
**Route:** `/adventure/[cuisine]`  **Figma:** P01-S11

### Layout
- Scroll view
- Adventure hero bar: purple bg, planet icon, "New cuisine unlocked" label, cuisine name
- Culture fact card (blue left-border accent)
- "Try this week" section + recipe card
- Character outfit teaser (amber card)
- "Not ready?" note
- Primary CTA: "Add to this week's plan"
- Ghost CTA: "Skip for now — no pressure"

### Data
- Read: `cuisines/{cuisineId}` — culture fact, teaser text
- Read: one matching recipe from `recipes` collection (filtered by cuisineId)
- Write: adds recipe to meal plan if "Add to plan" tapped

### Components needed
- `<AdventureHeroBar cuisineId={} />`
- `<CultureFactCard cuisineId={} ageGroup={} />`
- `<RecipeTeaser recipe={} />`
- `<CharacterOutfitTeaser pairId={} cuisineId={} />`
- `<AddToPlanButton recipe={} onPress={} />`
- `<SkipButton onPress={} />`

### Key rules
- Culture fact always shown before the recipe — this is the "curiosity first" principle
- Recipe shown is matched to the child's preferences from that cuisine
- "Skip for now" simply navigates back — no negative state recorded
- Character outfit teaser shows the character pair in that cuisine's outfit (if asset exists)
- If cuisine outfit asset does not exist yet, hide the teaser card entirely
