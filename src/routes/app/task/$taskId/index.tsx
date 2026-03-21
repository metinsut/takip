import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { TaskActivityPanel } from "./-activity";
import { TaskCommentComposer } from "./-comment";
import { TaskFormSection } from "./-form";

export const Route = createFileRoute("/app/task/$taskId/")({
  component: TaskPage,
});

function TaskPage() {
  const { task } = useLoaderData({ from: "/app/task/$taskId" });

  if (!task) {
    return <TaskFormSection />;
  }

  return (
    <div className="flex flex-col gap-3">
      <TaskFormSection />
      <TaskActivityPanel />
      <TaskCommentComposer />
    </div>
  );
}
