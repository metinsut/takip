import { closestCorners, DndContext } from "@dnd-kit/core";
import type { BoardTaskListItem } from "@/functions/project-board";
import { BoardColumns } from "./board-columns";
import { BoardDragOverlay } from "./board-drag-overlay";
import { ProjectBoardHeader } from "./board-header";
import { useProjectBoardDnd } from "./use-project-board-dnd";

export function ProjectBoard(props: { tasks: BoardTaskListItem[] }) {
  const { tasks } = props;
  const {
    activeTask,
    columns,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    isSyncing,
    sensors,
    taskCount,
  } = useProjectBoardDnd(tasks);

  return (
    <div className="flex flex-col gap-4">
      <ProjectBoardHeader taskCount={taskCount} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <BoardColumns columns={columns} disabled={isSyncing} />
        <BoardDragOverlay task={activeTask} />
      </DndContext>
    </div>
  );
}
