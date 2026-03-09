import { createFileRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { useGetProjects } from "@/functions/project";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery(useGetProjects());
    return {
      breadcrumb: m.projects(),
    };
  },
  errorComponent: (props) => <ErrorComponent {...props} />,
});

function RouteComponent() {
  return <Outlet />;
}
