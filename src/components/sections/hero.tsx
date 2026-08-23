"use client";

import { functionStrip, hero } from "@/lib/content";
import {
  ArrowRight,
  ButtonLink,
  Container,
  Eyebrow,
} from "@/components/primitives";
import { AnimatedText, FadeUp, Stagger, StaggerItem, motion } from "@/components/motion";
import { GrowthDiagram } from "./growth-diagram";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      {/* Editorial column rules — decorative. They draw down as the page loads. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mx-auto hidden max-w-[76rem] px-10 lg:block"
      >
        <div className="grid h-full grid-cols-12">
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.div
              key={i}
              className="origin-top border-r border-rule/40"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 1.4,
                delay: 0.15 + i * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          ))}
        </div>
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 pb-20 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7">
            <FadeUp duration={0.6}>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </FadeUp>

            <h1 className="mt-7 text-[2.75rem] leading-[1.04] tracking-[-0.025em] sm:text-6xl lg:text-[4.25rem]">
              <AnimatedText
                as="span"
                text={hero.heading[0]}
                className="block"
                delay={0.15}
              />
              <AnimatedText
                as="span"
                text={hero.heading[1]}
                className="block italic text-accent"
                delay={0.32}
              />
            </h1>

            <FadeUp delay={0.55} duration={0.8}>
              <p className="lead mt-8 max-w-xl text-ink-muted">{hero.body}</p>
            </FadeUp>

            <FadeUp delay={0.7} duration={0.8}>
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
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <GrowthDiagram />
          </motion.div>
        </div>
      </Container>

      {/* Function strip — states the five areas plainly, no invented proof. */}
      <div className="border-t border-rule">
        <Container>
          <Stagger
            as="ul"
            delay={0.9}
            each={0.07}
            className="grid grid-cols-1 divide-y divide-rule lg:grid-cols-5 lg:divide-x lg:divide-y-0"
          >
            {functionStrip.map((label) => (
              <StaggerItem
                as="li"
                key={label}
                y={10}
                className="py-4 text-[0.8125rem] font-medium tracking-[0.01em] text-ink-muted lg:py-5 lg:pr-4 lg:pl-5 lg:first:pl-0"
              >
                {label}
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </div>
    </section>
  );
}
