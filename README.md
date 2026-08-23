# Vastisol

Marketing site for Vastisol — a global outsourcing and business operations company.

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Motion.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

Other commands:

```bash
npm run build
```

```bash
npm run lint
```

---

## Editing the copy

**Almost all wording lives in one file: [`src/lib/content.ts`](src/lib/content.ts).**

The components read from it and contain no hard-coded marketing text, so you can
rewrite headlines, service lists, process steps and form options there without
touching any layout code.

A few conventions in that file:

- `hero.heading` and `propertyManagement.heading` are two-part arrays. The
  second part renders in italic accent green.
- `solutions.items[].points` are the bullet lists on each solution row.
- `contactPage.needs` and `contactPage.teamSizes` drive the contact form's
  options — add or remove entries and the form updates.

### Things to change before launch

| Where | What |
|---|---|
| `src/lib/content.ts` → `site.url` | Set to the real domain (used for SEO metadata) |
| `src/lib/content.ts` → `site.email` | Set to the real inbox (currently `hello@vastisol.com`) |
| `.env.local` | Add `RESEND_API_KEY` so the contact form actually sends (see below) |
| `src/app/favicon.ico` | Replace the default Next.js icon |

The site deliberately contains **no statistics, client names, testimonials,
awards or years-of-experience claims** — nothing it can't currently back up.
Add proof only when it's real.

---

## Contact form

`POST /api/contact` validates the submission server-side and emails it via
Resend's REST API (no SDK dependency).

Copy `.env.example` to `.env.local` and fill in:

```
RESEND_API_KEY=re_...
CONTACT_TO=hello@vastisol.com
CONTACT_FROM=Vastisol Website <website@vastisol.com>
```

`CONTACT_FROM` must be on a domain you've verified in Resend.

**Until `RESEND_API_KEY` is set**, submissions are logged to the server console
and no email is sent — the form still reports success so the flow can be tested
locally. Set the key before launch, or swap the `fetch` call in
[`src/app/api/contact/route.ts`](src/app/api/contact/route.ts) for another
provider (Formspree, SendGrid, Postmark).

---

## Design system

Tokens live in the `@theme` block at the top of
[`src/app/globals.css`](src/app/globals.css).

### Palette

The three brand colours, and the neutrals derived from them. Because the brand
palette is entirely dark, the light surfaces are cool and blue-tinted rather
than plain grey — that keeps everything on-brand.

| Token | Value | Use |
|---|---|---|
| `midnight` / `ink` / `night` | `#00171f` | Headings, dark bands |
| `navy` / `accent-text` | `#003459` | Accent text, eyebrows, gradient end |
| `teal` / `accent` | `#007ea7` | CTAs, graphics, highlights |
| `paper` | `#f4f8fa` | Page canvas |
| `paper-sunk` | `#e8f0f4` | Alternating section bands |
| `ink-muted` | `#4a5d68` | Body copy (6.4:1 on paper) |
| `rule` | `#d3e2ea` | Hairline rules |
| `sky` | `#56c5e8` | Accent on dark (9.2:1 on night) |
| `night-muted` | `#9fb6c2` | Body copy on dark (8.7:1) |

**Contrast note:** `#007ea7` sits at 4.3:1 on paper — fine for large text,
buttons and graphics, but *not* body-size text. Use `accent-text` (`#003459`,
12:1) whenever accent-coloured text needs to meet 4.5:1. The variants are
already split this way in the tokens, so reach for `text-accent-text` on copy
and `bg-teal` / `text-teal` on UI.

### Gradient utilities

| Class | What it does |
|---|---|
| `.gradient-text` | Teal → navy sweep on headings (near-horizontal so multi-line headings colour evenly) |
| `.gradient-text-dark` | White → sky, for headings on the dark bands |
| `.gradient-night` | Layered radial + linear navy field used by the dark sections |
| `.edge-light` | Thin teal light along a card's top edge |
| `.rule-fade` | Hairline that fades out at both ends |

Primary buttons use a teal → navy gradient that slides on hover.

### Type

**Poppins** carries the brand voice — wordmark, navigation, all headings,
buttons and small uppercase labels. **Inter** handles long-form body copy,
where it reads better at small sizes.

---

## Motion

### Content motion

Primitives in [`src/components/motion/index.tsx`](src/components/motion/index.tsx):

- `<FadeUp>` — fade and rise, the workhorse for section blocks
- `<Stagger>` / `<StaggerItem>` — sequenced list and grid entrances
- `<AnimatedText>` — word-by-word masked rise for headings

House easing is `[0.16, 1, 0.3, 1]` — a long, soft decelerate. Everything
animates once on entry; nothing loops.

### Ambient background motion

Components in [`src/components/ambient/`](src/components/ambient):

- `<Constellation>` — drifting clusters of connected nodes. The motif is
  deliberate: nodes joined into groups is what Vastisol sells. Each cluster is
  a single `<g>` that drifts and rotates as a unit, so the connecting lines stay
  attached with no per-frame JavaScript.
- `<Glow>` — blurred brand-coloured blobs on opposing drift cycles
- `<DotGrid>` — slowly panning dot grid, radially masked at the edges
- `<AmbientLayer>` — wrapper that holds these behind content, inert to pointers
  and screen readers

All of it animates on `transform` and `opacity` only, so it stays on the
compositor and never triggers layout. Node coordinates are hand-authored
constants — never `Math.random()` — so server and client markup match.

To make the background more or less prominent, adjust `lineOpacity` and
`nodeOpacity` in `constellation.tsx`, or the `opacity-*` class passed at each
call site.

### Reduced motion

Handled in three places: `<MotionConfig reducedMotion="user">` in the root
layout strips transforms globally, each motion primitive additionally collapses
to a plain fade, and a `prefers-reduced-motion` block in `globals.css` switches
off every CSS animation — including all the ambient drift. Nothing relies on
movement to become readable.

---

## Deploying

The site builds to static pages plus one dynamic route (the contact API), so it
works on any Node host. Vercel is the least-effort option:

1. Push the repo to GitHub.
2. Import it at vercel.com — the Next.js preset needs no configuration.
3. Add `RESEND_API_KEY`, `CONTACT_TO` and `CONTACT_FROM` under
   Settings → Environment Variables.
4. Point your domain at the deployment and update `site.url` in
   `src/lib/content.ts`.
