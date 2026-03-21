import { createFileRoute, ErrorComponent, Outlet, redirect } from "@tanstack/react-router";
import { getProjectIdFromCookie } from "@/functions/project";
import { useGetTasks } from "@/functions/task";

export const Route = createFileRoute("/app/task")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const activeProjectId = await getProjectIdFromCookie();

    if (!activeProjectId) {
      throw redirect({ to: "/app/projects" });
    }

    await context.queryClient.fetchQuery(useGetTasks(activeProjectId));
    return {
      breadcrumb: "Görevler",
    };
  },
  errorComponent: (props) => <ErrorComponent {...props} />,
});

function RouteComponent() {
  return <Outlet />;
}
