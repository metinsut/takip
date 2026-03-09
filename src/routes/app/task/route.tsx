import { createFileRoute, ErrorComponent, Outlet } from "@tanstack/react-router";
import { useGetTasks } from "@/functions/task";

export const Route = createFileRoute("/app/task")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.fetchQuery(useGetTasks());
    return {
      breadcrumb: "Görevler",
    };
  },
  errorComponent: (props) => <ErrorComponent {...props} />,
});

function RouteComponent() {
  return <Outlet />;
}
