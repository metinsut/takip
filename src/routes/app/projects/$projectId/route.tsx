import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useGetProject } from "@/functions/projects";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { projectId } = params;
    if (projectId === "add") {
      return {
        breadcrumb: m.addProject(),
      };
    }
    const project = await context.queryClient.fetchQuery(useGetProject(projectId));
    return {
      breadcrumb: project?.name ?? "",
    };
  },
});

function RouteComponent() {
  return <Outlet />;
}
