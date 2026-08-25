"use client";

import { functionStrip, hero } from "@/lib/content";
import {
  ArrowRight,
  ButtonLink,
  Container,
  Eyebrow,
} from "@/components/primitives";
import { AmbientLayer, Constellation, DotGrid, Glow } from "@/components/ambient";
import { AnimatedText, FadeUp, Stagger, StaggerItem, motion } from "@/components/motion";
import { GrowthDiagram } from "./growth-diagram";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-rule">
      {/* Ambient field: drifting brand glow, panning grid, node clusters. */}
      <AmbientLayer>
        <Glow />
        <DotGrid />
        <Constellation className="opacity-70" />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="grid items-center gap-14 pb-20 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7">
            <FadeUp>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </FadeUp>

            <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">
              <AnimatedText
                as="span"
                text={hero.heading[0]}
                className="block"
                delay={0.1}
              />
              <AnimatedText
                as="span"
                text={hero.heading[1]}
                className="gradient-text block"
                delay={0.28}
              />
            </h1>

            <FadeUp delay={0.5}>
              <p className="lead mt-8 max-w-xl text-ink-muted">{hero.body}</p>
            </FadeUp>

            <FadeUp delay={0.68}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href={hero.primaryCta.href} className="group">
                  {hero.primaryCta.label}
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </ButtonLink>
                <ButtonLink href={hero.secondaryCta.href} variant="secondary">
                  {hero.secondaryCta.label}
                </ButtonLink>
              </div>
            </FadeUp>
          </div>

          <motion.div
            className="lg:col-span-5"
            // Position only — the card carries text, so it must paint at once.
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <GrowthDiagram />
          </motion.div>
        </div>
      </Container>

      {/* Function strip — states the five areas plainly, no invented proof. */}
      <div className="relative z-10 border-t border-rule bg-white/50 backdrop-blur-sm">
        <Container>
          <Stagger
            as="ul"
            delay={0.9}
            each={0.12}
            className="grid grid-cols-1 divide-y divide-rule lg:grid-cols-5 lg:divide-x lg:divide-y-0"
          >
            {functionStrip.map((label) => (
              <StaggerItem
                as="li"
                key={label}
                y={10}
                className="group flex items-center gap-2.5 py-4 font-display text-[0.8125rem] font-medium text-ink-muted transition-colors duration-300 hover:text-accent-text lg:py-5 lg:pr-4 lg:pl-5 lg:first:pl-0"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal/50 transition-all duration-300 group-hover:scale-125 group-hover:bg-teal"
                />
                {label}
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </div>
    </section>
  );
}
