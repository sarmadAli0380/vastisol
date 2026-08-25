"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * First-load brand moment: the Vastisol mark breathes over a full-screen
 * cover while the page settles, then lifts to reveal the site.
 *
 * It dismisses on ACTUAL readiness — web fonts resolved and two frames
 * painted — never on a fixed timer. That distinction matters: a loader on a
 * timer would hold back content the browser had already finished, making the
 * real load worse while pretending to be busy. This one is only ever as long
 * as the work genuinely takes, within the bounds below.
 *
 * The page underneath is fully painted the whole time. Text is not hidden to
 * make this work — it renders at full opacity behind the cover, so Largest
 * Contentful Paint is unaffected by the loader's presence.
 *
 * Shows on a full document load only. Client-side navigation between routes
 * does not remount it, which is correct — there is nothing to wait for.
 */

/** Floor, so a fast load shows a deliberate moment rather than a flicker. */
const MIN_VISIBLE_MS = 700;

/** Ceiling, so a stalled font or slow network can never trap the visitor. */
const MAX_VISIBLE_MS = 2500;

/** How long the lift-away runs before the element is removed outright. */
const EXIT_MS = 700;

type Phase = "showing" | "leaving" | "gone";

export function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("showing");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const startedAt = performance.now();
    let cancelled = false;

    // Phase only ever moves forward.
    //
    // Both the readiness path and the timeout cap below can fire late — the
    // cap in particular is a fixed 2.5s timer that keeps running after a fast
    // load has already finished. Assigning "leaving" unconditionally let it
    // drag a dismissed loader back onto the screen for another full cycle, a
    // second or so after the site had been revealed. Guarding the transition
    // means a late signal is simply ignored.
    const beginLeaving = () => {
      if (cancelled) return;
      setPhase((current) => (current === "showing" ? "leaving" : current));
    };

    const beginExit = () => {
      if (cancelled) return;
      const remaining = MIN_VISIBLE_MS - (performance.now() - startedAt);
      window.setTimeout(beginLeaving, Math.max(0, remaining));
    };

    // Readiness = fonts resolved AND the browser has actually painted.
    // Two nested rAFs put us after the first real paint rather than merely
    // after layout, so we never reveal a half-drawn page.
    //
    // But rAF does NOT fire at all in a backgrounded tab, and opening a link
    // in a new tab is ordinary behaviour. So the paint gate is raced against
    // a short timer, and skipped entirely when the document starts hidden.
    const painted =
      document.visibilityState === "hidden"
        ? Promise.resolve()
        : Promise.race([
            new Promise<void>((resolve) =>
              requestAnimationFrame(() =>
                requestAnimationFrame(() => resolve()),
              ),
            ),
            new Promise<void>((resolve) => window.setTimeout(resolve, 500)),
          ]);

    const fonts = document.fonts?.ready ?? Promise.resolve();

    void Promise.all([fonts, painted]).then(beginExit);

    const cap = window.setTimeout(beginLeaving, MAX_VISIBLE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, []);

  // Removal is driven by a timer, never by the animation finishing.
  //
  // Motion drives transitions from rAF, which is frozen in a background tab,
  // so an unmount that waits on the exit animation leaves the cover stuck on
  // screen indefinitely. setTimeout is throttled there but still fires.
  // A fixed duration, not one derived from reduceMotion: useReducedMotion()
  // resolves from null to a boolean after hydration, and depending on it here
  // would tear down and restart this timer mid-exit, keeping the cover alive
  // for another full interval. By this point the overlay is transparent,
  // inert to pointer events and no longer locking scroll, so how long it
  // lingers before unmounting is invisible either way.
  useEffect(() => {
    if (phase !== "leaving") return;
    const id = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  // Hold the page still underneath, but ONLY while the cover is opaque.
  //
  // Releasing on "gone" instead of "leaving" meant the lock outlived the
  // reveal: for the whole ~700ms exit the site was visible and the overlay
  // was already inert to pointer events, yet body overflow was still hidden,
  // so wheel input did nothing. It read as the page freezing for half a
  // second right after load, then abruptly starting to work.
  //
  // Locking body also removes the scrollbar, which reflows the page by its
  // width and snaps back on release — a visible sideways jump at exactly the
  // moment of the reveal. Compensating with padding keeps the layout still.
  useEffect(() => {
    if (phase !== "showing") return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [phase]);

  const done = phase === "gone";
  const leaving = phase === "leaving";

  if (done) return null;

  return (
    <>
      {
        <motion.div
          // role=status + aria-live announces the wait without stealing focus.
          role="status"
          aria-live="polite"
          // Hook for the <noscript> rule in layout.tsx. Without JS this
          // element is server-rendered and nothing ever dismisses it, so it
          // would cover the site permanently; that rule hides it.
          data-loading-screen=""
          className="fixed inset-0 z-[200] flex items-center justify-center bg-paper"
          initial={{ opacity: 1 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.65,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          // Once leaving, stop intercepting input even mid-fade.
          style={{ pointerEvents: leaving ? "none" : undefined }}
        >
          {/* Same drifting glow as the hero, so the reveal is continuous
              rather than a cut between two different backgrounds. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle closest-side, rgba(0,126,167,0.16) 0%, rgba(0,126,167,0.05) 45%, transparent 78%)",
              }}
            />
          </div>

          <motion.div
            className="relative flex flex-col items-center gap-5"
            animate={
              leaving && !reduceMotion ? { y: -12, scale: 0.97 } : { y: 0, scale: 1 }
            }
            transition={{ duration: 0.65, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <LoaderMark animate={!reduceMotion && !leaving} />
            <span className="font-display text-[1.5rem] font-semibold tracking-[-0.03em] text-midnight">
              Vastisol
            </span>
            <span className="sr-only">Loading</span>
          </motion.div>
        </motion.div>
      }
    </>
  );
}

/**
 * The wordmark's node graph at display size. The whole mark breathes; the
 * three lower nodes light in sequence, which reads as a team assembling —
 * the same idea the site is about.
 */
function LoaderMark({ animate }: { animate: boolean }) {
  const breathe = animate
    ? { animation: "breathe 2.6s ease-in-out infinite", willChange: "transform" }
    : undefined;

  const glow = (index: number) =>
    animate
      ? { animation: `node-glow 2.6s ease-in-out infinite ${index * 0.28}s` }
      : undefined;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 22 22"
      className="h-16 w-16"
      fill="none"
      style={breathe}
    >
      <path
        d="M11 6.4v4.2M11 10.6H4.2v2.8M11 10.6h6.8v2.8M11 10.6v2.8"
        stroke="#007ea7"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="11" cy="3.4" r="2.6" fill="#007ea7" />
      <circle cx="4.2" cy="15.6" r="2.4" fill="#003459" style={glow(0)} />
      <circle cx="11" cy="15.6" r="2.4" fill="#003459" style={glow(1)} />
      <circle cx="17.8" cy="15.6" r="2.4" fill="#003459" style={glow(2)} />
    </svg>
  );
}
