"use client";

import { propertyManagement as pm } from "@/lib/content";
import { Container, Eyebrow } from "@/components/primitives";
import {
  AnimatedText,
  FadeUp,
  Stagger,
  StaggerItem,
} from "@/components/motion";
import { AmbientLayer, Constellation, Glow } from "@/components/ambient";

export function PropertyManagement() {
  return (
    <section
      id="property-management"
      className="relative isolate overflow-hidden border-b border-rule py-section lg:py-section-lg"
    >
      <AmbientLayer>
        <Glow />
        <Constellation className="opacity-40" />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <FadeUp>
              <Eyebrow>{pm.eyebrow}</Eyebrow>
            </FadeUp>

            <h2 className="mt-7 text-[1.875rem] font-semibold leading-[1.16] sm:text-[2.25rem] lg:text-[2.75rem]">
              <AnimatedText as="span" text={pm.heading[0]} delay={0.08} />{" "}
              <AnimatedText
                as="span"
                text={pm.heading[1]}
                className="gradient-text"
                delay={0.2}
              />
            </h2>

            <div className="mt-9 max-w-2xl space-y-5">
              {pm.paragraphs.map((p, i) => (
                <FadeUp
                  as="p"
                  key={i}
                  delay={0.3 + i * 0.12}
                  className="text-ink-muted"
                >
                  {p}
                </FadeUp>
              ))}
            </div>
          </div>

          <FadeUp delay={0.2} className="lg:col-span-5">
            <div className="edge-light relative overflow-hidden rounded-2xl border border-teal/20 bg-[linear-gradient(150deg,#eef7fa_0%,#dceef5_55%,#cfe6f0_100%)] p-8 shadow-[0_18px_44px_-24px_rgba(0,52,89,0.35)] lg:sticky lg:top-28">
              <h3 className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-accent-text">
                {pm.capabilitiesLabel}
              </h3>
              <Stagger
                as="ul"
                delay={0.22}
                each={0.1}
                className="mt-6 divide-y divide-teal/20"
              >
                {pm.capabilities.map((c) => (
                  <StaggerItem
                    as="li"
                    key={c}
                    y={8}
                    className="py-3 text-[0.9375rem] text-ink first:pt-0 last:pb-0"
                  >
                    {c}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
