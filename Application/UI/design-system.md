# Design System

Here's a complete design direction 👇

## 🎨 1. Core Design Style — "Playful System Thinking"

| Trait | Description | Visual Analogy |
|-------|-------------|----------------|
| Style Name | Neo-Systemic (mix of Apple's clarity + a playful node-based lab) | Think Apple Design + Framer Playground + Notion meets Postman |
| Core vibe | Clean, fluid, slightly futuristic; conveys movement of data and logic | Abstract data lines & flowing connectors |
| Design Language | Glassy panels, soft shadows, rounded geometry, slight translucency | Apple macOS / SwiftUI inspiration |
| Mood | Calm, analytical, confident — but never cold | Pastel-accented, dark-light dual theme |
| Typography | Inter / SF Pro Text — high x-height for small text clarity | Already ideal for dev tools |
## 🌈 2. Color Theme — "Flux Flow"

### 💡 Base Palette

| Role | Color | Notes |
|------|-------|-------|
| Background (light) | `#F6F8FA` | neutral gray-white |
| Background (dark) | `#0E1117` | GitHub-dark tone |
| Primary | `#007AFF` | Apple blue — for main CTA / selected node |
| Secondary | `#FF9500` | warm amber for highlights (transform nodes, warnings) |
| Success | `#30D158` | Apple green |
| Error | `#FF453A` | Apple red |
| Info/Accent | `#64D2FF` | cyan for data flow lines |
| Canvas grid | `rgba(0, 122, 255, 0.05)` | subtle connection hints |

### 🖼 Gradient Accents

Use gradients subtly for node highlights:

- **Flow Blue**: `linear-gradient(135deg, #007AFF 0%, #64D2FF 100%)`
- **Warning Amber**: `linear-gradient(135deg, #FF9500 0%, #FFD60A 100%)`
- **Data Green**: `linear-gradient(135deg, #30D158 0%, #34C759 100%)`

## 🧭 3. Layout Vibe — "Flow Lab"

- **Canvas-first UI**: large interactive space with floating panels (inspired by React Flow / Figma).
- **Right Panel**: request/response inspector (JSON tree, headers).
- **Bottom Panel**: console logs, test results, response times.
- **Top Bar**: minimal, with project name + environment toggle.
- **Node Shapes**: rounded rectangles, color-coded by type (API, transform, condition, output).
- **Micro-Interactions**: springy connectors, animated flow during test run.

## 🪄 4. Visual Identity & Brand Vibe

| Element | Direction |
|---------|-----------|
| Logo concept | Abstract "F" built from two intersecting flow lines — looks dynamic and modular |
| Icon System | Outline + solid dual style (Lucide or Remix style) |
| Illustrations | Minimal 2D vector lines showing "data flow" or "nodes connecting" |
| Motion | Subtle pulsating lines or flowing particles along connections during execution |
| Tagline Tone | "See your systems flow." / "Build APIs you can see." / "From requests to reality." |

## 🧩 5. Tone & Vibe for Product and Marketing Site

- **Voice**: confident, developer-centric, not corporate.
- **Tone**: "By developers, for developers — beautiful enough to show your PM."
- **Photography/Imagery**: subtle depth-of-field backgrounds with glowing connection lines or flow graphs.
- **Animation style**: gentle motion — emphasize clarity > flashiness.

## 🧠 6. Extended Theme Ideas

| Mode | Visual Mood | Usage |
|------|-------------|--------|
| Flux Light | Calm, cool-white with blue/cyan edges | Docs, marketing site |
| Flux Dark | High-contrast navy/charcoal with neon blue flow | In-app workspace (developer default) |
| Flux Solar | Black + amber highlights | Debug/test visualization |
| Flux Mono | Monochrome wireframe mode for diff/testing | Quick comparison views |

## 🎯 Summary for API Flux

- **Design Style**: Neo-Systemic (clean + playful system thinking)
- **Color Theme**: Apple-inspired Flux Flow palette (blue-cyan-amber)
- **Vibe**: Calm + intelligent + visual clarity — "developer lab for systems thinkers."

🧭 3. Layout Vibe — “Flow Lab”

Canvas-first UI: large interactive space with floating panels (inspired by React Flow / Figma).

Right Panel: request/response inspector (JSON tree, headers).

Bottom Panel: console logs, test results, response times.

Top Bar: minimal, with project name + environment toggle.

Node Shapes: rounded rectangles, color-coded by type (API, transform, condition, output).

Micro-Interactions: springy connectors, animated flow during test run.

🪄 4. Visual Identity & Brand Vibe
Element	Direction
Logo concept	Abstract “F” built from two intersecting flow lines — looks dynamic and modular
Icon System	Outline + solid dual style (Lucide or Remix style)
Illustrations	Minimal 2D vector lines showing “data flow” or “nodes connecting”
Motion	Subtle pulsating lines or flowing particles along connections during execution
Tagline Tone	“See your systems flow.” / “Build APIs you can see.” / “From requests to reality.”
🧩 5. Tone & Vibe for Product and Marketing Site

Voice: confident, developer-centric, not corporate.

Tone: “By developers, for developers — beautiful enough to show your PM.”

Photography/Imagery: subtle depth-of-field backgrounds with glowing connection lines or flow graphs.

Animation style: gentle motion — emphasize clarity > flashiness.

🧠 6. Extended Theme Ideas
Mode	Visual Mood	Usage
Flux Light	Calm, cool-white with blue/cyan edges	Docs, marketing site
Flux Dark	High-contrast navy/charcoal with neon blue flow	In-app workspace (developer default)
Flux Solar	Black + amber highlights	Debug/test visualization
Flux Mono	Monochrome wireframe mode for diff/testing	Quick comparison views
🎯 Summary for API Flux

Design Style: Neo-Systemic (clean + playful system thinking)
Color Theme: Apple-inspired Flux Flow palette (blue-cyan-amber)
Vibe: Calm + intelligent + visual clarity — “developer lab for systems thinkers.”


## 🎨 Color Tokens

### 🧱 Base Colors

```css
:root {
  /* Neutral background layers */
  --color-bg-light: #F6F8FA;
  --color-bg-dark: #0E1117;
  --color-surface-light: #FFFFFF;
  --color-surface-dark: #161B22;
  --color-border-light: rgba(0,0,0,0.08);
  --color-border-dark: rgba(255,255,255,0.08);

  /* Primary brand */
  --color-primary: #007AFF;       /* Apple blue */
  --color-primary-hover: #005FCC;
  --color-primary-gradient: linear-gradient(135deg, #007AFF 0%, #64D2FF 100%);

  /* Accents */
  --color-accent-cyan: #64D2FF;
  --color-accent-amber: #FF9500;
  --color-accent-green: #30D158;
  --color-accent-red: #FF453A;

  /* Text */
  --color-text-primary-light: #0E1117;
  --color-text-secondary-light: #4B5563;
  --color-text-primary-dark: #F9FAFB;
  --color-text-secondary-dark: #9CA3AF;

  /* Canvas grid & flow lines */
  --color-canvas-grid: rgba(0, 122, 255, 0.05);
  --color-connector: rgba(100, 210, 255, 0.6);

  /* Shadows / glass */
  --shadow-card: 0 8px 20px rgba(0,0,0,0.06);
  --glass-bg: rgba(255,255,255,0.4);
  --glass-border: rgba(255,255,255,0.25);
}
```


🧠 Typography Tokens
:root {
  --font-family-base: "Inter", "SF Pro Text", "Segoe UI", sans-serif;
  --font-family-mono: "JetBrains Mono", "Fira Code", monospace;

  --font-size-xs: 11px;
  --font-size-sm: 13px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
  --font-size-2xl: 28px;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-loose: 1.8;

  --letter-spacing-tight: -0.01em;
  --letter-spacing-normal: 0.02em;
  --letter-spacing-wide: 0.04em;
}

🧩 Radius, Elevation, and Spacing
:root {
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

🧭 Application Vibe Summary
Element	Style	Description
Overall Vibe	Calm, intelligent, futuristic	Feels like an “Apple developer lab”
Canvas Area	Soft dark background with glowing connectors	Focuses user attention on flow
Nodes	Rounded rectangles, light glass surfaces	Each node type color-coded
Interaction Feedback	Smooth transitions, spring easing	Flows feel alive
Highlight Motion	Flowing gradient across active connectors	Represents data movement
Iconography	Lucide / Remix outline icons	Simple and modern
🌈 Node Type Color Coding
Node Type	Color	Use
API Request	#007AFF	main request nodes
Transform	#FF9500	amber to indicate logic
Condition / Branch	#64D2FF	cyan flow lines
Output / Log	#30D158	green for success
Error / Catch	#FF453A	red for break points