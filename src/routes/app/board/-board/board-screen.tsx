import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { KanbanIcon } from "@phosphor-icons/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  type BoardTaskListItem,
  getBoardTasksQueryKey,
  moveBoardTask,
  useGetBoardTasks,
} from "@/functions/project-board";
import { getTaskQueryKey, getTasksQueryKey } from "@/functions/task";
import { BoardColumn } from "./board-column";
import { BoardTaskCard } from "./board-task-card";
import { buildBoardColumns, getBoardDropTarget, moveBoardTaskLocally } from "./board-view-helpers";

function normalizeDragId(id: UniqueIdentifier | null | undefined) {
  if (typeof id === "string") {
    return id;
  }

  if (typeof id === "number") {
    return String(id);
  }

  return undefined;
}

function hasBoardLayoutChanged(previousTasks: BoardTaskListItem[], nextTasks: BoardTaskListItem[]) {
  if (previousTasks.length !== nextTasks.length) {
    return true;
  }

  return previousTasks.some((task, index) => {
    const nextTask = nextTasks[index];

    return nextTask?.id !== task.id || nextTask?.status !== task.status;
  });
}

export function BoardScreen() {
  const queryClient = useQueryClient();
  const { activeProjectId } = useLoaderData({ from: "__root__" });
  const { data: boardTasks } = useSuspenseQuery(useGetBoardTasks(activeProjectId));
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tasks, setTasks] = useState(boardTasks);

  useEffect(() => {
    setTasks(boardTasks);
  }, [boardTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const columns = buildBoardColumns(tasks);
  const activeTask = activeTaskId ? tasks.find((task) => task.id === activeTaskId) : undefined;

  const handleDragStart = (event: DragStartEvent) => {
    if (isSyncing) {
      return;
    }

    const activeId = normalizeDragId(event.active.id);

    if (!activeId?.startsWith("task:")) {
      return;
    }

    const taskId = Number(activeId.replace("task:", ""));

    if (Number.isInteger(taskId)) {
      setActiveTaskId(taskId);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const nextActiveTaskId = activeTaskId;

    setActiveTaskId(null);

    if (!nextActiveTaskId || isSyncing) {
      return;
    }

    const dropTarget = getBoardDropTarget(columns, {
      activeTaskId: nextActiveTaskId,
      overId: normalizeDragId(event.over?.id),
    });

    if (!dropTarget) {
      return;
    }

    const previousTasks = tasks;
    const nextTasks = moveBoardTaskLocally(previousTasks, {
      status: dropTarget.status,
      targetIndex: dropTarget.targetIndex,
      taskId: nextActiveTaskId,
    });

    if (!hasBoardLayoutChanged(previousTasks, nextTasks)) {
      return;
    }

    setTasks(nextTasks);
    setIsSyncing(true);

    try {
      await moveBoardTask({
        data: {
          status: dropTarget.status,
          targetIndex: dropTarget.targetIndex,
          taskId: nextActiveTaskId,
        },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getBoardTasksQueryKey] }),
        queryClient.invalidateQueries({ queryKey: [getTasksQueryKey] }),
        queryClient.invalidateQueries({ queryKey: [getTaskQueryKey] }),
      ]);
    } catch (error) {
      setTasks(previousTasks);
      toast.error(error instanceof Error ? error.message : "Board güncellenemedi.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-1">
          <div className="flex items-center gap-2">
            <KanbanIcon />
            <h1 className="text-lg font-semibold">Board</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Aktif projedeki board görevlerini durum bazında yönetin. Kartları kolon içinde veya
            kolonlar arasında sürükleyerek anında güncelleyebilirsiniz.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{tasks.length} aktif görev</Badge>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/app/task">Backlog'u aç</Link>}
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTaskId(null)}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.status}
              status={column.status}
              tasks={column.tasks}
              disabled={isSyncing}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="w-[min(100vw-2rem,24rem)] rotate-1 opacity-95">
              <BoardTaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
