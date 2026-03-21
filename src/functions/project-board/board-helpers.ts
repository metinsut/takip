import { type TaskStatus, taskStatus } from "@/db/schema";

const DONE_RETENTION_MS = 72 * 60 * 60 * 1000;

type BoardVisibilityInput = {
  doneAt?: Date;
  now: Date;
  removedAt?: Date;
  status: TaskStatus;
};

export function isBoardTaskVisible(input: BoardVisibilityInput) {
  return isBoardMembershipActive(input);
}

export function isBoardMembershipActive(input: BoardVisibilityInput) {
  if (input.removedAt) {
    return false;
  }

  if (input.status !== taskStatus.done) {
    return true;
  }

  if (!input.doneAt) {
    return true;
  }

  return input.now.getTime() - input.doneAt.getTime() <= DONE_RETENTION_MS;
}

type NextDoneAtInput = {
  isMembershipActive: boolean;
  nextStatus: TaskStatus;
  now: Date;
  previousDoneAt?: Date;
  previousStatus: TaskStatus;
};

export function getNextDoneAt(input: NextDoneAtInput) {
  if (!input.isMembershipActive) {
    return input.previousDoneAt;
  }

  if (input.nextStatus === taskStatus.done && input.previousStatus !== taskStatus.done) {
    return input.now;
  }

  if (input.nextStatus !== taskStatus.done) {
    return undefined;
  }

  return input.previousDoneAt ?? input.now;
}

export function reorderBoardTaskIds(
  taskIds: number[],
  input: { taskId: number; targetIndex: number },
) {
  const nextTaskIds = taskIds.filter((id) => id !== input.taskId);
  nextTaskIds.splice(input.targetIndex, 0, input.taskId);
  return nextTaskIds;
}
