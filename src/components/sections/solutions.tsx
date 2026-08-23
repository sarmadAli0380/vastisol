"use client";

import { solutions } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem } from "@/components/motion";
import { AmbientLayer, DotGrid } from "@/components/ambient";

export function Solutions() {
  return (
    <section
      id="solutions"
      className="relative isolate overflow-hidden border-b border-rule bg-gradient-to-b from-paper-sunk via-paper-sunk to-paper py-section lg:py-section-lg"
    >
      <AmbientLayer>
        <DotGrid className="opacity-60" />
      </AmbientLayer>

      <Container className="relative z-10">
        <FadeUp duration={0.6}>
          <Eyebrow>{solutions.eyebrow}</Eyebrow>
        </FadeUp>

        <div className="mt-7 grid gap-6 lg:grid-cols-12 lg:gap-16">
          <AnimatedText
            as="h2"
            text={solutions.heading}
            className="block text-[2rem] font-semibold leading-[1.14] sm:text-[2.375rem] lg:col-span-6 lg:text-[2.625rem]"
            delay={0.05}
          />
          <FadeUp
            delay={0.15}
            className="self-end lg:col-span-5 lg:col-start-8"
          >
            <p className="lead text-ink-muted">{solutions.lead}</p>
          </FadeUp>
        </div>

        <Stagger
          as="ul"
          each={0.05}
          className="mt-16 border-t border-rule-strong"
        >
          {solutions.items.map((item, i) => (
            <StaggerItem
              as="li"
              key={item.id}
              className="group border-b border-rule"
            >
              {/* Hover washes a teal gradient across the row and nudges the
                  title — a cue that each row is a distinct offering. */}
              <div className="relative -mx-4 grid gap-6 overflow-hidden rounded-xl px-4 py-10 transition-all duration-500 group-hover:bg-[linear-gradient(100deg,rgba(255,255,255,0.9)_0%,rgba(220,238,245,0.75)_100%)] group-hover:shadow-[0_12px_36px_-20px_rgba(0,52,89,0.35)] md:grid-cols-12 md:gap-8 lg:py-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-gradient-to-b from-teal to-navy transition-transform duration-500 group-hover:scale-y-100"
                />
                <div className="flex items-start gap-4 md:col-span-5">
                  <span className="pt-2.5">
                    <Index n={i + 1} />
                  </span>
                  <h3 className="text-2xl font-semibold leading-tight transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-text lg:text-[1.75rem]">
                    {item.title}
                  </h3>
                </div>

                <div className="md:col-span-4">
                  <p className="text-ink-muted">{item.summary}</p>
                </div>

                <div className="md:col-span-3">
                  <ul className="space-y-2">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-[0.9375rem] text-ink-muted"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-teal transition-transform duration-300 group-hover:scale-150"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
