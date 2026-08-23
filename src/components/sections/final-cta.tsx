"use client";

import { finalCta, site } from "@/lib/content";
import { ArrowRight, ButtonLink, Container } from "@/components/primitives";
import { AnimatedText, FadeUp } from "@/components/motion";
import { AmbientLayer, Constellation, Glow } from "@/components/ambient";

export function FinalCta() {
  return (
    <section className="gradient-night relative isolate overflow-hidden border-t border-night-rule py-24 lg:py-32">
      <AmbientLayer>
        <Glow onDark />
        <Constellation onDark className="opacity-50" />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedText
            as="h2"
            text={finalCta.heading}
            className="gradient-text-dark block text-[2.5rem] font-semibold leading-[1.08] sm:text-6xl"
            each={0.1}
          />

          <FadeUp delay={0.22}>
            <p className="lead mx-auto mt-7 max-w-2xl text-night-muted">
              {finalCta.body}
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink
                href={finalCta.cta.href}
                variant="onDark"
                className="group"
              >
                {finalCta.cta.label}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
              <a
                href={`mailto:${site.email}`}
                className="text-[0.9375rem] text-night-muted underline decoration-night-rule underline-offset-4 transition-colors duration-200 hover:text-sky hover:decoration-sky"
              >
                or email us directly
              </a>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
