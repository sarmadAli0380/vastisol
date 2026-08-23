"use client";

import { solutions } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem } from "@/components/motion";

export function Solutions() {
  return (
    <section
      id="solutions"
      className="border-b border-rule bg-paper-sunk py-section lg:py-section-lg"
    >
      <Container>
        <FadeUp duration={0.6}>
          <Eyebrow>{solutions.eyebrow}</Eyebrow>
        </FadeUp>

        <div className="mt-7 grid gap-6 lg:grid-cols-12 lg:gap-16">
          <AnimatedText
            as="h2"
            text={solutions.heading}
            className="block text-[2rem] leading-[1.1] sm:text-[2.5rem] lg:col-span-6 lg:text-[2.75rem]"
            delay={0.1}
          />
          <FadeUp
            delay={0.3}
            className="self-end lg:col-span-5 lg:col-start-8"
          >
            <p className="lead text-ink-muted">{solutions.lead}</p>
          </FadeUp>
        </div>

        <Stagger
          as="ul"
          each={0.09}
          className="mt-16 border-t border-rule-strong"
        >
          {solutions.items.map((item, i) => (
            <StaggerItem
              as="li"
              key={item.id}
              className="group border-b border-rule"
            >
              {/* Hover tints the row and nudges the title — a quiet cue that
                  each row is a distinct offering rather than a link. */}
              <div className="-mx-4 grid gap-6 rounded-lg px-4 py-10 transition-colors duration-300 group-hover:bg-card/70 md:grid-cols-12 md:gap-8 lg:py-12">
                <div className="flex items-start gap-4 md:col-span-5">
                  <span className="pt-2.5">
                    <Index n={i + 1} />
                  </span>
                  <h3 className="text-2xl leading-tight transition-transform duration-300 group-hover:translate-x-1 lg:text-[1.75rem]">
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
                          className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"
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
