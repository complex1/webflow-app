Apiflux UI Guidelines (Vue 3)

This document defines the UI theme, design tokens, and coding conventions for Apiflux (Vue 3).
Goal: consistent, professional developer-tool UI optimized for backend developers.

Theme

Theme name: Apiflux Flow Dark
Style: clean, technical, calm, minimal
Rule: color is for meaning, not decoration.

Non-negotiables

Dark mode only (for now)

Avoid heavy shadows, glassmorphism everywhere, loud gradients
# Apiflux UI Guidelines (Vue 3)

Opinionated theme, tokens, and coding standards for a compact, professional developer tool UI.

## Theme

- Name: Apiflux Flow Dark
- Aesthetic: clean, technical, calm, minimal
- Principle: color conveys meaning, not decoration

## Non‑negotiables

- Dark mode only (current scope)
- Avoid heavy drop-shadows, pervasive glassmorphism, and loud gradients
- Favor borders and gentle highlights over large tinted areas
- Dense, dev-tool ergonomics while keeping text readable
- Accessibility first: clear focus states and adequate contrast

## Design Tokens

Always consume design tokens; do not hardcode color values in components.

- Single source of truth: `src/styles/tokens.css` (or `src/assets/styles/tokens.css`)
- Import once in `main.ts`

### tokens.css

```css
:root {
    /* Backgrounds */
    --bg-primary: #0B0F14;   /* app background */
    --bg-secondary: #111827; /* panels/canvas */
    --bg-elevated: #1F2937;  /* cards/popovers */

    /* Borders */
    --border-default: #273244;
    --border-subtle: #1C2533;

    /* Text */
    --text-primary: #E5E7EB;
    --text-secondary: #9CA3AF;
    --text-muted: #6B7280;

    /* Semantic / Accent */
    --accent-blue: #3B82F6;     /* selection, primary action, focus */
    --success-green: #22C55E;   /* success */
    --warning-yellow: #F59E0B;  /* warning */
    --error-red: #EF4444;       /* error */

    /* Radii */
    --radius-sm: 8px;
    --radius-md: 10px;
    --radius-lg: 12px;

    /* Spacing */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;

    /* Typography */
    --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --text-xs: 11px;
    --text-sm: 12px;
    --text-md: 14px;
    --text-lg: 16px;
    --text-xl: 18px;

    /* Motion */
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    --dur-fast: 120ms;
    --dur-med: 160ms;

    /* Focus */
    --focus-ring: 0 0 0 2px color-mix(in srgb, var(--accent-blue) 70%, transparent);
}
```

If `color-mix()` is a concern, replace `--focus-ring` with a fixed rgba box-shadow.

## Typography and Density

- Base font: `var(--font-sans)`
- Body: 14px, labels: 12px, metadata: 11px
- Keep headings modest to preserve density

### Global base (example)

```css
html, body {
    font-family: var(--font-sans);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: var(--text-md);
    line-height: 1.5;
}
```

## Layout

Three-pane application shell:
- Left: node palette/library
- Center: infinite canvas
- Right: inspector panel

Pane styling:
- Background: `--bg-secondary`
- Borders: `--border-default`
- Minimal or no shadows

## Nodes and Canvas

### Node shell

- Background: `--bg-elevated`
- Border: 1px solid `--border-default`
- Radius: `--radius-md`
- Avoid strong drop-shadows

### Node states (use borders/stripes, not full fills)

- Default: neutral border
- Selected: border uses `--accent-blue` plus subtle glow
- Running: thin left stripe in `--accent-blue`
- Success: thin left stripe in `--success-green`
- Warning: thin left stripe in `--warning-yellow`
- Error: red border `--error-red` plus an error badge

### Canvas

- Background: `--bg-secondary`
- Grid: ultra subtle
- Edges: neutral; emphasize on selection

## Components

### Buttons

- Primary: solid `--accent-blue` with white text
- Secondary: `--bg-elevated` with border
- Danger: understated background with red text; confirm destructive actions

### Inputs

- Dark field backgrounds
- Focus ring uses `--accent-blue`
- Inline validation; avoid aggressive modals

### Icons

- Single icon set (recommend Lucide)
- Size 16–18px; consistent stroke weight

## Motion

Micro-interactions only:
- Durations: 120–160ms
- Easing: `--ease-out`
- No bounce/spring
- Panels/modals: light fade/slide

```css
.transition-fast {
    transition: all var(--dur-fast) var(--ease-out);
}
```

## Vue 3 Coding Guidelines

### Component structure

- Use `<script setup lang="ts">`
- Prefer small, reusable units over monoliths
- Style via tokens

### Suggested folders

```
src/
    components/
        ui/               # buttons, inputs, badges, panels
        canvas/           # canvas + graph components
        nodes/            # node components (ApiNode, TransformNode, ...)
        inspector/        # inspector panels & forms
    styles/
        tokens.css
        globals.css
```

### Naming

- Components: PascalCase.vue (e.g., NodeCard.vue)
- Composables: useXxx.ts (e.g., useNodeSelection.ts)
- Types: Xxx.ts (e.g., FlowTypes.ts)
- CSS classes: kebab-case

### State management

- Keep graph state centralized (store/composable); avoid long prop chains
- Presentational components emit events

### Error handling

Expose for async work:
- `loading`
- `error`
- `result`

Surface node execution errors on the node (badge) and in the inspector.

## Styling Rules

### Do

- Use tokens
- Keep CSS simple and consistent
- Maintain uniform spacing
- Add `:focus-visible` styles

### Don’t

- Hardcode hex colors in components
- Mix icon packs
- Blanket heavy shadows
- Random animations

## PR Checklist (UI)

- No hardcoded colors (unless justified)
- Node states follow spec (selected/running/success/error)
- Focus-visible supports keyboard nav
- Panels use standard layout and borders
- No canvas visual regressions

## “Codex / AI Assistant” Guidance

- Prefer updating/reusing tokens over introducing ad-hoc colors
- Keep changes incremental and type-safe
- Priority order: App shell → Nodes → Inspector → Modals/empty states
- Output file paths with short rationale for changes
Prefer borders + subtle highlights over big colored surfaces

UI must be compact but readable (dev-tool density)

Accessibility: visible focus ring, readable contrast

Design Tokens

All UI must use tokens. Avoid hardcoded hex values in components.

Create one source of truth:

src/styles/tokens.css (or src/assets/styles/tokens.css)

Imported once in main.ts

tokens.css
:root {
  /* Backgrounds */
  --bg-primary: #0B0F14;   /* app background */
  --bg-secondary: #111827; /* panels/canvas */
  --bg-elevated: #1F2937;  /* cards/popovers */

  /* Borders */
  --border-default: #273244;
  --border-subtle: #1C2533;

  /* Text */
  --text-primary: #E5E7EB;
  --text-secondary: #9CA3AF;
  --text-muted: #6B7280;

  /* Semantic / Accent */
  --accent-blue: #3B82F6;     /* selection, primary action, focus */
  --success-green: #22C55E;   /* success */
  --warning-yellow: #F59E0B;  /* warning */
  --error-red: #EF4444;       /* error */

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;

  /* Spacing (optional but recommended) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;

  /* Typography */
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --text-xs: 11px;
  --text-sm: 12px;
  --text-md: 14px;
  --text-lg: 16px;
  --text-xl: 18px;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 120ms;
  --dur-med: 160ms;

  /* Focus */
  --focus-ring: 0 0 0 2px color-mix(in srgb, var(--accent-blue) 70%, transparent);
}


If color-mix() support is a concern, replace --focus-ring with a fixed rgba shadow.

Typography & Density

Font: var(--font-sans)
Default body: 14px, labels: 12px, metadata: 11px
Avoid oversized headings; dev tools should stay compact.

Global base (example)
html, body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--text-md);
  line-height: 1.5;
}

Layout Standard

Use a professional 3-panel layout:

Left: Node palette/library

Center: Canvas (infinite)

Right: Inspector (node properties)

Panels should use:

Background: --bg-secondary

Borders: --border-default

Minimal/no shadows

Node & Canvas Guidelines

Nodes must feel engineering-grade, not “no-code playful”.

Node base

Background: --bg-elevated

Border: 1px solid --border-default

Radius: --radius-md

No strong shadow

Node states (do NOT color full background)

Use border + a thin left stripe indicator.

Default: neutral border

Selected: border: --accent-blue + very subtle glow

Running: left stripe --accent-blue

Success: left stripe --success-green

Warning: left stripe --warning-yellow

Error: border: --error-red + error badge

Canvas

Background: --bg-secondary

Grid: extremely subtle

Edges: neutral by default; highlight on selection

Components
Buttons

Primary: solid --accent-blue, white text

Secondary: --bg-elevated + border

Danger: subtle background + red text (confirm destructive actions)

Inputs

Dark field background

Focus ring uses --accent-blue

Inline validation (small text); avoid aggressive modals

Icons

Use one icon set only (recommended: Lucide).
Size: 16–18px. Keep stroke consistent.

Motion

Micro-interactions only:

120–160ms ease-out

No bounce/spring

Fade/slide for panels and modals only

Example:

.transition-fast {
  transition: all var(--dur-fast) var(--ease-out);
}

Vue 3 Coding Guidelines
Component structure

Use <script setup lang="ts">

Prefer small reusable components over giant views

Keep styling token-driven

Suggested folders:

src/
  components/
    ui/               # buttons, inputs, badges, panels
    canvas/           # canvas + graph specific components
    nodes/            # node components (ApiNode, TransformNode...)
    inspector/        # inspector panels & forms
  styles/
    tokens.css
    globals.css

Naming conventions

Components: PascalCase.vue (e.g., NodeCard.vue)

Composables: useXxx.ts (e.g., useNodeSelection.ts)

Types: Xxx.ts (e.g., FlowTypes.ts)

CSS classes: kebab-case

State management

Keep graph state in a single source (store/composable), avoid prop drilling

Components should be mostly presentational + emit events

Error handling

Every async action must expose:

loading

error

result

Node execution errors must be visible at node level (badge + inspector details)

Styling Rules
DO

Use tokens

Prefer simple CSS and consistent patterns

Keep spacing consistent

Add :focus-visible styles

DON’T

Hardcode hex colors in components

Use multiple icon packs

Add heavy shadows everywhere

Add random animation effects

PR Checklist (UI)

Before merging:

 No hardcoded colors (unless justified)

 Node states follow spec (selected/running/success/error)

 Focus-visible works for keyboard navigation

 Panels use standard layout + borders

 No visual regressions on canvas

“Codex / AI Assistant” Instructions

When using Codex to modify UI:

Update or reuse tokens instead of introducing new random colors.

Keep changes incremental and compile-safe.

Prioritize: App shell → Nodes → Inspector → Modals/Empty states.

Output changes with file paths and short rationale.