import { createFileRoute } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/(app)/")({
  component: AppComponent,
  loader: () => {
    return {
      breadcrumb: m.home(),
    };
  },
});

function AppComponent() {
  return (
    <div className="grid gap-4">
      <p>{m.helloApp()}</p>
    </div>
  );
}
