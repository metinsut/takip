import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useGetProjects } from "@/functions/projects";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const projects = await context.queryClient.fetchQuery(useGetProjects());
    return {
      breadcrumb: m.projects(),
      projects,
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
