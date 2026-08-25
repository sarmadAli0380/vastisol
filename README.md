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
- `<AnimatedText>` — word-by-word fade and rise for headings

The system is tuned for calm. Everything animates once on entry; nothing loops.

**Three values control the whole feel** — change these rather than individual
call sites:

| Value | Current | Effect |
|---|---|---|
| `EASE` | `[0.215, 0.61, 0.355, 1]` | The curve. Gentle cubic ease-out. |
| durations | ~0.9–1.05s | How long each element takes. |
| `MAX_STAGGER` | `0.55s` | How much cascade a heading is allowed. |

**Why this curve.** An earlier version used `[0.16, 1, 0.3, 1]` — exponential
ease-out, which covers ~60% of its distance in the first 15% of its duration.
Elements snapped into place and then sat still, which reads as *popping* no
matter how long the duration is. The cubic curve spreads the movement evenly so
things glide. If motion ever feels snappy again, suspect the curve before the
duration.

**Why it reads as one wash rather than separate arrivals.** Each word takes
~1.05s while the gap between words is under 0.06s, so many words are always
mid-transition at once. On the sixteen-word Vision heading, all sixteen are in
flight simultaneously around the 800ms mark. Overlap is what makes it smooth —
if you shorten durations without also shortening the stagger, the overlap
collapses and the popping returns.

**Why nothing feels late.** `VIEWPORT.margin` has a **positive** bottom value,
growing the detection box past the fold so a block starts easing in before you
reach it and is fully readable by the time it is centred. A negative margin
does the opposite: you arrive at blank space and watch it fill in.

### The rule that matters most: never animate opacity on text

These primitives animate **position only**. Text is painted at full opacity from
the first frame and merely glides into place.

This is not a style preference — breaking it caused two critical defects that an
audit caught. When the primitives started at `opacity: 0`, that zero was
server-rendered onto every paragraph and every word of every heading:

- **LCP went from 216 ms to 1716 ms** on desktop, and from 920 ms to 3536 ms on a
  throttled mid-range connection. The browser had the text and the fonts and had
  been told not to show them.
- **Only 40% of on-screen text was readable during an ordinary scroll**, because
  a ~1 s fade cannot finish in the ~250 ms of lead time a scrolling reader gives it.

Moving something already visible costs nothing on either count. If motion feels
too plain, shorten the duration or increase the travel — do not add a fade.

### The gradient-heading trap

`.gradient-text` colours text by clipping a background image to the glyphs. **A
descendant with a transform breaks that**: it gets its own stacking context and
is painted separately, so the clipped background never reaches it and the text
renders fully transparent — invisible, but still selectable, and invisible at
`opacity: 1` so opacity-based checks cannot see it.

Two consequences, both already handled — don't undo them:

1. `.gradient-text` sets `display: inline-block` in `globals.css`. A plain
   `inline` box fragments across lines and fails the same way. Callers may
   override with `block`, never with `inline`.
2. `AnimatedText` detects the gradient class and animates the heading as **one
   unit** instead of per word, so the gradient element has no transformed
   descendants. This is detected from the class rather than passed as a prop on
   purpose — a prop is something a call site can forget, and forgetting it
   brings back invisible text.

A quick check for either regression, pasted into the console:

```js
document.querySelectorAll('.gradient-text, .gradient-text-dark').forEach(g =>
  console.log(g.textContent.slice(0, 30),
    [...g.querySelectorAll('*')].filter(d => getComputedStyle(d).transform !== 'none').length))
```

Any non-zero count means that heading is invisible while it animates.

### Loading screen

`src/components/loading-screen.tsx` covers the page on a full document load with
a breathing wordmark, then lifts away.

It dismisses on **actual readiness** — web fonts resolved and the page painted —
never on a fixed timer, with a 700 ms floor so a fast load isn't a flicker and a
2.5 s ceiling so a stalled font can't trap anyone. A timer-based loader would
hold back content the browser had already finished and make the real load worse.

Two things it has to survive, both learned the hard way:

- **`requestAnimationFrame` never fires in a background tab.** Opening a link in
  a new tab is ordinary. So the paint gate is raced against a timer and skipped
  entirely when the document starts hidden.
- **Removal is driven by `setTimeout`, never by the exit animation finishing.**
  Motion drives transitions from rAF, so waiting on the animation left the cover
  stuck on screen indefinitely in a background tab. `setTimeout` is throttled
  there but still fires.
- **The scroll lock releases on `leaving`, not on `gone`.** Releasing it at the
  end of the lifecycle meant the lock outlived the reveal: for the whole exit
  the site was visible and the overlay already inert, yet `body` still had
  `overflow: hidden`, so wheel input did nothing. It read as the page freezing
  for half a second right after load and then abruptly working. The lock also
  compensates for scrollbar width, otherwise the page jumps sideways at the
  exact moment of the reveal.

The page underneath is fully painted the whole time — text is not hidden to make
the loader work, so it does not affect LCP.

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
