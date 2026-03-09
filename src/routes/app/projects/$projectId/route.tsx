import { createFileRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { useGetProject } from "@/functions/project";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects/$projectId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { projectId } = params;
    if (projectId === "add") {
      return {
        breadcrumb: m.addProject(),
        project: null,
      };
    }
    const project = await context.queryClient.fetchQuery(useGetProject(Number(projectId)));
    return {
      breadcrumb: project?.name ?? "",
      project,
    };
  },
  errorComponent: (props) => <ErrorComponent {...props} />,
});

function RouteComponent() {
  return <Outlet />;
}
