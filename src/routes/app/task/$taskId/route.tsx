import { createFileRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { useGetTask } from "@/functions/task";
import { useGetTaskActivities } from "@/functions/task-activity";
import { useGetTaskComments } from "@/functions/task-comment";
import { DEFAULT_TASK_ACTIVITY_LIMIT } from "./-activity-helpers";

export const Route = createFileRoute("/app/task/$taskId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { taskId } = params;
    if (taskId === "add") {
      return {
        breadcrumb: "Görev Ekle",
        task: null,
      };
    }
    const task = await context.queryClient.fetchQuery(useGetTask(taskId));

    if (task?.id) {
      await Promise.all([
        context.queryClient.fetchQuery(useGetTaskActivities(task.id, DEFAULT_TASK_ACTIVITY_LIMIT)),
        context.queryClient.fetchQuery(useGetTaskComments(task.id)),
      ]);
    }

    return {
      breadcrumb: task?.title ?? "",
      task,
    };
  },
  errorComponent: (props) => <ErrorComponent {...props} />,
});

function RouteComponent() {
  return <Outlet />;
}
