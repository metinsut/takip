import { createFileRoute } from "@tanstack/react-router";
import {
  LandingBackground,
  LandingFeatures,
  LandingHeader,
  LandingHero,
  LandingInboxPreview,
  LandingSteps,
} from "@/routes/(landing)/-components";

export const Route = createFileRoute("/(landing)/")({
  component: LandingIndex,
});

function LandingIndex() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <LandingBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-6 pb-14 pt-6 sm:px-8 lg:pt-8">
        <LandingHeader />
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <LandingHero />
          <LandingInboxPreview />
        </section>
        <LandingFeatures />
        <LandingSteps />
      </div>
    </div>
  );
}
