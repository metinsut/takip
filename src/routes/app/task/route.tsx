import { createFileRoute, ErrorComponent, Outlet, redirect } from "@tanstack/react-router";
import { getProjectIdFromCookie } from "@/functions/project";
import { useGetBoardTasks } from "@/functions/project-board";
import { useGetTasks } from "@/functions/task";

export const Route = createFileRoute("/app/task")({
  component: TaskRoot,
  loader: async ({ context }) => {
    const activeProjectId = await getProjectIdFromCookie();

    if (!activeProjectId) {
      throw redirect({ to: "/app/projects" });
    }

    await Promise.all([
      context.queryClient.fetchQuery(useGetBoardTasks(activeProjectId)),
      context.queryClient.fetchQuery(useGetTasks(activeProjectId)),
    ]);
    return {
      breadcrumb: "Görevler",
    };
  },
  errorComponent: (props) => <ErrorComponent {...props} />,
});

function TaskRoot() {
  return <Outlet />;
}
