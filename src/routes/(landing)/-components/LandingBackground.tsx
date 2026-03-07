import type { CSSProperties } from "react";

export function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(14,116,144,0.16),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_50%_62%,rgba(148,163,184,0.08),transparent_34%)]" />
      <div className="absolute top-24 left-[8%] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-40 right-[8%] h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="absolute right-[14%] bottom-24 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className="absolute inset-0 z-0 opacity-70"
        style={
          {
            backgroundImage: `
              linear-gradient(to right, rgba(148, 163, 184, 0.18) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(148, 163, 184, 0.18) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 10px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 10px
              ),
              radial-gradient(ellipse 76% 72% at 50% 20%, #000 54%, transparent 92%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 10px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 10px
              ),
              radial-gradient(ellipse 76% 72% at 50% 20%, #000 54%, transparent 92%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          } as CSSProperties
        }
      />
    </div>
  );
}
