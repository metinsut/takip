import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useGetBoardTasks } from "@/functions/project-board";
import { ProjectBoard } from "./-board/project-board";

export const Route = createFileRoute("/app/board/")({
  component: BoardRoute,
});

function BoardRoute() {
  const { activeProjectId } = useLoaderData({ from: "__root__" });
  const { data: boardTasks } = useSuspenseQuery(useGetBoardTasks(activeProjectId));

  return <ProjectBoard tasks={boardTasks} />;
}
