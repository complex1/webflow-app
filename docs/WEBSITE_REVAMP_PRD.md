# Website revamp — one-page PRD

**Product:** API Flux · **Doc owner:** Product / Design · **Status:** Draft

## 1. Problem & goal

The marketing site should communicate what API Flux *is* (visual API workflow builder with runs, environments, and history) primarily through **interaction and product-shaped UI**, not long copy. Visitors should **feel** the product before reading.

**Primary goal:** Increase qualified signups / “try product” actions by improving **instant comprehension** and **engagement**.

**Non-goals (this phase):** Full in-app demo with live backend on the homepage; rebrand of product name; i18n beyond English.

## 2. Target audience

| Segment | Need |
|--------|------|
| **Builder / IC** | See canvas, nodes, run → response in seconds. |
| **Tech lead** | Trust signals after the hero (security posture, control) — secondary scroll. |

## 3. Principles

1. **One dominant interaction per viewport** where possible.  
2. **Visual language matches the app** (nodes, edges, panels, tokens).  
3. **Progressive disclosure:** hero = recognition; scroll = depth (configure → run → history).  
4. **Accessible:** keyboard paths for interactive demos; `prefers-reduced-motion` respected.  
5. **Performance:** hero path under budget on mid-tier mobile (lazy-load below fold).

## 4. Scope — sections & acceptance criteria

### 4.1 Global shell (header / footer / layout)

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| G-1 | Marketing layout is cohesive with app **design tokens** (radius, type scale, key colors). | Audit checklist: header, buttons, cards use shared variables or documented equivalents; no one-off hex in new work except documented accents. |
| G-2 | Primary nav is minimal; **CTA** visible without scroll on desktop and mobile. | “Sign up” / “Get started” + secondary “Docs” or “Playground” present; tap targets ≥ 44px. |
| G-3 | Footer has legal + product links; no broken routes. | All links 200 or documented external; legal pages linked if they exist. |

### 4.2 Hero

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| H-1 | First screen **reads as a product UI**, not generic SaaS illustration. | Contains recognizable **canvas + nodes + edges** (or faithful abstraction) and a **run / flow** metaphor. |
| H-2 | **Motion has narrative:** e.g. data flow, run pulse, or step highlight — not decorative-only. | At least one scripted sequence ≤ 15s loop OR user-triggered “Run sample”; motion pauses/static variant when `prefers-reduced-motion: reduce`. |
| H-3 | **Value in ≤ 8 words** headline + optional subline; subline ≤ 25 words. | Copy reviewed; primary message = visual API workflows + run. |
| H-4 | Primary CTA + secondary CTA (e.g. docs / playground). | Both routes work; analytics events named (`cta_hero_primary`, `cta_hero_secondary`). |

### 4.3 “Build” chapter (problem → solution transition)

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| B-1 | User understands **nodes + connections** without reading paragraphs. | Interactive or auto-played **add/connect** micro-demo OR high-fidelity static with clear labels on nodes. |
| B-2 | Maps to real capabilities: HTTP, Transform, OpenAPI (icons or labels consistent with app). | Node types shown match product naming; no misleading types. |

### 4.4 “Configure” chapter (environments)

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| E-1 | **Variables / env** concept is visible (file or key-value strip). | Shows reusable config; secrets masked or clearly labeled as example. |
| E-2 | Optional: link to docs section on environments. | Link uses stable path (`/docs#…`). |

### 4.5 “Run” chapter (execution & response)

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| R-1 | **Run → outcome** is shown (status + body snippet or panel chrome matching editor). | Fake data acceptable; must mirror **execution UI patterns** (not random JSON blob on unrelated layout). |
| R-2 | Reinforces **server-side runs** if that remains a differentiator. | Copy or UI badge aligned with README/product facts. |

### 4.6 “History / observability” chapter

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| O-1 | **Execution list or timeline** metaphor appears. | Visually consistent with app history/picker patterns; explains “review past runs” in ≤ 20 words if copy used. |

### 4.7 Features & use cases (existing sections, elevated)

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| F-1 | Feature grid **references same story** as hero (no contradictory metaphors). | Icons/illustrations align with canvas/run narrative. |
| U-1 | Use cases are **scannable** (card + outcome); optional link to playground preset. | Each card: title, 1-line outcome, optional CTA. |

### 4.8 Social proof & trust (optional, lower on page)

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| T-1 | Logos/quotes **below** primary product story. | Does not push interactive hero below fold on standard laptop. |
| T-2 | Any claim (uptime, compliance) is **verifiable** or softened. | Legal/comms review for claims. |

## 5. Technical constraints

| Item | Constraint |
|------|------------|
| **Demo fidelity** | Phase 1: client-only mock / enhanced background; no auth-required API on landing. |
| **Embed** | If iframe/demo subdomain added later: CSP, sandbox, rate limits documented. |
| **Bundle** | New JS for marketing split or lazy; Lighthouse performance regression flagged before release. |

## 6. Success metrics (90 days post-launch)

| Metric | Target direction |
|--------|------------------|
| Scroll depth to “Run” / feature sections | ↑ vs baseline |
| CTA clicks (hero + sticky) | ↑; stable or improved bounce rate |
| Time on page (session) | ↑ modestly |
| Signup or playground entry rate | ↑ (primary KPI agreed with stakeholders) |

Qualitative: **5-second test** — ≥70% of testers describe “visual API / workflow / automation” without reading (sample n≥8).

## 7. Delivery phases

| Phase | Deliverable |
|-------|-------------|
| **A** | Design tokens + wireframes (mobile + desktop) + hero spec |
| **B** | Hero interactive prototype + reduced-motion variant |
| **C** | Scroll chapters (configure, run, history) + analytics events |
| **D** | QA (a11y, perf), content sign-off, release + measurement |

## 8. Open questions

1. Primary conversion: **signup** vs **anonymous playground** — single primary CTA per hero?  
2. Brand: keep **API Flux** naming and **apiflux.in** assumptions throughout?  
3. Live demo in v2: budget for hosted sandbox + abuse controls?

---

*End of one-page PRD. Detailed tickets should reference section IDs (H-1, B-1, …).*
