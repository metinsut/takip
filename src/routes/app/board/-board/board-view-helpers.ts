import { type TaskStatus, taskStatus } from "@/db/schema";

type BoardTaskLike = {
  id: number;
  status: TaskStatus;
};

export const BOARD_COLUMN_ORDER = [
  taskStatus.todo,
  taskStatus.in_progress,
  taskStatus.done,
] as const satisfies readonly TaskStatus[];

export type BoardColumnStatus = (typeof BOARD_COLUMN_ORDER)[number];

export type BoardColumn<TTask extends BoardTaskLike> = {
  id: string;
  status: BoardColumnStatus;
  tasks: TTask[];
};

type BoardDropTarget = {
  status: BoardColumnStatus;
  targetIndex: number;
};

export function getBoardColumnId(status: BoardColumnStatus) {
  return `column:${status}`;
}

export function getBoardTaskId(taskId: number) {
  return `task:${taskId}`;
}

function parseBoardColumnId(value: string) {
  const status = value.replace("column:", "");

  if (BOARD_COLUMN_ORDER.includes(status as BoardColumnStatus)) {
    return status as BoardColumnStatus;
  }

  return undefined;
}

function parseBoardTaskId(value: string) {
  const taskId = Number(value.replace("task:", ""));

  return Number.isInteger(taskId) ? taskId : undefined;
}

export function buildBoardColumns<TTask extends BoardTaskLike>(tasks: readonly TTask[]) {
  return BOARD_COLUMN_ORDER.map((status) => ({
    id: getBoardColumnId(status),
    status,
    tasks: tasks.filter((task) => task.status === status),
  }));
}

export function getBoardDropTarget<TTask extends BoardTaskLike>(
  columns: readonly BoardColumn<TTask>[],
  input: {
    activeTaskId: number;
    overId: string | null | undefined;
  },
): BoardDropTarget | undefined {
  if (!input.overId) {
    return undefined;
  }

  const columnStatus = parseBoardColumnId(input.overId);

  if (columnStatus) {
    const column = columns.find((item) => item.status === columnStatus);

    return {
      status: columnStatus,
      targetIndex: column?.tasks.length ?? 0,
    };
  }

  const overTaskId = parseBoardTaskId(input.overId);

  if (!overTaskId) {
    return undefined;
  }

  for (const column of columns) {
    const targetIndex = column.tasks.findIndex((task) => task.id === overTaskId);

    if (targetIndex >= 0) {
      return {
        status: column.status,
        targetIndex,
      };
    }
  }

  return undefined;
}

export function moveBoardTaskLocally<TTask extends BoardTaskLike>(
  tasks: readonly TTask[],
  input: BoardDropTarget & {
    taskId: number;
  },
) {
  const taskMap = new Map(tasks.map((task) => [task.id, task]));
  const activeTask = taskMap.get(input.taskId);

  if (!activeTask) {
    return [...tasks];
  }

  const sourceStatus = activeTask.status as BoardColumnStatus;
  const groupedTaskIds = new Map(
    buildBoardColumns(tasks).map((column) => [column.status, column.tasks.map((task) => task.id)]),
  );
  const sourceTaskIds = groupedTaskIds.get(sourceStatus) ?? [];
  const destinationTaskIds =
    sourceStatus === input.status ? sourceTaskIds : [...(groupedTaskIds.get(input.status) ?? [])];

  groupedTaskIds.set(
    sourceStatus,
    sourceTaskIds.filter((taskId) => taskId !== input.taskId),
  );

  const nextDestinationTaskIds =
    sourceStatus === input.status
      ? (groupedTaskIds.get(input.status) ?? [])
      : destinationTaskIds.filter((taskId) => taskId !== input.taskId);
  const nextTargetIndex = Math.max(0, Math.min(input.targetIndex, nextDestinationTaskIds.length));

  nextDestinationTaskIds.splice(nextTargetIndex, 0, input.taskId);
  groupedTaskIds.set(input.status, nextDestinationTaskIds);

  return BOARD_COLUMN_ORDER.flatMap((status) =>
    (groupedTaskIds.get(status) ?? []).flatMap((taskId) => {
      const task = taskMap.get(taskId);

      if (!task) {
        return [];
      }

      if (task.id === input.taskId) {
        return [{ ...task, status: input.status }];
      }

      return [task];
    }),
  );
}
