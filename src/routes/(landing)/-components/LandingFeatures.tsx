import { LANDING_FEATURES } from "./landing-features";

export function LandingFeatures() {
  return (
    <section className="mt-14 grid gap-4 md:grid-cols-3">
      {LANDING_FEATURES.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <article
            key={feature.title}
            className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl border border-border/70 bg-card/80 p-5 backdrop-blur duration-500"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className="mb-4 inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="text-base font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </article>
        );
      })}
    </section>
  );
}
