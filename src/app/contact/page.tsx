import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { Container, Eyebrow, Index } from "@/components/primitives";
import { AnimatedText, FadeUp } from "@/components/motion";
import { AmbientLayer, Constellation, Glow } from "@/components/ambient";
import { contactPage, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Let's Build Your Team",
  description:
    "Tell Vastisol what's slowing your operation down — the function, the volume, the tools you use — and we'll come back with how we would staff and run it.",
};

export default function ContactPage() {
  return (
    <section className="relative isolate overflow-hidden border-b border-rule py-16 lg:py-24">
      <AmbientLayer>
        <Glow />
        <Constellation className="opacity-40" />
      </AmbientLayer>

      <Container className="relative z-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <FadeUp>
              <Eyebrow>{contactPage.eyebrow}</Eyebrow>
            </FadeUp>

            <AnimatedText
              as="h1"
              text={contactPage.heading}
              className="gradient-text mt-7 block text-[2.5rem] font-semibold leading-[1.08] sm:text-5xl lg:text-[3.5rem]"
              delay={0.08}
              each={0.1}
            />

            <FadeUp delay={0.22}>
              <p className="lead mt-7 max-w-xl text-ink-muted">
                {contactPage.lead}
              </p>
            </FadeUp>

            <FadeUp delay={0.2} className="mt-12">
              <ContactForm />
            </FadeUp>
          </div>

          <FadeUp delay={0.08} className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-display text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                {contactPage.asideTitle}
              </h2>

              <ol className="mt-7 border-t border-rule">
                {contactPage.aside.map((item, i) => (
                  <li key={item.title} className="border-b border-rule py-6">
                    <Index n={i + 1} />
                    <h3 className="mt-3 text-lg leading-snug">{item.title}</h3>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>

              <div className="mt-8">
                <p className="text-[0.9375rem] text-ink-muted">
                  Prefer email?
                </p>
                <a
                  href={`mailto:${site.email}`}
                  className="mt-1 inline-block border-b border-rule-strong pb-0.5 text-[0.9375rem] text-ink transition-colors duration-200 hover:border-teal hover:text-accent-text"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
