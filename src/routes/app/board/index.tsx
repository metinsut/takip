import { createFileRoute, redirect } from "@tanstack/react-router";
import { TaskBoard } from "@/components/task/task-board";
import { getProjectIdFromCookie } from "@/functions/project";
import { useGetBoardTasks } from "@/functions/project-board";

export const Route = createFileRoute("/app/board/")({
  component: BoardPage,
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

function BoardPage() {
  return <TaskBoard />;
}
