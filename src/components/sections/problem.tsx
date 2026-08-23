"use client";

import { problem } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem } from "@/components/motion";
import { AmbientLayer, DotGrid } from "@/components/ambient";

export function Problem() {
  return (
    <section
      id="problem"
      className="relative isolate overflow-hidden border-b border-rule py-section lg:py-section-lg"
    >
      <AmbientLayer>
        <DotGrid className="opacity-50" />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <FadeUp duration={0.6}>
                <Eyebrow>{problem.eyebrow}</Eyebrow>
              </FadeUp>

              <AnimatedText
                as="h2"
                text={problem.heading}
                className="mt-7 block text-[1.875rem] font-semibold leading-[1.15] sm:text-[2.25rem] lg:text-[2.5rem]"
                delay={0.05}
              />

              <FadeUp delay={0.06}>
                <p className="lead mt-7 text-ink-muted">{problem.lead}</p>
              </FadeUp>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Stagger as="ul" each={0.05} className="border-t border-rule">
              {problem.items.map((item, i) => (
                <StaggerItem
                  as="li"
                  key={item.title}
                  className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-rule py-7 transition-colors duration-500 hover:border-teal/40 sm:grid-cols-[4rem_1fr]"
                >
                  <div className="pt-1.5">
                    <Index n={i + 1} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-snug transition-colors duration-300 group-hover:text-accent-text">{item.title}</h3>
                    <p className="mt-2.5 text-ink-muted">{item.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <FadeUp delay={0.05}>
              <p className="gradient-text mt-8 font-display text-2xl font-semibold tracking-[-0.025em]">
                {problem.closing}
              </p>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
}
