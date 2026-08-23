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
 * House easing is a long, soft decelerate — content settles rather than
 * bounces, which suits an editorial B2B tone. Everything animates once on
 * entry; nothing loops or demands attention.
 *
 * Reduced motion is honoured twice over: <MotionConfig reducedMotion="user">
 * in the root layout strips transforms globally, and each primitive
 * additionally collapses to a plain fade so nothing relies on movement to
 * become readable.
 */

export const EASE = [0.16, 1, 0.3, 1] as const;

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
 * Without this, stagger time scales with word count — a sixteen-word heading
 * spent ~0.5s rippling before the last word even started, so you could be
 * reading it while it was still assembling. Capping the total keeps a long
 * heading as quick to settle as a short one; only the gap between words
 * tightens.
 */
const MAX_STAGGER = 0.24;

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
  y = 18,
  duration = 0.5,
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

  return (
    <Tagged
      tag={as}
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
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
  each = 0.05,
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
  y = 16,
  className,
}: {
  children: ReactNode;
  as?: MotionTag;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <Tagged tag={as} className={className} variants={variants}>
      {children}
    </Tagged>
  );
}

const WORD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: "0.3em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
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
  each = 0.03,
}: {
  text: string;
  className?: string;
  as?: MotionTag;
  delay?: number;
  each?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <Tagged
        tag={as}
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.5, delay }}
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
