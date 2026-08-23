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

**Palette** — warm paper, near-black ink, one restrained accent:

| Token | Value | Use |
|---|---|---|
| `paper` | `#faf9f6` | Page canvas |
| `paper-sunk` | `#f3f1ea` | Alternating section bands |
| `ink` | `#16181b` | Headings |
| `ink-muted` | `#55585e` | Body copy (6.8:1 on paper) |
| `rule` | `#e5e2da` | Hairline rules |
| `accent` | `#16403a` | Deep evergreen (11:1 on paper) |
| `night` | `#14171a` | Dark bands (Vision, final CTA) |
| `mint` | `#7fd1be` | Accent on dark (10:1 on night) |

**Type** — Newsreader (editorial serif) for headings, Inter for body and UI,
JetBrains Mono for the small uppercase section labels and index numbers.

---

## Motion

Primitives live in [`src/components/motion/index.tsx`](src/components/motion/index.tsx):

- `<FadeUp>` — fade and rise, the workhorse for section blocks
- `<Stagger>` / `<StaggerItem>` — sequenced list and grid entrances
- `<AnimatedText>` — word-by-word masked rise for headings

House easing is `[0.16, 1, 0.3, 1]` — a long, soft decelerate. Everything
animates once on entry; nothing loops.

**Reduced motion** is handled in three places: `<MotionConfig reducedMotion="user">`
in the root layout strips transforms globally, each primitive additionally
collapses to a plain fade, and a `prefers-reduced-motion` block in `globals.css`
covers the CSS-only transitions. Nothing relies on movement to become readable.

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
