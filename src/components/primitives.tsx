import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Page gutter + max width. Every section uses this so the editorial grid lines up. */
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

/** Small uppercase mono label that opens a section. */
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
        className={`h-px w-6 ${onDark ? "bg-mint/50" : "bg-accent/40"}`}
      />
      {children}
    </p>
  );
}

type ButtonVariant = "primary" | "secondary" | "onDark";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.9375rem] font-medium leading-none transition-colors duration-200 cursor-pointer min-h-11";

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary:
    "border border-rule-strong text-ink hover:border-ink hover:bg-white",
  onDark: "bg-white text-ink hover:bg-mint",
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
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Two-digit section/step number in mono, used throughout the editorial lists. */
export function Index({
  n,
  onDark = false,
}: {
  n: number;
  onDark?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={`font-mono text-[0.6875rem] font-medium tracking-[0.18em] ${
        onDark ? "text-mint" : "text-ink-faint"
      }`}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** Vastisol wordmark: a stacked mark that echoes one person → a team. */
export function Wordmark({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className={`h-5 w-5 ${onDark ? "text-mint" : "text-accent"}`}
        fill="currentColor"
      >
        <circle cx="10" cy="2.6" r="2.2" />
        <circle cx="3.2" cy="14" r="2.2" opacity="0.75" />
        <circle cx="10" cy="14" r="2.2" opacity="0.75" />
        <circle cx="16.8" cy="14" r="2.2" opacity="0.75" />
        <path
          d="M10 5.6v3.2M10 8.8h6.8v2.6M10 8.8H3.2v2.6M10 8.8v2.6"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          opacity="0.5"
        />
      </svg>
      <span
        className={`font-display text-[1.375rem] leading-none tracking-[-0.01em] ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        Vastisol
      </span>
    </span>
  );
}
