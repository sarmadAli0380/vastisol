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

const VIEWPORT = { once: true, amount: 0.2, margin: "0px 0px -10% 0px" } as const;

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
  duration = 0.7,
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
  each = 0.08,
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
  };

  return (
    <Tagged tag={as} className={className} variants={variants}>
      {children}
    </Tagged>
  );
}

const WORD_VARIANTS: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

/**
 * Word-by-word rise, each word masked by its own clipping box so the line
 * appears to lift off the baseline. Used on the hero and section headings.
 *
 * Splitting on words rather than characters keeps text selectable, leaves
 * natural line wrapping intact, and reads as a single gesture instead of a
 * typewriter effect. The full string is exposed via aria-label with the
 * word spans hidden, so assistive tech reads it as one phrase.
 */
export function AnimatedText({
  text,
  className,
  as = "span",
  delay = 0,
  each = 0.045,
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
      aria-label={text}
    >
      {words.map((word, i) => (
        // The separating space sits OUTSIDE the mask as its own text node.
        // Inside an inline-block it would be collapsed away, running the
        // words together; outside, it also stays a valid line-break point.
        <Fragment key={`${word}-${i}`}>
          <span
            aria-hidden="true"
            // Vertical padding stops descenders (g, y, p) being clipped by the mask.
            className="inline-block overflow-hidden py-[0.08em] align-bottom"
          >
            <motion.span className="inline-block" variants={WORD_VARIANTS}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tagged>
  );
}

export { motion, useReducedMotion };
