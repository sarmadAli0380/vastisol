import Link from "next/link";
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
 * Vastisol wordmark. The mark is the brand's core idea in miniature:
 * one node above, a connected row of three below.
 */
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
        viewBox="0 0 22 22"
        className="h-[1.4rem] w-[1.4rem] shrink-0"
        fill="none"
      >
        <path
          d="M11 6.4v4.2M11 10.6H4.2v2.8M11 10.6h6.8v2.8M11 10.6v2.8"
          stroke={onDark ? "#56c5e8" : "#007ea7"}
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="11" cy="3.4" r="2.6" fill={onDark ? "#56c5e8" : "#007ea7"} />
        <circle cx="4.2" cy="15.6" r="2.4" fill={onDark ? "#ffffff" : "#003459"} />
        <circle cx="11" cy="15.6" r="2.4" fill={onDark ? "#ffffff" : "#003459"} />
        <circle cx="17.8" cy="15.6" r="2.4" fill={onDark ? "#ffffff" : "#003459"} />
      </svg>
      <span
        className={`font-display text-[1.3rem] font-semibold leading-none tracking-[-0.03em] ${
          onDark ? "text-white" : "text-midnight"
        }`}
      >
        Vastisol
      </span>
    </span>
  );
}
