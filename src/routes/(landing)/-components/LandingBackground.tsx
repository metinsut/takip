export function LandingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_14%,rgba(14,116,144,0.14),transparent_42%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.14),transparent_36%)]" />
      <div
        className="absolute inset-0 z-0 opacity-80 dark:opacity-35"
        style={
          {
            backgroundImage: `
              linear-gradient(to right, #d6d3d1 1px, transparent 1px),
              linear-gradient(to bottom, #d6d3d1 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 0",
            maskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
            `,
            WebkitMaskImage: `
              repeating-linear-gradient(
                to right,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              repeating-linear-gradient(
                to bottom,
                black 0px,
                black 3px,
                transparent 3px,
                transparent 8px
              ),
              radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)
            `,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          } as React.CSSProperties
        }
      />
    </div>
  );
}
