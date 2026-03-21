import { and, eq, getTableColumns, isNull, max, or, sql } from "drizzle-orm";
import type { db } from "@/db";
import { board, type TaskStatus, task } from "@/db/schema";
import { getOwnedTaskForUser } from "@/functions/task/task-access";
import { isBoardMembershipActive } from "./board-helpers";

type SelectExecutor = Pick<typeof db, "select">;

export async function getBoardMembershipByTaskId(
  executor: SelectExecutor,
  input: {
    taskId: number;
  },
) {
  const [membership] = await executor
    .select({
      ...getTableColumns(board),
    })
    .from(board)
    .where(eq(board.taskId, input.taskId))
    .limit(1);

  return membership;
}

export async function getOwnedBoardMembershipForUser(
  executor: SelectExecutor,
  input: {
    now?: Date;
    taskId: number;
    userId: string;
  },
) {
  const taskRow = await getOwnedTaskForUser(executor, {
    taskId: input.taskId,
    userId: input.userId,
  });
  const membership = await getBoardMembershipByTaskId(executor, {
    taskId: taskRow.id,
  });
  const now = input.now ?? new Date();

  const isActive = membership
    ? isBoardMembershipActive({
        doneAt: membership.doneAt ?? undefined,
        now,
        removedAt: membership.removedAt ?? undefined,
        status: taskRow.status,
      })
    : false;

  return { membership, isActive, task: taskRow };
}

export async function getActiveBoardMembershipByTaskId(
  executor: SelectExecutor,
  input: {
    now?: Date;
    taskId: number;
    userId: string;
  },
) {
  const state = await getOwnedBoardMembershipForUser(executor, input);

  if (!state.membership || !state.isActive) {
    return undefined;
  }

  return state;
}

export async function getNextBoardSortOrder(
  executor: SelectExecutor,
  input: {
    projectId: number;
    status: TaskStatus;
  },
) {
  const [result] = await executor
    .select({
      maxSortOrder: max(board.sortOrder),
    })
    .from(board)
    .innerJoin(task, eq(board.taskId, task.id))
    .where(
      and(
        eq(board.projectId, input.projectId),
        eq(task.status, input.status),
        isNull(board.removedAt),
        or(
          sql`${task.status} <> 'done'`,
          isNull(board.doneAt),
          sql`${board.doneAt} >= now() - interval '72 hours'`,
        ),
      ),
    );

  return (result?.maxSortOrder ?? -1) + 1;
}
