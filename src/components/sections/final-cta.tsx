"use client";

import { finalCta, site } from "@/lib/content";
import { ArrowRight, ButtonLink, Container } from "@/components/primitives";
import { AnimatedText, FadeUp } from "@/components/motion";

export function FinalCta() {
  return (
    <section className="border-t border-night-rule bg-night py-24 lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <AnimatedText
            as="h2"
            text={finalCta.heading}
            className="block text-[2.5rem] leading-[1.06] text-white sm:text-6xl"
            each={0.07}
          />

          <FadeUp delay={0.3}>
            <p className="lead mx-auto mt-7 max-w-2xl text-night-muted">
              {finalCta.body}
            </p>
          </FadeUp>

          <FadeUp delay={0.45}>
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
                className="text-[0.9375rem] text-night-muted underline decoration-night-rule underline-offset-4 transition-colors duration-200 hover:text-mint hover:decoration-mint"
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
