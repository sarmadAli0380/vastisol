"use client";

import { motion } from "@/components/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

// Kept tight on purpose: the full three-stage build finishes in well under a
// second. Earlier values ran past 2.4s, which read as the page being slow
// rather than as a considered animation.
const DOT_STEP = 0.018; // gap between dots within a stage
const STAGE_GAP = 0.12; // pause between stages
const START = 0.28; // lets the hero headline get moving first

/**
 * Start times are resolved once at module load so each stage waits for the
 * previous one's dots to land — computing them during render would mean
 * mutating state mid-render.
 */
const STAGES = [
  { count: 1, cols: 1, label: "One person", note: "A single embedded team member" },
  { count: 5, cols: 5, label: "A team", note: "Shared processes and standards" },
  {
    count: 20,
    cols: 5,
    label: "An entire function",
    note: "A complete outsourced department",
  },
].map((stage, i, all) => ({
  ...stage,
  startAt:
    START +
    all
      .slice(0, i)
      .reduce((total, s) => total + s.count * DOT_STEP + STAGE_GAP, 0),
}));

/**
 * States the Vastisol model visually: one person → a team → a function.
 * The dots build in sequence so the diagram performs the idea it describes.
 * Purely diagrammatic — it asserts no numbers about the business itself.
 */
export function GrowthDiagram() {
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-rule bg-card/85 p-7 shadow-[0_1px_2px_rgba(0,23,31,0.05),0_18px_44px_-20px_rgba(0,52,89,0.28)] backdrop-blur-md sm:p-9">
      {/* Teal edge-light along the top of the card. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal/70 to-transparent"
      />
      <figcaption className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-text">
        The Vastisol model
      </figcaption>

      <div className="mt-7 space-y-7">
        {STAGES.map((stage, stageIndex) => {
          const stageStart = stage.startAt;
          const labelAt = stageStart + stage.count * DOT_STEP;

          return (
            <div key={stage.label}>
              <div
                aria-hidden="true"
                className="grid w-fit gap-1.5"
                style={{ gridTemplateColumns: `repeat(${stage.cols}, 0.75rem)` }}
              >
                {Array.from({ length: stage.count }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="h-3 w-3 rounded-[3px] bg-teal"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{
                      opacity: 0.35 + 0.65 * (1 - i / stage.count),
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.38,
                      delay: stageStart + i * DOT_STEP,
                      ease: EASE,
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.42,
                  delay: labelAt,
                  ease: EASE,
                }}
              >
                <p className="mt-4 text-[0.9375rem] font-medium text-ink">
                  {stage.label}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">{stage.note}</p>
              </motion.div>

              {stageIndex < STAGES.length - 1 && (
                <motion.div
                  aria-hidden="true"
                  className="mt-6 h-px w-full origin-left bg-rule"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: labelAt + 0.1,
                    ease: EASE,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="sr-only">
        Diagram: a Vastisol relationship can begin with one embedded team
        member, grow into a dedicated team working to shared processes, and
        expand into a complete outsourced business function.
      </p>
    </figure>
  );
}
