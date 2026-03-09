import { createFileRoute, Navigate, useLoaderData } from "@tanstack/react-router";
import { TasksList } from "./-list";

export const Route = createFileRoute("/app/task/")({
  component: TasksIndex,
});

export function TasksIndex() {
  const { activeProjectId } = useLoaderData({ from: "__root__" });
  return activeProjectId ? <TasksList /> : <Navigate to="/app/projects" />;
}
