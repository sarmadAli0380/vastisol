"use client";

import { whyVastisol } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem } from "@/components/motion";

export function WhyVastisol() {
  return (
    <section
      id="why-vastisol"
      className="border-b border-rule py-section lg:py-section-lg"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <FadeUp duration={0.6}>
                <Eyebrow>{whyVastisol.eyebrow}</Eyebrow>
              </FadeUp>
              <AnimatedText
                as="h2"
                text={whyVastisol.heading}
                className="mt-7 block text-[2rem] leading-[1.1] sm:text-[2.5rem]"
                delay={0.1}
              />
              <FadeUp delay={0.35}>
                <p className="lead mt-6 text-ink-muted">{whyVastisol.lead}</p>
              </FadeUp>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Stagger as="ul" each={0.1} className="border-t border-rule-strong">
              {whyVastisol.items.map((item, i) => (
                <StaggerItem
                  as="li"
                  key={item.title}
                  className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-rule py-8 sm:grid-cols-[4rem_1fr]"
                >
                  <div className="pt-2">
                    <Index n={i + 1} />
                  </div>
                  <div>
                    <h3 className="text-[1.375rem] leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-ink-muted">{item.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
