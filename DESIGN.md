---
name: Family Finances
description: A calm, private UK savings & ISA tracker — soft, rounded, pastel-per-account.
colors:
  accent-blue: "#2563eb"
  up-green: "#047857"
  danger: "#dc2626"
  ink: "#0f172a"
  ink-2: "#475569"
  ink-3: "#94a3b8"
  bg: "#f0f4f8"
  card: "#ffffff"
  border: "#e2e8f0"
  circle-fill: "#eef2f6"
  danger-bg: "#fef2f2"
  danger-ink: "#991b1b"
  type-savings-bg: "#d1fae5"
  type-savings-ink: "#047857"
  type-cash-isa-bg: "#e0f2fe"
  type-cash-isa-ink: "#0369a1"
  type-ss-isa-bg: "#fef3c7"
  type-ss-isa-ink: "#b45309"
  type-lisa-bg: "#ede9fe"
  type-lisa-ink: "#6d28d9"
  type-ss-lisa-bg: "#fce7f3"
  type-ss-lisa-ink: "#be185d"
  type-business-bg: "#ccfbf1"
  type-business-ink: "#0f766e"
  type-other-bg: "#e2e8f0"
  type-other-ink: "#475569"
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
rounded:
  input: "14px"
  icon-btn: "14px"
  card: "20px"
  sheet: "24px"
  button: "999px"
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
    backgroundColor: "{colors.type-savings-bg}"
    textColor: "{colors.type-savings-ink}"
    rounded: "{rounded.circle}"
    size: "40px"
---

# Design System: Family Finances

## 1. Overview

**Creative North Star: "The Soft Ledger"**

Family Finances is a calm, private book of record that grew a friendlier skin: **soft
pastels, fully rounded edges, and a colour per kind of money.** It's still a
**product** surface optimised for a 30-second check-in — one honest number, then the
accounts, density behind a tap — but where the old look was austere monochrome, each
account type now carries its own gentle pastel identity, gains read green and drops
read red, and every surface is generously rounded (pill buttons, 20px cards).

Colour here is **soft and functional, never loud.** Pastels are backgrounds; a darker
"ink" of the same hue carries the initials, chart lines, and labels so everything stays
AA-legible. Blue `#2563eb` is reserved for *actions* (primary buttons, active nav,
focus) — it is the one thing you press, distinct from the palette that identifies
accounts. Because the palette is pastel (not neon) and rounded (not slick), it stays
clear of the two anti-references in `PRODUCT.md`: **gamified/confetti fintech** and
**crypto/trading neon**.

**Key Characteristics:**
- One honest number first; density (month-by-month, full transaction lists) behind a tap.
- A pastel colour per account type, on the initial-circle and its forecast line.
- Green for gains, red for drops (with ↑/↓ glyphs so meaning isn't colour-only).
- Everything rounded: pill buttons, 20px cards, 14px fields, 24px sheets, round avatars.
- Blue `#2563eb` = actions only, kept distinct from the identity palette.
- Mobile-first, capped at a 430px column that centres on desktop.

## 2. Colors

Soft pastel-per-type identity + one blue action accent + semantic green/red for money.

### Primary (action accent)
- **Action Blue** (`#2563eb`): primary (pill) buttons, active bottom-nav, input focus,
  links, the `+` FAB, and the **Total** forecast line. Pressing/navigation only — not identity.

### Account-type palette (pastel bg + ink)
Each account type gets a pastel background (on its initial-circle) and a darker ink of
the same hue (initial + that account's forecast line). All pairs pass WCAG AA (≥4.5:1):
- **Personal Savings** — mint `#d1fae5` / ink `#047857`
- **Cash ISA** — sky `#e0f2fe` / ink `#0369a1`
- **Stocks & Shares ISA** — amber `#fef3c7` / ink `#b45309`
- **Cash LISA** — lilac `#ede9fe` / ink `#6d28d9`
- **S&S LISA** — pink `#fce7f3` / ink `#be185d`
- **Business** — teal `#ccfbf1` / ink `#0f766e`
- **Other** — slate `#e2e8f0` / ink `#475569`

### Semantic (money direction)
- **Gain green** (`#047857`, token `--up`): positive amounts, `/mo` deltas, positive
  credits. Darkened from the brighter emerald so it clears AA on white.
- **Drop red** (`#dc2626`): negative amounts/deltas. Error panels use `#991b1b` ink on `#fef2f2`.
- Direction is always paired with a `↑`/`↓` glyph — never conveyed by colour alone.

### Neutral
- **Ink** `#0f172a` (primary text/numbers), **Slate** `#475569` (secondary/captions),
  **Mist** `#94a3b8` (hints), **Ground** `#f0f4f8` (body bg), **Card** `#ffffff`,
  **Hairline** `#e2e8f0` (borders/rows), **Circle-fill** `#eef2f6` (neutral fallback avatar).

### Named Rules
**The Identity-vs-Action Rule.** The pastel palette *identifies* (which account / which
line). Blue *acts* (what you press). Never use a type pastel for a button, or blue for an
account identity — the two languages must not blur.

**The Pastel-not-Neon Rule.** Colour lives in soft pastel backgrounds with AA-legible ink
on top. No saturated fills behind text, no glow, no gradient — pastel keeps it calm.

## 3. Typography

**One family:** `-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif`. No pairing, no web fonts.
**Character:** native and trustworthy; hierarchy from weight/size/space, not decorative faces.

### Hierarchy
- **Display** (600, 30–36px, −1px tracking): the one big number (Home total, balance, 12-mo forecast). Applied via the `.num-display` class (34px/600/-1px) — the single big-number style.
- **Headline** (700, 18px): screen/header titles.
- **Title** (600, 17px): empty-state titles, in-card leads.
- **Body** (400–500, 15–16px, lh 1.5): rows, captions, inputs (16px on inputs to avoid iOS zoom).
- **Label** (600, 13px, sentence case): quiet section headings + small captions.

### Named Rules
**The Sentence-Case Rule.** Headings are sentence case at weight 600 — never uppercase, never tracked eyebrows.
**The Weight Ceiling.** 700 is the heaviest weight (headers only); no 800/900.

## 4. Elevation

**Flat by default, now rounded.** Base `--shadow` is `none`; surfaces sit flat on the
ground, separated by 1px hairlines and whitespace. Corners are generous (20px cards).
Shadows appear only where something genuinely floats.

### Shadow Vocabulary
- **Sheet lift** `0 4px 16px rgba(0,0,0,.06)` — bottom-sheet modals + passphrase bar.
- **Nav separation** `0 -2px 12px rgba(0,0,0,.07)` — the fixed bottom nav.
- **FAB glow** `0 4px 14px rgba(37,99,235,.4)` — the single blue `+` add button.
- **Desktop frame** `0 0 60px rgba(0,0,0,.12)` — ambient shadow around the centred column at ≥430px.

### Named Rules
**The Flat-Ledger Rule.** Reach for a hairline or whitespace before a shadow. A surface that isn't floating has no shadow.

## 5. Components

### Buttons
- **Shape:** **pill** (`border-radius:999px`), full-width block, 14px padding, 16px/600.
- **Primary:** Action Blue fill, white text. **Secondary:** ground fill, ink text. **Danger:** red fill, white.
- **Active:** 0.2s ease; `:active` opacity .82 + scale .99. Reduced-motion → instant. Keyboard focus → visible `:focus-visible` blue ring.

### Cards / Containers
- **Corners:** 20px (`--r`). **Background:** white + 1px hairline. **Shadow:** none (Flat-Ledger). **Padding:** 18px.
- Prefer hairline-separated rows over stacked cards for lists.

### Inputs / Fields
- **Style:** 1.5px hairline, 14px radius, white, 16px text (iOS-zoom-safe). **Focus:** border → Action Blue.

### Navigation (bottom tab bar)
- Fixed white bar, 1px top hairline. Icons: 24px filled monochrome SVG in Slate; **active** = Action Blue.
- **Center `+`:** 50px blue circle FAB, **centred SVG plus**, blue glow. Tap targets ≥44px.

### Signature — Account Circle (per-type)
An account = its uppercased **initial** in a **pastel circle of its type colour** (bg =
type pastel, initial = type ink), flex-centred, 40px, `border-radius:50%`. No logos/emoji.
Used on Home, Accounts, detail header, Forecast rows.

### Signature — Forecast trend lines (interactive)
The Forecast chart always shows a **bold blue Total** line. Each account in the "Per
Account" list is an accessible **toggle** (`role=button`, `aria-pressed`, a colour dot):
tap it to add/remove that fund's own projected line, drawn in its **type ink** colour.
Default = total only; selection persists while on the tab and resets when you leave.

### Signature — Passphrase bar
Fixed bottom sheet (slides up 0.28s) for the import passphrase: title, field, inline error, one blue "Decrypt & Import" button. Carries the Sheet-lift shadow.

## 6. Do's and Don'ts

### Do:
- **Do** lead each screen with one honest number, then a hairline-separated list.
- **Do** give each account type its pastel identity (bg) + AA-legible ink (initial, line).
- **Do** use green `--up #047857` for gains and red `#dc2626` for drops, always with a ↑/↓ glyph (never colour-only).
- **Do** keep blue `#2563eb` for actions/active/focus only — distinct from the identity palette (Identity-vs-Action Rule).
- **Do** round generously: pill buttons, 20px cards, 14px fields, 24px sheets, round avatars.
- **Do** keep icons monochrome filled SVG (`currentColor`), ≥44px tap targets, honour `prefers-reduced-motion`.
- **Do** fold density (month-by-month, full lists, per-account lines) behind a tap/toggle.

### Don't:
- **Don't** slide into **gamified/confetti fintech** — no mascots, streaks, badges, bright saturated fills, gradients, or emoji-as-icon. Pastel ≠ playful-loud.
- **Don't** drift toward **crypto/trading neon** — no neon-on-black, tickers, pervasive high-saturation red/green, dark-by-default.
- **Don't** rebuild the cluttered **high-street bank dashboard** — no tile soup, upsells, notification badges.
- **Don't** blur the two colour languages: no type-pastel on a button, no action-blue as an account identity.
- **Don't** put saturated colour behind text, add glows/gradients, or use `border-left`/`border-right` >1px as a coloured stripe.
- **Don't** exceed weight 700 or use uppercase tracked eyebrows.

<!-- History: this system began as the austere-monochrome "Quiet Ledger" (one blue accent, no per-type colour). The user chose a warmer, pastel, rounded, colour-per-type direction; the former "One Blue Rule" and "no per-type colours" doctrines are intentionally retired and replaced by the Identity-vs-Action + Pastel-not-Neon rules above. -->
