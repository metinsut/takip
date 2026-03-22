import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: AuthRoot,
});

function AuthRoot() {
  return <Outlet />;
}
