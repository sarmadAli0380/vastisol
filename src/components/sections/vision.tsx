"use client";

import { vision } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem } from "@/components/motion";

export function Vision() {
  return (
    <section
      id="vision"
      className="bg-night py-section text-night-muted lg:py-section-lg"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <FadeUp duration={0.6}>
              <Eyebrow onDark>{vision.eyebrow}</Eyebrow>
            </FadeUp>
            <AnimatedText
              as="h2"
              text={vision.heading}
              className="mt-7 block text-[1.875rem] leading-[1.18] text-white sm:text-[2.375rem] lg:text-[2.75rem]"
              delay={0.1}
              each={0.035}
            />
          </div>

          <div className="space-y-5 self-end lg:col-span-5">
            {vision.paragraphs.map((p, i) => (
              <FadeUp as="p" key={i} delay={0.4 + i * 0.12}>
                {p}
              </FadeUp>
            ))}
          </div>
        </div>

        <Stagger
          as="ol"
          each={0.13}
          className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-night-rule md:grid-cols-3"
        >
          {vision.progression.map((stage, i) => (
            <StaggerItem
              as="li"
              key={stage.title}
              className="bg-night-raised p-8"
            >
              <Index n={i + 1} onDark />
              <h3 className="mt-5 text-2xl text-white">{stage.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed">
                {stage.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
