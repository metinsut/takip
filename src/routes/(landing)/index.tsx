import { createFileRoute } from "@tanstack/react-router";
import {
  LandingBackground,
  LandingClosingCta,
  LandingFeatures,
  LandingHeader,
  LandingHero,
  LandingSteps,
  LandingWorkspacePreview,
} from "@/routes/(landing)/-components";

export const Route = createFileRoute("/(landing)/")({
  component: LandingIndex,
});

function LandingIndex() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <LandingBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 pb-20 pt-6 sm:px-8 lg:pt-8">
        <LandingHeader />
        <section className="grid items-start gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
          <LandingHero />
          <LandingWorkspacePreview />
        </section>
        <LandingFeatures />
        <LandingSteps />
        <LandingClosingCta />
      </div>
    </div>
  );
}
