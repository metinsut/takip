import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getProjectIdFromCookie } from "@/functions/project";
import { useGetBoardTasks } from "@/functions/project-board";

export const Route = createFileRoute("/app/board")({
  component: BoardRoot,
  loader: async ({ context }) => {
    const activeProjectId = await getProjectIdFromCookie();

    if (!activeProjectId) {
      throw redirect({ to: "/app/projects" });
    }

    await context.queryClient.fetchQuery(useGetBoardTasks(activeProjectId));

    return {
      breadcrumb: "Board",
    };
  },
});

function BoardRoot() {
  return <Outlet />;
}
