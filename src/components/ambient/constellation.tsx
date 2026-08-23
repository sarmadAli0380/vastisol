/**
 * Drifting node constellations.
 *
 * The motif is deliberate: nodes joined into clusters is what Vastisol
 * actually sells — one person, connected into a team, connected into a
 * function. It reads as brand rather than generic "tech particles".
 *
 * Each cluster is one <g> that drifts and rotates as a unit, so the
 * connecting lines stay attached without any per-frame JS. Everything
 * animates on transform/opacity, which the compositor handles on its own
 * thread — no layout, no main-thread cost, no scroll jank.
 *
 * Coordinates are hand-authored constants (never Math.random) so server
 * and client markup match exactly.
 */

type Cluster = {
  /** Node positions within the 1000x1000 viewBox. */
  nodes: [number, number][];
  /** Index pairs to connect with a line. */
  edges: [number, number][];
  origin: string;
  animation: string;
};

const CLUSTERS: Cluster[] = [
  {
    nodes: [
      [140, 180],
      [250, 120],
      [230, 275],
      [355, 205],
      [120, 320],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [0, 4],
      [2, 4],
    ],
    origin: "230px 210px",
    animation: "drift-a 34s ease-in-out infinite, rotate-slow 190s linear infinite",
  },
  {
    nodes: [
      [760, 300],
      [880, 230],
      [845, 400],
      [700, 430],
      [935, 340],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 3],
      [2, 3],
      [1, 4],
      [2, 4],
    ],
    origin: "830px 330px",
    animation: "drift-b 41s ease-in-out infinite, rotate-slow 240s linear infinite reverse",
  },
  {
    nodes: [
      [430, 700],
      [560, 640],
      [520, 800],
      [650, 745],
      [390, 840],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [0, 4],
      [2, 4],
    ],
    origin: "510px 745px",
    animation: "drift-a 47s ease-in-out infinite 3s, rotate-slow 210s linear infinite",
  },
];

export function Constellation({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const line = onDark ? "#56c5e8" : "#007ea7";
  // Kept deliberately low: these lines pass behind body copy, and anything
  // stronger competes with the text instead of sitting behind it.
  const lineOpacity = onDark ? 0.16 : 0.2;
  const nodeOpacity = onDark ? 0.5 : 0.45;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      {CLUSTERS.map((cluster, ci) => (
        <g
          key={ci}
          style={{
            transformOrigin: cluster.origin,
            animation: cluster.animation,
            willChange: "transform",
          }}
        >
          {cluster.edges.map(([a, b], ei) => {
            const [x1, y1] = cluster.nodes[a];
            const [x2, y2] = cluster.nodes[b];
            return (
              <line
                key={ei}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={line}
                strokeWidth="1"
                strokeOpacity={lineOpacity}
                strokeDasharray="240"
                style={{
                  animation: `trace-line ${16 + ei * 2}s ease-in-out infinite ${ci * 1.5 + ei * 0.4}s`,
                }}
              />
            );
          })}

          {cluster.nodes.map(([cx, cy], ni) => (
            <circle
              key={ni}
              cx={cx}
              cy={cy}
              r={ni === 0 ? 5 : 3.5}
              fill={line}
              style={{
                animation: `pulse-node ${9 + ni * 1.7}s ease-in-out infinite ${ci * 0.8 + ni * 0.5}s`,
                opacity: nodeOpacity,
              }}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
