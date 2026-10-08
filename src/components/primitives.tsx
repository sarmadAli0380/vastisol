import Link from "next/link";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

/** Page gutter + max width. Every section uses this so the grid lines up. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[76rem] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/** Small uppercase label that opens a section. */
export function Eyebrow({
  children,
  onDark = false,
  className = "",
}: {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`eyebrow ${onDark ? "eyebrow-on-dark" : ""} flex items-center gap-3 ${className}`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-6 ${onDark ? "bg-sky/60" : "bg-teal/60"}`}
      />
      {children}
    </p>
  );
}

type ButtonVariant = "primary" | "secondary" | "onDark";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-[0.9375rem] font-medium leading-none transition-all duration-200 cursor-pointer min-h-11";

const buttonVariants: Record<ButtonVariant, string> = {
  // Teal-to-navy gradient with a coloured lift — the primary brand gesture.
  // Background position shifts on hover so the gradient appears to slide.
  primary:
    "text-white bg-[linear-gradient(110deg,#007ea7_0%,#005e83_45%,#003459_100%)] bg-[length:200%_100%] bg-left shadow-[0_2px_12px_-2px_rgba(0,126,167,0.55)] hover:bg-right hover:shadow-[0_8px_24px_-6px_rgba(0,126,167,0.7)]",
  secondary:
    "border border-rule-strong text-ink hover:border-teal hover:bg-white hover:text-accent-text",
  onDark: "bg-white text-midnight hover:bg-sky",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

/** Right-pointing arrow used on CTAs. Decorative — the label carries meaning. */
export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      className={`h-4 w-4 ${className}`}
    >
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two-digit index used throughout the numbered lists. */
export function Index({ n, onDark = false }: { n: number; onDark?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`font-display text-[0.6875rem] font-semibold tracking-[0.18em] ${
        onDark ? "text-sky" : "text-teal"
      }`}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

/**
 * Official VastiSol wordmark. Its descriptive alt text provides the brand
 * name when the logo is used outside a link with its own accessible label.
 */
export function Wordmark({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={
        onDark
          ? "/brand/vastisol-wordmark-white.svg"
          : "/brand/vastisol-wordmark-black.svg"
      }
      alt="Vastisol"
      width={359}
      height={91}
      className={`h-6 w-auto ${className}`}
    />
  );
}
