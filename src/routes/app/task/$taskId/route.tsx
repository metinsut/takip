import { createFileRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { useGetTask } from "@/functions/task";

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
