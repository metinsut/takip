import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { board, moveBoardTaskSchema, type TaskStatus, task, taskActivityType } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { buildTaskUpdateChanges } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";
import { getActiveBoardMembershipByTaskId } from "./board-access";
import { getNextDoneAt, reorderBoardTaskIds } from "./board-helpers";

type ActiveBoardRow = {
  membershipId: number;
  taskId: number;
};

type BoardSelectExecutor = Pick<typeof db, "select">;
type BoardUpdateExecutor = Pick<typeof db, "update">;

const doneMembershipFilterSql = sql`${task.status} <> 'done' or ${board.doneAt} is null or ${board.doneAt} >= now() - interval '72 hours'`;

async function listActiveBoardRowsByStatus(input: {
  projectId: number;
  status: TaskStatus;
  tx: BoardSelectExecutor;
}) {
  return input.tx
    .select({
      membershipId: board.id,
      taskId: task.id,
    })
    .from(board)
    .innerJoin(task, eq(board.taskId, task.id))
    .where(
      and(
        eq(board.projectId, input.projectId),
        eq(task.status, input.status),
        isNull(board.removedAt),
        or(sql`${task.status} <> 'done'`, doneMembershipFilterSql),
      ),
    )
    .orderBy(asc(board.sortOrder), asc(task.id));
}

async function updateSortOrders(
  tx: BoardUpdateExecutor,
  rows: ActiveBoardRow[],
  taskIds: number[],
) {
  const membershipIdByTaskId = new Map(rows.map((row) => [row.taskId, row.membershipId]));

  for (const [sortOrder, taskId] of taskIds.entries()) {
    const membershipId = membershipIdByTaskId.get(taskId);

    if (!membershipId) {
      continue;
    }

    await tx
      .update(board)
      .set({
        sortOrder,
      })
      .where(eq(board.id, membershipId));
  }
}

export const moveBoardTask = createServerFn({ method: "POST" })
  .inputValidator(moveBoardTaskSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return db.transaction(async (tx) => {
      const now = new Date();
      const boardState = await getActiveBoardMembershipByTaskId(tx, {
        now,
        taskId: data.taskId,
        userId,
      });

      if (!boardState?.membership) {
        throw new Error("Board task not found");
      }

      const sourceStatus = boardState.task.status;
      const destinationStatus = data.status;
      const sourceRows = await listActiveBoardRowsByStatus({
        projectId: boardState.task.projectId,
        status: sourceStatus,
        tx,
      });

      if (sourceStatus === destinationStatus) {
        const reorderedTaskIds = reorderBoardTaskIds(
          sourceRows.map((row) => row.taskId),
          {
            taskId: boardState.task.id,
            targetIndex: data.targetIndex,
          },
        );

        await updateSortOrders(tx, sourceRows, reorderedTaskIds);
        return boardState.task;
      }

      const destinationRows = await listActiveBoardRowsByStatus({
        projectId: boardState.task.projectId,
        status: destinationStatus,
        tx,
      });

      const sourceTaskIds = sourceRows
        .filter((row) => row.taskId !== boardState.task.id)
        .map((row) => row.taskId);
      const destinationTaskIds = reorderBoardTaskIds(
        destinationRows.map((row) => row.taskId),
        {
          taskId: boardState.task.id,
          targetIndex: data.targetIndex,
        },
      );

      const changes = buildTaskUpdateChanges({
        after: {
          assigneeId: boardState.task.assigneeId ?? undefined,
          completedAt: boardState.task.completedAt ?? undefined,
          description: boardState.task.description,
          dueDate: boardState.task.dueDate ?? undefined,
          priority: boardState.task.priority,
          projectId: boardState.task.projectId,
          status: destinationStatus,
          title: boardState.task.title,
        },
        before: {
          assigneeId: boardState.task.assigneeId ?? undefined,
          completedAt: boardState.task.completedAt ?? undefined,
          description: boardState.task.description,
          dueDate: boardState.task.dueDate ?? undefined,
          priority: boardState.task.priority,
          projectId: boardState.task.projectId,
          status: boardState.task.status,
          title: boardState.task.title,
        },
      });

      const [updatedTask] = await tx
        .update(task)
        .set({
          status: destinationStatus,
        })
        .where(eq(task.id, boardState.task.id))
        .returning();

      const nextDoneAt = getNextDoneAt({
        isMembershipActive: true,
        nextStatus: destinationStatus,
        now,
        previousDoneAt: boardState.membership.doneAt ?? undefined,
        previousStatus: boardState.task.status,
      });

      await tx
        .update(board)
        .set({
          doneAt: nextDoneAt ?? null,
        })
        .where(eq(board.id, boardState.membership.id));

      await updateSortOrders(tx, sourceRows, sourceTaskIds);
      await updateSortOrders(
        tx,
        [
          ...destinationRows,
          {
            membershipId: boardState.membership.id,
            taskId: boardState.task.id,
          },
        ],
        destinationTaskIds,
      );

      if (updatedTask && changes.length > 0) {
        await recordTaskActivity(tx, {
          actorId: userId,
          payload: {
            changes,
          },
          projectId: updatedTask.projectId,
          taskId: updatedTask.id,
          type: taskActivityType.task_updated,
        });
      }

      return updatedTask ?? undefined;
    });
  });
