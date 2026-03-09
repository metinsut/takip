import { createFileRoute } from "@tanstack/react-router";
import { TasksList } from "./-list";

export const Route = createFileRoute("/app/task/")({
  component: TasksIndex,
});

export function TasksIndex() {
  return <TasksList />;
}
