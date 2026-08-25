"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { nav } from "@/lib/content";
import { ArrowRight, ButtonLink, Container, Wordmark } from "./primitives";

const EASE = [0.215, 0.61, 0.355, 1] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // A hairline and blur appear once the page leaves the very top.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  // Lock body scroll and allow Escape to dismiss while the menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-rule bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Vastisol — home"
            className="shrink-0 rounded-sm"
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item, i) => (
                <motion.li
                  key={item.href}
                  // Position only. These are navigation labels — fading them
                  // in means the nav is unreadable during first load.
                  initial={{ y: -6 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.09, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    // Underline grows from the left on hover.
                    className="group relative inline-block py-1 text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-teal transition-transform duration-300 ease-out group-hover:scale-x-100"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="hidden lg:block">
            <ButtonLink href="/contact" className="px-5 py-2.5">
              Let&rsquo;s Build Your Team
              <ArrowRight />
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ink lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M4.5 4.5l11 11m0-11l-11 11" />
              ) : (
                <path d="M2.5 6h15M2.5 14h15" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-nav"
            className="overflow-hidden border-t border-rule bg-paper lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <Container>
              <nav aria-label="Primary mobile">
                <ul className="flex flex-col py-2">
                  {nav.map((item, i) => (
                    <motion.li
                      key={item.href}
                      className="border-b border-rule/70"
                      initial={{ x: -8 }}
                      animate={{ x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.08 + i * 0.05,
                        ease: EASE,
                      }}
                    >
                      <Link
                        href={item.href}
                        className="block py-4 text-lg text-ink"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              <div className="py-6">
                <ButtonLink
                  href="/contact"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Let&rsquo;s Build Your Team
                  <ArrowRight />
                </ButtonLink>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
