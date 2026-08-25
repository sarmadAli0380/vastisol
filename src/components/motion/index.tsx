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
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
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
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <Tagged tag={as} className={className} variants={variants}>
      {children}
    </Tagged>
  );
}

const WORD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: "0.45em" },
  visible: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
};

/**
 * Word-by-word fade and rise across a heading.
 *
 * Deliberately a fade rather than a clipped mask-reveal. With a mask each word
 * is genuinely absent until its turn arrives, so a heading you are already
 * looking at appears to be still loading. Fading means every word is legible
 * for the whole transition and the line only firms up — which reads as smooth
 * instead of late.
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
