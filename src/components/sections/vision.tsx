"use client";

import { vision } from "@/lib/content";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem } from "@/components/motion";
import { AmbientLayer, Constellation, DotGrid, Glow } from "@/components/ambient";

export function Vision() {
  return (
    <section
      id="vision"
      className="gradient-night relative isolate overflow-hidden py-section text-night-muted lg:py-section-lg"
    >
      {/* The dark band carries the fullest expression of the brand:
          deep navy gradient, drifting node clusters, teal glow. */}
      <AmbientLayer>
        <Glow onDark />
        <DotGrid onDark />
        <Constellation onDark className="opacity-60" />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <FadeUp duration={0.6}>
              <Eyebrow onDark>{vision.eyebrow}</Eyebrow>
            </FadeUp>
            <AnimatedText
              as="h2"
              text={vision.heading}
              className="gradient-text-dark mt-7 block text-[1.875rem] font-semibold leading-[1.22] sm:text-[2.375rem] lg:text-[2.75rem]"
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
          className="mt-20 grid gap-px overflow-hidden rounded-2xl bg-gradient-to-br from-sky/30 via-night-rule to-teal/25 md:grid-cols-3"
        >
          {vision.progression.map((stage, i) => (
            <StaggerItem
              as="li"
              key={stage.title}
              className="edge-light edge-light-dark group relative bg-[linear-gradient(160deg,#002230_0%,#001b26_100%)] p-8 transition-colors duration-500 hover:bg-[linear-gradient(160deg,#002b3d_0%,#00212e_100%)]"
            >
              <Index n={i + 1} onDark />
              <h3 className="mt-5 text-2xl font-semibold text-white">
                {stage.title}
              </h3>
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
