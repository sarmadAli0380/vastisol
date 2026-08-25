"use client";

import {
  motion,
  useReducedMotion,
  type MotionProps,
  type Variants,
} from "motion/react";
import { Fragment, type ReactNode } from "react";

/**
 * Motion primitives.
 *
 * The whole system is tuned for calm: one gentle curve, durations around a
 * second, and generous overlap between neighbouring elements so a section
 * arrives as a single slow wash rather than a series of separate arrivals.
 * Everything animates once on entry; nothing loops or demands attention.
 *
 * THESE ANIMATE POSITION ONLY — NEVER OPACITY. Text is painted at full
 * opacity from the very first frame and merely glides into place.
 *
 * This is a hard rule, and it exists because breaking it caused two critical
 * defects. When these primitives started at `opacity: 0`, that zero was
 * server-rendered onto every paragraph and every word of every heading — 230
 * inline `opacity:0` declarations on the home page. The consequences an audit
 * measured:
 *
 *   - Largest Contentful Paint went from 216ms to 1716ms on desktop, and from
 *     920ms to 3536ms on a throttled mid-range connection, because the browser
 *     had the text and the fonts but had been told not to show them.
 *   - During an ordinary scroll only 40% of on-screen text was readable at any
 *     moment, because a ~1s fade cannot finish in the ~250ms of lead time a
 *     scrolling reader gives it.
 *
 * Moving something that is already visible costs nothing on either count. If
 * you are tempted to add a fade back, don't — shorten the duration or increase
 * the travel instead.
 *
 * Three values control the feel. Change these rather than individual call
 * sites: EASE (the curve), the durations below, and MAX_STAGGER (how much of
 * a cascade a heading is allowed).
 *
 * REDUCED MOTION: when the user has asked for less motion, these primitives
 * render the final state immediately — no transform, and no fade either.
 *
 * A previous version still ran a 0.7–0.95s opacity fade in that case, on the
 * reasoning that a fade is not "motion". That was wrong in the way that
 * matters: the content was still withheld and still arrived late, which is
 * the thing the preference exists to avoid. The `prefers-reduced-motion`
 * block in globals.css does not help here either — it clamps CSS animation
 * and transition durations, and these animations are driven from JS, so that
 * rule never applies to them. It has to be handled here.
 */

/**
 * House easing — a gentle cubic ease-out.
 *
 * This was previously an exponential ease-out, [0.16, 1, 0.3, 1], which covers
 * roughly 60% of its distance in the first 15% of its duration. Each element
 * snapped into place and then sat still, which reads as popping no matter how
 * long the duration is. A cubic curve distributes the movement evenly, so
 * things glide and settle instead.
 */
export const EASE = [0.215, 0.61, 0.355, 1] as const;

/**
 * Trigger point for entrance animations.
 *
 * The positive bottom margin grows the detection box *past* the fold, so a
 * block starts animating shortly before it scrolls into view and is already
 * settled by the time you're reading it. A negative margin (or a high
 * `amount`) does the opposite: you arrive at a blank space and then watch it
 * fill in, which is what made these feel late.
 */
const VIEWPORT = { once: true, amount: 0.1, margin: "0px 0px 25% 0px" } as const;

/**
 * Ceiling on how long a heading's word stagger may last in total.
 *
 * Without a cap, stagger time scales with word count and a long heading is
 * still assembling while you read it. The cap tightens the gap between words
 * instead of extending the sequence.
 *
 * This is generous relative to word duration on purpose: because each word
 * takes far longer to animate than the gap between words, many words are
 * always in flight at once. That overlap is what makes the line read as one
 * continuous wash rather than a series of individual arrivals.
 */
const MAX_STAGGER = 0.55;

export type MotionTag =
  | "div"
  | "span"
  | "p"
  | "ul"
  | "ol"
  | "li"
  | "h1"
  | "h2"
  | "h3";

type TaggedProps = MotionProps & {
  tag: MotionTag;
  className?: string;
  children?: ReactNode;
  "aria-label"?: string;
};

/**
 * Renders one of a fixed set of motion elements.
 *
 * Written as an explicit switch rather than a lookup table so every element
 * type is statically resolvable — deriving the component from a variable
 * would remount the subtree on each render and restart the animation.
 */
function Tagged({ tag, ...props }: TaggedProps) {
  switch (tag) {
    case "span":
      return <motion.span {...props} />;
    case "p":
      return <motion.p {...props} />;
    case "ul":
      return <motion.ul {...props} />;
    case "ol":
      return <motion.ol {...props} />;
    case "li":
      return <motion.li {...props} />;
    case "h1":
      return <motion.h1 {...props} />;
    case "h2":
      return <motion.h2 {...props} />;
    case "h3":
      return <motion.h3 {...props} />;
    default:
      return <motion.div {...props} />;
  }
}

/** Fade + rise. The workhorse for section blocks. */
export function FadeUp({
  children,
  as = "div",
  delay = 0,
  y = 24,
  duration = 0.95,
  className,
}: {
  children: ReactNode;
  as?: MotionTag;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  // Render as-is: visible, in place, no transition of any kind.
  if (reduce) return <Tagged tag={as} className={className}>{children}</Tagged>;

  return (
    <Tagged
      tag={as}
      className={className}
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </Tagged>
  );
}

/**
 * Parent that releases its <StaggerItem> children in sequence.
 * Use for lists, card grids and the function strip.
 */
export function Stagger({
  children,
  as = "div",
  delay = 0,
  each = 0.1,
  className,
}: {
  children: ReactNode;
  as?: MotionTag;
  delay?: number;
  each?: number;
  className?: string;
}) {
  return (
    <Tagged
      tag={as}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: each, delayChildren: delay } },
      }}
    >
      {children}
    </Tagged>
  );
}

export function StaggerItem({
  children,
  as = "div",
  y = 22,
  className,
}: {
  children: ReactNode;
  as?: MotionTag;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <Tagged tag={as} className={className}>{children}</Tagged>;

  const variants: Variants = {
    hidden: { y },
    visible: { y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <Tagged tag={as} className={className} variants={variants}>
      {children}
    </Tagged>
  );
}

const WORD_VARIANTS: Variants = {
  // Travel is small because the words are visible the whole way — a large
  // offset would read as broken layout rather than as motion.
  hidden: { y: "0.24em" },
  visible: { y: 0, transition: { duration: 1.05, ease: EASE } },
};

/**
 * Word-by-word rise across a heading. Words are fully opaque throughout and
 * only settle upward, so the line is readable from the first frame.
 *
 * Splitting on words rather than characters keeps text selectable, leaves
 * natural line wrapping intact, and reads as a single gesture instead of a
 * typewriter effect. The full string is exposed via aria-label with the word
 * spans hidden, so assistive tech reads it as one phrase.
 */
export function AnimatedText({
  text,
  className,
  as = "span",
  delay = 0,
  each = 0.06,
}: {
  text: string;
  className?: string;
  as?: MotionTag;
  delay?: number;
  each?: number;
}) {
  const reduce = useReducedMotion();

  // Plain text, visible immediately — not split into words, not faded.
  if (reduce) {
    return (
      <Tagged tag={as} className={className}>
        {text}
      </Tagged>
    );
  }

  // Gradient headings animate as ONE unit, never per word.
  //
  // .gradient-text paints its colour by clipping a background to the glyphs.
  // A descendant with a transform gets its own stacking context and is painted
  // separately, so the ancestor's clipped background never reaches it — the
  // text renders fully transparent. Per-word transforms therefore made every
  // gradient heading invisible for the entire ~1s of its animation. It was
  // invisible with opacity:1, so opacity-based checks could not see it.
  //
  // Moving the single transform onto the gradient element itself is safe:
  // an element's own transform carries its background with it.
  //
  // Detected from the class rather than passed as a prop deliberately — a
  // prop is something a future call site can forget, and forgetting it brings
  // back invisible text.
  if (/gradient-text/.test(className ?? "")) {
    return (
      <Tagged
        tag={as}
        className={className}
        initial={{ y: "0.24em" }}
        whileInView={{ y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {text}
      </Tagged>
    );
  }

  const words = text.split(" ");
  const step = Math.min(each, MAX_STAGGER / Math.max(words.length - 1, 1));

  return (
    <Tagged
      tag={as}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: step, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        // The separating space sits OUTSIDE the animated span as its own text
        // node. Inside an inline-block it would be collapsed away, running the
        // words together; outside, it also stays a valid line-break point.
        <Fragment key={`${word}-${i}`}>
          <motion.span
            aria-hidden="true"
            className="inline-block"
            variants={WORD_VARIANTS}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tagged>
  );
}

export { motion, useReducedMotion };
