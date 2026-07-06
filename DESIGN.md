---
name: Family Finances
description: A calm, private, local-first UK savings & ISA tracker — the Quiet Ledger.
colors:
  accent-blue: "#2563eb"
  ink: "#0f172a"
  ink-2: "#475569"
  ink-3: "#94a3b8"
  bg: "#f0f4f8"
  card: "#ffffff"
  border: "#e2e8f0"
  circle-fill: "#eef2f6"
  danger: "#dc2626"
  danger-ink: "#991b1b"
  danger-bg: "#fef2f2"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: "36px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-1px"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.3px"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-.01em"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  input: "10px"
  button: "12px"
  card: "14px"
  sheet: "20px"
  circle: "50%"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.accent-blue}"
    textColor: "{colors.card}"
    rounded: "{rounded.button}"
    padding: "14px"
    typography: "{typography.body}"
  button-secondary:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "14px"
  button-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.card}"
    rounded: "{rounded.button}"
    padding: "14px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "18px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "12px 14px"
  account-circle:
    backgroundColor: "{colors.circle-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.circle}"
    size: "40px"
---

# Design System: Family Finances

## 1. Overview

**Creative North Star: "The Quiet Ledger"**

Family Finances looks like a calm, private book of record — hairline-ruled, written in
ink, with a single blue pen reserved for the things that actually need a decision. It
is a **product** surface (design serves the task), not a marketing page. The whole
system optimises for a 30-second check-in on a phone: one big honest number, then the
accounts beneath it, and everything denser than that folded away behind a tap. Depth
comes from whitespace and thin rules, not from shadows or colour.

The palette is near-monochrome on a soft blue-grey ground, with exactly one accent —
blue `#2563eb` — carrying primary actions, the active nav item, and focus. Icons are a
quiet set of filled monochrome SVG glyphs that take their colour from their
surroundings (`currentColor`); an account is shown as its initial in a neutral grey
circle. Type is a single system stack (`-apple-system`) across a tight five-step scale.

This system explicitly rejects the two things `PRODUCT.md` names as anti-references:
**playful / gamified fintech** (no confetti, mascots, streaks, badges, bright
gradients, or emoji-as-personality — every emoji icon was deliberately replaced with
the monochrome SVG set) and **crypto / trading aggression** (no neon-on-black, tickers,
pervasive red/green, or dark-by-default). It also stays clear of the cluttered
high-street **bank-app dashboard** (tile soup, upsells, notification badges).

**Key Characteristics:**
- One number first; density (month-by-month tables, full transaction lists) behind a tap.
- Near-monochrome + a single blue accent used on ≤10% of any screen.
- Flat by default — hairline borders and whitespace do the separating, not shadows.
- No emoji, no per-type colours; account identity is an initial in a grey circle.
- Mobile-first, capped at a 430px column that centres on desktop.

## 2. Colors

A near-monochrome palette on a soft blue-grey ground, disciplined to a single blue accent.

### Primary
- **Ledger Blue** (`#2563eb`): The one accent. Primary buttons, the active bottom-nav
  icon + label, input focus borders, and links. Never decorative — its rarity is the point.

### Neutral
- **Ink** (`#0f172a`): Primary text, big balance numbers, account initials.
- **Slate** (`#475569`): Secondary text — captions, sub-labels, inactive nav, section headings.
- **Mist** (`#94a3b8`): Tertiary / hint text only.
- **Blue-Grey Ground** (`#f0f4f8`): The body background and secondary-button fill.
- **Card White** (`#ffffff`): Cards, header, bottom nav, sheets.
- **Hairline** (`#e2e8f0`): All borders, row separators, dividers.
- **Circle Fill** (`#eef2f6`): The neutral grey disc behind an account initial and header icon buttons.

### Danger (used sparingly)
- **Restrained Red** (`#dc2626`): Destructive actions and negative amounts only. Paired
  with a `↓` glyph so direction never depends on colour alone. Error panels use a
  deeper red ink (`#991b1b`) on a pale red wash (`#fef2f2`).

### Named Rules
**The One Blue Rule.** Blue `#2563eb` is the only accent and appears on ≤10% of any
screen — actions, active state, focus, links. If a second accent hue shows up, it's wrong.

**The No-Casino Rule.** Positive and neutral amounts render in **ink**, not green.
Only negatives get the single restrained red, and the `↑`/`↓` glyph — not colour —
is the primary signal. There is no pervasive green/red.

## 3. Typography

**Display / Body / Label Font:** one system stack — `-apple-system, BlinkMacSystemFont,
'SF Pro Text', sans-serif`. No pairing, no web fonts.

**Character:** Native, invisible, trustworthy. The system font renders like the OS the
user already trusts; personality comes from weight, size, and generous spacing — never
from a decorative face.

### Hierarchy
- **Display** (600, 30–36px, line-height 1.1, letter-spacing −1px): The one big number —
  Home "Total savings", account balance, forecast-in-12-months. Tight tracking, weight 600.
- **Headline** (700, 18px, letter-spacing −.3px): Screen/header titles (`.hd h1`).
- **Title** (600, 17px): Empty-state titles, in-card leads.
- **Body** (400–500, 15–16px, line-height 1.5): List rows, captions, inputs (16px on
  inputs to prevent iOS zoom-on-focus). Letter-spacing −.01em site-wide.
- **Label** (600, 13px, sentence case): Quiet section headings (`.sec-title`) and
  small captions (12px); bottom-nav labels are 10px.

### Named Rules
**The Sentence-Case Rule.** Headings are sentence case at weight 600 — never
uppercase, never letter-spaced eyebrows. Section headings are quiet, not shouty.

**The Weight Ceiling.** 700 is the heaviest weight in the system (headers only);
everything else is 600 or 400–500. No 800/900.

## 4. Elevation

**Flat by default.** The base `--shadow` token is `none`. Surfaces (cards, list rows)
sit flat on the ground and are separated by 1px hairline borders (`#e2e8f0`) and
whitespace. Shadows appear only where an element genuinely floats above the app.

### Shadow Vocabulary (limited, purposeful)
- **Sheet lift** (`box-shadow: 0 4px 16px rgba(0,0,0,.06)`): Bottom-sheet modals and the
  passphrase bar — the only truly floating surfaces.
- **Nav separation** (`box-shadow: 0 -2px 12px rgba(0,0,0,.07)`): The fixed bottom nav, to lift it off scrolling content.
- **FAB glow** (`box-shadow: 0 4px 14px rgba(37,99,235,.4)`): The single blue `+` add button — the one place colour-glow is allowed, because it's the primary create action.
- **Desktop frame** (`box-shadow: 0 0 60px rgba(0,0,0,.12)` at ≥430px): A soft ambient shadow around the centred phone column on wide screens.

### Named Rules
**The Flat-Ledger Rule.** If separation is needed, reach for a hairline border or more
whitespace before a shadow. A card that isn't floating has no shadow.

## 5. Components

### Buttons
- **Shape:** Rounded rectangle (12px radius), full-width block, 14px padding, 16px/600 text.
- **Primary:** Ledger Blue fill, white text (`.btn-p`).
- **Secondary:** Blue-grey ground fill, ink text (`.btn-s`).
- **Danger:** Restrained red fill, white text (`.btn-d`).
- **Hover / Active:** 0.2s ease transition; `:active` drops opacity to .82 and scales to .99. Reduced-motion collapses this to instant.

### Cards / Containers
- **Corner Style:** 14px radius (`--r`).
- **Background:** Card White with a 1px Hairline border.
- **Shadow Strategy:** None (see Elevation — Flat-Ledger Rule). Sheets are the exception.
- **Internal Padding:** 18px (`.cb`).
- Prefer hairline-separated rows over stacked cards for lists (transactions, menus).

### Inputs / Fields
- **Style:** 1.5px Hairline border, 10px radius, white fill, 16px text (iOS-zoom-safe).
- **Focus:** Border shifts to Ledger Blue (`.fi:focus`). No glow.

### Navigation (bottom tab bar)
- **Style:** Fixed white bar, 1px top hairline, 5 slots: Home · Accounts · **[+]** · Forecast · Settings.
- **Icons:** 24px filled monochrome SVG in Slate; **active tab** icon + label turn Ledger Blue.
- **Center [+]:** A 50px blue circle FAB (the only saturated surface), white plus, blue glow, nudged up over the bar. Tap targets ≥44px; 0.2s transitions.

### Header
- **Style:** Sticky, Card White, ink title (18px/700), 1px hairline bottom border.
  Detail screens use the same plain header (no per-type colour). Header actions are
  44px icon buttons on a Circle-Fill disc.

### Signature Component — The Account Circle
An account is represented by its **initial**, uppercased, in ink, centred in a 40px
neutral grey circle (`#eef2f6`, `border-radius:50%`, flex-centred). No logos, no emoji,
no per-type colour — identity is the letter. Used on Home, Accounts, detail header, and Forecast rows.

### Signature Component — The Passphrase Bar
A fixed bottom sheet that slides up (0.28s ease) to take the sync passphrase on import:
title, password field, inline error line, one blue "Decrypt & Import" button. It is the
one recurring floating surface and carries the Sheet-lift shadow.

## 6. Do's and Don'ts

### Do:
- **Do** lead every screen with one honest number (Display, 30–36px/600), then a
  hairline-separated list beneath it.
- **Do** keep blue `#2563eb` to ≤10% of a screen — actions, active state, focus, links (The One Blue Rule).
- **Do** show amount direction with the `↑`/`↓` glyph; render positives in ink, reserve
  red `#dc2626` for negatives and destructive actions only (The No-Casino Rule).
- **Do** separate with 1px hairlines (`#e2e8f0`) and whitespace before considering a shadow (The Flat-Ledger Rule).
- **Do** represent an account as its initial in a 40px `#eef2f6` circle, flex-centred.
- **Do** keep icons as monochrome filled SVG using `currentColor`; ≥44px tap targets; honor `prefers-reduced-motion`.
- **Do** fold density (month-by-month tables, full transaction lists) behind a "Show all" toggle.

### Don't:
- **Don't** ship **playful / gamified fintech** cues — no confetti, mascots, streaks,
  badges, bright gradients, or emoji-as-icon. (Every emoji was removed for the SVG set; don't reintroduce them.)
- **Don't** drift toward a **crypto / trading app** — no neon-on-black, tickers, hype,
  pervasive red/green, or dark-by-default aggression.
- **Don't** rebuild the cluttered **high-street bank dashboard** — no tile soup, upsells, or notification badges.
- **Don't** reintroduce per-type account colours. The `:root` still holds legacy
  `--savings / --lisa / --business / --other / --primary / --primary-light / --success`
  tokens — these are **deprecated and unused**; account type is conveyed by text label only.
- **Don't** add a second accent hue, uppercase letter-spaced eyebrows, or weights above 700.
- **Don't** put a shadow on a surface that isn't actually floating.
- **Don't** use `border-left`/`border-right` >1px as a coloured accent stripe, or gradient text.
