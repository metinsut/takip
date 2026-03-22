import { DragOverlay } from "@dnd-kit/core";
import type { BoardTaskListItem } from "@/functions/project-board";
import { BoardTaskCard } from "./board-task-card";

export function BoardDragOverlay(props: { task?: BoardTaskListItem }) {
  const { task } = props;

  return <DragOverlay>{task ? <BoardTaskCard task={task} /> : null}</DragOverlay>;
}
