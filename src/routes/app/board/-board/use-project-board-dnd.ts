import {
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import {
  type BoardTaskListItem,
  getBoardTasksQueryKey,
  moveBoardTask,
} from "@/functions/project-board";
import { getTaskQueryKey, getTasksQueryKey } from "@/functions/task";
import {
  buildBoardColumns,
  getBoardDropTarget,
  hasBoardLayoutChanged,
  moveBoardTaskLocally,
  normalizeBoardDragId,
} from "./board-dnd-helpers";

export function useProjectBoardDnd(boardTasks: BoardTaskListItem[]) {
  const queryClient = useQueryClient();
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

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (isSyncing) {
      return;
    }

    const activeId = normalizeBoardDragId(event.active.id);

    if (!activeId?.startsWith("task:")) {
      return;
    }

    const taskId = Number(activeId.replace("task:", ""));

    if (Number.isInteger(taskId)) {
      setActiveTaskId(taskId);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const draggedTaskId = activeTaskId;

    setActiveTaskId(null);

    if (!draggedTaskId || isSyncing) {
      return;
    }

    const dropTarget = getBoardDropTarget(columns, {
      overId: normalizeBoardDragId(event.over?.id),
    });

    if (!dropTarget) {
      return;
    }

    const previousTasks = tasks;
    const nextTasks = moveBoardTaskLocally(previousTasks, {
      status: dropTarget.status,
      targetIndex: dropTarget.targetIndex,
      taskId: draggedTaskId,
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
          taskId: draggedTaskId,
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

  return {
    activeTask,
    columns,
    handleDragCancel,
    handleDragEnd,
    handleDragStart,
    isSyncing,
    sensors,
    taskCount: tasks.length,
  };
}
