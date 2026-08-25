"use client";

import { howItWorks } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import {
  AnimatedText,
  FadeUp,
  Stagger,
  StaggerItem,
  motion,
} from "@/components/motion";
import { AmbientLayer, Glow } from "@/components/ambient";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden border-b border-rule bg-gradient-to-b from-paper via-paper-sunk to-paper-sunk py-section lg:py-section-lg"
    >
      <AmbientLayer>
        <Glow />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <FadeUp>
            <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
          </FadeUp>
          <AnimatedText
            as="h2"
            text={howItWorks.heading}
            className="mt-7 block text-[2rem] font-semibold leading-[1.12] sm:text-[2.5rem] lg:text-[3rem]"
            delay={0.08}
          />
          <FadeUp delay={0.08}>
            <p className="lead mt-7 text-ink-muted">{howItWorks.lead}</p>
          </FadeUp>
        </div>

        <Stagger
          as="ol"
          delay={0.08}
          each={0.1}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-gradient-to-br from-teal/25 via-rule to-navy/20 shadow-[0_24px_60px_-32px_rgba(0,52,89,0.45)] sm:grid-cols-2 lg:grid-cols-5"
        >
          {howItWorks.steps.map((step, i) => (
            <StaggerItem
              as="li"
              key={step.title}
              // The fifth step spans both columns at sm so the grid has no
              // empty cell showing through the gradient background.
              className={`group relative flex flex-col bg-card p-7 transition-colors duration-500 hover:bg-accent-tint ${
                i === howItWorks.steps.length - 1
                  ? "sm:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Index n={i + 1} />
                {/* Rule draws out as the card enters, then brightens on hover. */}
                <motion.span
                  aria-hidden="true"
                  className="h-px flex-1 origin-left bg-gradient-to-r from-teal/60 to-transparent transition-all duration-500 group-hover:from-teal"
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: {
                      scaleX: 1,
                      transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
                    },
                  }}
                />
              </div>
              <h3 className="mt-6 text-xl font-semibold transition-colors duration-300 group-hover:text-accent-text">
                {step.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                {step.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
