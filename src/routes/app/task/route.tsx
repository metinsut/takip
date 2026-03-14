import { createFileRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { getProjectServerFn } from "@/functions/project";
import { useGetTasks } from "@/functions/task";

export const Route = createFileRoute("/app/task")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const activeProjectId = await getProjectServerFn();

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
