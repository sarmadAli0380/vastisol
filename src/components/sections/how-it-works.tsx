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

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-rule bg-paper-sunk py-section lg:py-section-lg"
    >
      <Container>
        <div className="max-w-3xl">
          <FadeUp duration={0.6}>
            <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
          </FadeUp>
          <AnimatedText
            as="h2"
            text={howItWorks.heading}
            className="mt-7 block text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:text-[3rem]"
            delay={0.1}
          />
          <FadeUp delay={0.4}>
            <p className="lead mt-7 text-ink-muted">{howItWorks.lead}</p>
          </FadeUp>
        </div>

        <Stagger
          as="ol"
          delay={0.2}
          each={0.11}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-rule sm:grid-cols-2 lg:grid-cols-5"
        >
          {howItWorks.steps.map((step, i) => (
            <StaggerItem
              as="li"
              key={step.title}
              // The fifth step spans both columns at sm so the grid has no
              // empty cell showing through the hairline background.
              className={`flex flex-col bg-card p-7 ${
                i === howItWorks.steps.length - 1
                  ? "sm:col-span-2 lg:col-span-1"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Index n={i + 1} />
                <motion.span
                  aria-hidden="true"
                  className="h-px flex-1 origin-left bg-rule"
                  variants={{
                    hidden: { scaleX: 0 },
                    visible: {
                      scaleX: 1,
                      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                />
              </div>
              <h3 className="mt-6 text-xl">{step.title}</h3>
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
