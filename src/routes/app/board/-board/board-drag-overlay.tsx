import { DragOverlay } from "@dnd-kit/core";
import type { BoardTaskListItem } from "@/functions/project-board";
import { BoardTaskCard } from "./board-task-card";
import { getSortableBoardTaskCursorClass } from "./sortable-board-task-card";

export function BoardDragOverlay(props: { task?: BoardTaskListItem }) {
  const { task } = props;

  return (
    <DragOverlay>
      {task ? (
        <div className={getSortableBoardTaskCursorClass({ disabled: false, isDragging: true })}>
          <BoardTaskCard task={task} />
        </div>
      ) : null}
    </DragOverlay>
  );
}
