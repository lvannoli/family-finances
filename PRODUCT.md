# Product

## Register

product

## Users

Primarily a two-person household (the owner and their partner) tracking shared UK
savings across devices — the reason the app has bidirectional, per-item encrypted
sync between an iPhone and a Mac. But the app is also meant to be picked up and used
**independently by anyone**: no account, no sign-up, no server. A person who has
never met the owner can open the URL, add it to their Home Screen, enter their own
accounts, and run their own private household copy. So there are two audiences at
once: the owner's household, and any self-serve stranger who wants the same tool.

Context of use: quick, occasional check-ins on a phone (standing in a kitchen, at a
desk) — "how much have we saved, are we on track, how much ISA allowance is left."
Not an all-day workstation tool. Sessions are short and low-stakes.

## Product Purpose

Family Finances is a single-file, client-side PWA for tracking UK savings and
tax-advantaged accounts (Cash ISA, Stocks & Shares ISA, LISA, general savings,
business) — balances, per-account interest/growth forecasts, and ISA/LISA allowance
usage. All data lives only in the browser's `localStorage`; devices sync by sharing
an AES-256-GCM encrypted bundle out-of-band (share sheet / clipboard / file) and
merging per item. There is no backend and no telemetry.

Success looks like: the owner (and anyone else) trusts it enough to keep their real
numbers in it, opens it without friction, and gets a truthful answer to "where do we
stand" in seconds — without ever worrying where the data went.

## Brand Personality

A blend of **calm, trustworthy, minimal** and **warm, reassuring, human** — the two
directions the owner wants to feel out together. Quiet confidence, not clinical
coldness: an unfussy private money tool that gets out of the way, but speaks plainly
and kindly (money is stressful; the copy should reassure, never nag or hype).
Voice: plain-English, honest, understated. Three words: **calm, trustworthy, warm.**

## Anti-references

- **Playful / gamified fintech** (Monzo/Revolut "fun money"): no confetti, mascots,
  streaks, badges, bright gradients, or emoji-as-personality. (We deliberately
  removed all emoji icons in favour of a quiet monochrome SVG set.)
- **Crypto / trading apps**: no neon-on-black, tickers, hype, pervasive red/green,
  or aggressive dark-by-default. Amount direction is shown with a small ↑/↓ glyph and
  a single restrained red — not a green/red casino.
- Also avoid the cluttered high-street **bank-app dashboard** (tile soup, upsells,
  notification badges) — calm and single-number-first instead.

## Design Principles

1. **Privacy is the product.** Data never leaves the device; trust is earned by
   transparency (the passphrase is never in the shared file; nothing is sent anywhere).
2. **Calm over comprehensive.** Lead with the one number that matters; put density
   (month-by-month tables, all transactions) behind a tap. Whitespace over chrome.
3. **Usable by a stranger, alone.** No account, no setup ceremony, no dependency on
   the owner. First run and empty states must make sense with zero context.
4. **Honest about money.** No false precision — forecasts are labelled estimates,
   balance sources are captioned, destructive actions confirm and can be undone.
5. **A quiet utility, not an engagement machine.** Success is the user leaving
   quickly with their answer — never retention tricks or manufactured urgency.

## Accessibility & Inclusion

Target **WCAG 2.1 AA**: body text ≥4.5:1 contrast, large text ≥3:1. Honor
`prefers-reduced-motion` (already implemented — transitions collapse to instant).
Interactive controls meet a ≥44px tap target. Keep the single-blue-accent +
monochrome palette legible without relying on colour alone (the ↑/↓ glyph carries
amount direction independently of the red).
