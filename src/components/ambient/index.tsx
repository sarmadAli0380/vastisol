import type { ReactNode } from "react";
import { Constellation } from "./constellation";

export { Constellation };

/**
 * Soft brand-coloured blobs drifting behind content.
 *
 * Heavily blurred radial gradients at low opacity — they give the flat
 * background depth and colour without competing with type. Two blobs on
 * opposing drift cycles so the field never looks like it is repeating.
 */
export function Glow({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const teal = onDark ? "rgba(0,126,167,0.30)" : "rgba(0,126,167,0.16)";
  const navy = onDark ? "rgba(0,52,89,0.45)" : "rgba(0,52,89,0.12)";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute -left-[15%] top-[-20%] h-[45rem] w-[45rem] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${teal} 0%, transparent 68%)`,
          animation: "drift-a 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute -right-[12%] bottom-[-25%] h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${navy} 0%, transparent 68%)`,
          animation: "drift-b 33s ease-in-out infinite 2s",
          willChange: "transform",
        }}
      />
    </div>
  );
}

/**
 * Panning dot grid. Reads as engineering graph paper and gives the eye a
 * sense of slow movement without any distinct shape to follow.
 * Masked so it fades out before it reaches the section edges.
 */
export function DotGrid({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const dot = onDark ? "rgba(86,197,232,0.22)" : "rgba(0,52,89,0.14)";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute -inset-[56px]"
        style={{
          backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          animation: "grid-pan 24s linear infinite",
          willChange: "transform",
          maskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 65% at 50% 45%, #000 30%, transparent 78%)",
        }}
      />
    </div>
  );
}

/**
 * Wraps a section's background layers. Sits behind content at z-0 and is
 * always inert to pointers and assistive tech.
 */
export function AmbientLayer({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {children}
    </div>
  );
}
