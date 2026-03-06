import { createFileRoute } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/home/")({
  component: AppComponent,
});

function AppComponent() {
  return <p>{m.helloApp()}</p>;
}
