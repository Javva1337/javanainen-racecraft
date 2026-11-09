# Design Language: Ben Kaluza

> Extracted from `https://benkaluza.com` on October 30, 2026
> 662 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#faf600` | rgb(250, 246, 0) | hsl(59, 100%, 49%) | 18 |
| Secondary | `#b3261e` | rgb(179, 38, 30) | hsl(3, 71%, 41%) | 2 |

### Tonal Ramps

Generated in OKLCH from each role colour, so the steps are perceptually even. The site's own colour keeps its position in the ladder.

| Role | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| primary | `#fcfc99` | **`#faf600`** | `#e2e15d` | `#cbc804` | `#aca600` | `#8f8700` | `#797000` | `#625a00` | `#514900` | `#423b00` | `#252000` |
| secondary | `#ffdbcd` | `#ffccbd` | `#ffb7a7` | `#ff9787` | `#f86f5f` | `#d84c3f` | **`#b3261e`** | `#9b241c` | `#831711` | `#6d0c09` | `#420101` |
| neutral | `#f6f6f3` | **`#e2e2dd`** | `#d9d9d6` | `#c0c0bc` | `#a0a09b` | `#82827e` | `#6c6c68` | `#575753` | `#474744` | `#393936` | `#1f1f1d` |

### Semantic Pairs

| Role | Background | Foreground | Contrast | Level |
|------|------------|------------|----------|-------|
| `surface.page` | `#0b0b0b` | `#ffffff` | 19.68:1 | AAA |
| `surface.raised` | `#141413` | `#ffffff` | 18.43:1 | AAA |
| `action.primary` | `#faf600` | `#000000` | 18.25:1 | AAA |
| `action.secondary` | `#b3261e` | `#ffffff` | 6.54:1 | AA |

### Dominance

Share of painted background area — what the page looks like, as opposed to what it declares most often.

- `#0b0b0b` — 92%
- `#141413` — 8%

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#0b0b0b` | hsl(0, 0%, 4%) | 585 |
| `#f2f2f2` | hsl(0, 0%, 95%) | 251 |
| `#e2e2dd` | hsl(60, 8%, 88%) | 118 |
| `#8a8a85` | hsl(60, 2%, 53%) | 116 |
| `#cfcfca` | hsl(60, 5%, 80%) | 78 |
| `#000000` | hsl(0, 0%, 0%) | 52 |
| `#5e5e5a` | hsl(60, 2%, 36%) | 28 |
| `#6e6e6a` | hsl(60, 2%, 42%) | 22 |
| `#ffffff` | hsl(0, 0%, 100%) | 16 |
| `#bdbdb8` | hsl(60, 4%, 73%) | 16 |
| `#9a9a95` | hsl(60, 2%, 59%) | 14 |
| `#2c2c29` | hsl(60, 4%, 17%) | 10 |

### Background Colors

Used on large-area elements: `#0b0b0b`, `#141413`

### Text Colors

Text color palette: `#000000`, `#f2f2f2`, `#ffffff`, `#6e6e6a`, `#8a8a85`, `#cfcfca`, `#faf600`, `#bdbdb8`, `#5e5e5a`, `#e2e2dd`

### Gradients

```css
background-image: linear-gradient(90deg, rgb(74, 74, 70) 62.5%, rgb(138, 138, 133) 62.5%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#0b0b0b` | background, text, border | 585 |
| `#f2f2f2` | text, border, background | 251 |
| `#e2e2dd` | text, border | 118 |
| `#8a8a85` | text, border | 116 |
| `#cfcfca` | text, border | 78 |
| `#000000` | text, border | 52 |
| `#5e5e5a` | text, border | 28 |
| `#6e6e6a` | text, border | 22 |
| `#faf600` | text, border | 18 |
| `#ffffff` | text, border | 16 |
| `#bdbdb8` | text, border | 16 |
| `#9a9a95` | text, border | 14 |
| `#2c2c29` | border | 10 |
| `#141413` | background | 8 |
| `#3a3a37` | text, border | 6 |
| `#b3261e` | text, border | 2 |
| `#4a4a46` | border | 1 |

## Typography

### Font Families

- **Archivo** — used for all (44 elements)
- **Geist** — used for body (44 elements)
- **Geist Mono** — used for mono (41 elements)

### Type System

- **Scale ratio** — 1.125 (major second), anchored at 14px · 100% of sizes sit on the ladder
- **Measure** — ~50 characters per line (comfortable)
- **Fluid type** — 13 clamp/viewport font sizes, 17px → 118px
  - ⚠ 2 clamp() values have no viewport unit in the preferred term — they never scale.

### Named Scale

| Role | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| `h2` | 92.16px / 5.76rem | 850 | 79.2576px | -1.3824px |
| `h3` | 63.2158px / 3.951rem | 850 | 54.3656px | -0.948237px |
| `title-1` | 53.2px / 3.325rem | 850 | 47.88px | -0.532px |
| `title-2` | 48.64px / 3.04rem | 800 | 44.7488px | -0.2432px |
| `title-3` | 40.96px / 2.56rem | 800 | 38.912px | -0.8192px |
| `title-4` | 35.84px / 2.24rem | 800 | 32.256px | -0.3584px |
| `title-5` | 30.9px / 1.9312rem | 750 | 27.81px | 0.309px |
| `title-6` | 25.6px / 1.6rem | 800 | 24.32px | -0.128px |
| `title-7` | 19.2px / 1.2rem | 400 | 27.84px | normal |
| `title-8` | 17px / 1.0625rem | 400 | 25.5px | normal |
| `title-9` | 16px / 1rem | 400 | normal | normal |
| `title-10` | 15px / 0.9375rem | 400 | 21.75px | normal |
| `title-11` | 14px / 0.875rem | 500 | normal | normal |
| `title-12` | 13px / 0.8125rem | 400 | normal | normal |
| `title-13` | 12px / 0.75rem | 400 | 18px | normal |

### Fluid Declarations

```css
.reel-intro h2 { font-size: clamp(44px, 7.2vw, 118px); }
.caption b { font-size: clamp(40px, 7vw, 104px); }
.offer h3 { font-size: clamp(30px, 5.66038cqw - 2.71698px, 104px); }
.offer h3 { font-size: clamp(22px, 9.43396cqw, 72px); }
.wordmark { font-size: clamp(24px, 4.16vw, 67px); }
.ch h3 { font-size: clamp(30px, 3.8vw, 60px); }
.contact .addr { font-size: clamp(min(24px, 6vw), 3.2vw, 46px); }
.signup .title { font-size: clamp(24px, 3.2vw, 46px); }
.cap .meta b { font-size: clamp(30px, 2.8vw, 42px); }
.cap h3 { font-size: clamp(22px, 2vw, 30px); }
```

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 92.16px | 5.76rem | 850 | 79.2576px | -1.3824px | h2, em, span |
| 63.2158px | 3.951rem | 850 | 54.3656px | -0.948237px | h3, span |
| 53.2px | 3.325rem | 850 | 47.88px | -0.532px | div, span |
| 48.64px | 3.04rem | 800 | 44.7488px | -0.2432px | h3 |
| 40.96px | 2.56rem | 800 | 38.912px | -0.8192px | span, p |
| 35.84px | 2.24rem | 800 | 32.256px | -0.3584px | b |
| 30.9px | 1.9312rem | 750 | 27.81px | 0.309px | a |
| 25.6px | 1.6rem | 800 | 24.32px | -0.128px | h3 |
| 19.2px | 1.2rem | 400 | 27.84px | normal | p |
| 17px | 1.0625rem | 400 | 25.5px | normal | p |
| 16px | 1rem | 400 | normal | normal | html, head, meta, link |
| 15px | 0.9375rem | 400 | 21.75px | normal | p, b, span |
| 14px | 0.875rem | 500 | normal | normal | button, p |
| 13px | 0.8125rem | 400 | normal | normal | span |
| 12px | 0.75rem | 400 | 18px | normal | p |

### Heading Scale

```css
h2 { font-size: 92.16px; font-weight: 850; line-height: 79.2576px; }
h3 { font-size: 63.2158px; font-weight: 850; line-height: 54.3656px; }
h3 { font-size: 48.64px; font-weight: 800; line-height: 44.7488px; }
h3 { font-size: 25.6px; font-weight: 800; line-height: 24.32px; }
```

### Body Text

```css
body { font-size: 11px; font-weight: 400; line-height: 18.7px; }
```

### Font Weights in Use

`400` (593x), `800` (25x), `850` (13x), `500` (12x), `750` (11x), `600` (8x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-38 | 38px | 2.375rem |
| spacing-51 | 51px | 3.1875rem |
| spacing-58 | 58px | 3.625rem |
| spacing-71 | 71px | 4.4375rem |
| spacing-76 | 76px | 4.75rem |
| spacing-90 | 90px | 5.625rem |
| spacing-96 | 96px | 6rem |
| spacing-101 | 101px | 6.3125rem |
| spacing-110 | 110px | 6.875rem |
| spacing-154 | 154px | 9.625rem |
| spacing-427 | 427px | 26.6875rem |
| spacing-444 | 444px | 27.75rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 6px | 8 |
| md | 10px | 8 |

## CSS Custom Properties

### Other

```css
--studio: #F8F8F6;
--ink: #0B0B0B;
--paper: #F2F2F2;
--soft: #8A8A85;
--inset: max(clamp(28px, 4.5vw, 72px), env(safe-area-inset-left, 0px));
--line: #262624;
--signal: #FAF600;
--display: "Archivo", "Arial Narrow", system-ui, sans-serif;
--sans: "Geist", system-ui, -apple-system, "Segoe UI", sans-serif;
--mono: "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| md | 760px | max-width |
| md | 780px | min-width |
| 860px | 860px | max-width |
| xl | 1240px | max-width |

## Transitions & Animations

**Easing functions:** `cubic-bezier(0.2, 0.7, 0.2, 1)`

**Durations:** `0.3s`, `0.45s`, `1s`, `0.4s`, `0.2s`, `0.25s`

### Common Transitions

```css
transition: all;
transition: opacity 0.3s;
transition: filter 0.45s;
transition: color 0.3s;
transition: transform 1s cubic-bezier(0.2, 0.7, 0.2, 1);
transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1), color 0.2s;
transition: color 0.2s;
transition: transform 0.4s cubic-bezier(0.2, 0.7, 0.2, 1);
transition: background 0.25s, color 0.25s, border-color 0.25s;
```

### Keyframe Animations

**marquee**
```css
@keyframes marquee {
  100% { transform: translate3d(-50%, 0px, 0px); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (2 instances)

```css
.buttons {
  background-color: rgb(11, 11, 11);
  color: rgb(248, 248, 246);
  font-size: 14px;
  font-weight: 500;
  padding-top: 12px;
  padding-right: 18px;
  border-radius: 0px;
}
```

### Inputs (1 instances)

```css
.inputs {
  color: rgb(11, 11, 11);
  border-color: rgb(11, 11, 11);
  border-radius: 0px;
  font-size: 16px;
  padding-top: 0px;
  padding-right: 14px;
}
```

### Links (23 instances)

```css
.links {
  color: rgb(226, 226, 221);
  font-size: 16px;
  font-weight: 400;
}
```

### Navigation (1 instances)

```css
.navigation {
  color: rgb(255, 255, 255);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (1 instances)

```css
.footer {
  color: rgb(138, 138, 133);
  padding-top: 32px;
  padding-bottom: 32px;
  font-size: 11px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgb(11, 11, 11);
  color: rgb(248, 248, 246);
  padding: 12px 18px 12px 18px;
  border-radius: 0px;
  border: 1px solid rgb(11, 11, 11);
  font-size: 14px;
  font-weight: 500;
```

### Input — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(11, 11, 11);
  padding: 0px 14px 0px 14px;
  border-radius: 0px;
  border: 1px 0px 1px 1px solid none solid solid rgb(11, 11, 11);
  font-size: 16px;
  font-weight: 400;
```

## Layout System

**54 grid containers** and **62 flex containers** detected.

### The System

- **Column system** — 2 columns
- **Gap scale** — 4px · 6px · 10px · 12px · 14px · 16px · 18px · 20px
- **Fluid layout** — 4 clamp/viewport declarations

```css
.reel { gap: clamp(32px, 4vw, 64px); }
.reel-intro { width: calc(min(64vw, 760px) - (0.97 * clamp(44px, 7.2vw, 118px))); }
.media { width: min(calc(var(--mh) * var(--ar)), calc(100vw - 72px)); }
.frame:first-of-type .media { width: calc(0.9 * min(calc(var(--mh) * var(--ar)), calc(100vw - 72px))); }
```

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 100% | 8px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 1-column | 37x |
| 2-column | 16x |
| 8-column | 1x |

### Grid Templates

```css
grid-template-columns: 1240px;
gap: 16px;
grid-template-columns: 756px;
gap: 18px;
grid-template-columns: 603.094px;
gap: 18px;
grid-template-columns: 601.109px;
gap: 18px;
grid-template-columns: 275.625px 230px;
gap: 18px 28px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 45x |
| row/wrap | 17x |

**Gap values:** `0px 10px`, `4px`, `6px`, `6.18px`, `10px`, `10px 18px`, `12px 48px`, `12px`, `14px`, `14px 48px`, `16px`, `18px`, `18px 28px`, `20px`, `28px`, `32px 48px`, `51.2px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 2 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#f8f8f6` | `#0b0b0b` | 18.51:1 | AAA |

## Design System Score

**Overall: 87/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 92/100 |
| Typography Consistency | 80/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 85/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 75/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 357 duplicate CSS declarations

## Gradients

**1 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 90deg | 2 | brand |

```css
background: linear-gradient(90deg, rgb(74, 74, 70) 62.5%, rgb(138, 138, 133) 62.5%);
```

## Z-Index Map

**3 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| sticky | 19,20 | div.t.o.p.b.l.u.r, header.c.h.r.o.m.e. .g.u.t.t.e.r |
| base | -1,-1 | canvas |

## SVG Icons

**17 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| xs | 4 |
| xl | 13 |

**Icon colors:** `rgb(207, 207, 202)`, `rgb(0, 0, 0)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Archivo | self-hosted | 300 900 | normal |
| Geist | self-hosted | 400 600 | normal |
| Geist Mono | self-hosted | 400 500 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| general | 8 | objectFit: contain, borderRadius: 0px, shape: square |

**Aspect ratios:** 9:16 (4x), 16:9 (2x), 3:4 (1x), 25.28:1 (1x)

## Motion Language

**Feel:** responsive · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |
| `lg` | `450ms` | 450 |
| `xl` | `1s` | 1000 |

### Easing Families

- **ease-out** (14 uses) — `cubic-bezier(0.2, 0.7, 0.2, 1)`

## Component Anatomy

### button — 2 instances

**Slots:** label

## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Sentence case (tight)

### Top CTA Verbs

- **copy** (1)
- **subscribe** (1)

### Button Copy Patterns

- "copy email" (1×)
- "subscribe" (1×)

### Sample Headings

> CREATOR
JOURNEY.
> FITNESS
> PRODUCTIVITY
> GAMING STREAMER
> STREAMING PODCAST
> WHERE YOU'LL FIND ME.
> BEN KALUZA
> STUDIO
> OS
> LAB

## Page Intent

**Type:** `landing` (confidence 0.31)
**Description:** Ben Kaluza. Part creator, part machine. Creator at the intersection of tech, content and creative.

Alternates: blog-post (0.35)

## Section Roles

Reading order (top→bottom): nav → nav → content → content → content → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.4 |
| 1 | nav | — | 0.9 |
| 2 | content | CREATOR
JOURNEY. | 0.3 |
| 3 | content | WHERE YOU'LL FIND ME. | 0.3 |
| 4 | content | BRAND PARTNERSHIPS | 0.3 |
| 5 | footer | — | 0.95 |

## Material Language

**Label:** `flat` (confidence 0.55)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.134 |
| Shadow profile | none |
| Avg shadow blur | 0px |
| Max radius | 10px |
| backdrop-filter in use | no |
| Gradients | 1 |

## Imagery Style

**Label:** `photography` (confidence 0.563)
**Counts:** total 8, svg 0, icon 0, screenshot-like 0, photo-like 7
**Dominant aspect:** portrait
**Radius profile on images:** square

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Archivo` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
