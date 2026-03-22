import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { BoardTaskListItem } from "@/functions/project-board";
import { cn } from "@/lib/utils";
import { getBoardTaskId } from "./board-dnd-helpers";
import { BoardTaskCard } from "./board-task-card";

export function SortableBoardTaskCard(props: { disabled: boolean; task: BoardTaskListItem }) {
  const { disabled, task } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getBoardTaskId(task.id),
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={cn(
        "select-none",
        disabled ? "cursor-default" : "cursor-grab active:cursor-grabbing touch-manipulation",
      )}
      {...attributes}
      {...listeners}
    >
      <BoardTaskCard task={task} isDragging={isDragging} />
    </div>
  );
}
