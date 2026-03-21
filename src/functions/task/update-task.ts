import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { board, saveTaskSchema, task, taskActivityType } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getBoardMembershipByTaskId } from "@/functions/project-board/board-access";
import { getNextDoneAt, isBoardMembershipActive } from "@/functions/project-board/board-helpers";
import { buildTaskUpdateChanges } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";
import { assertOwnedProjectForUser, getOwnedTaskForUser } from "./task-access";

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator(saveTaskSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!data.id) {
      throw new Error("Task ID is required");
    }

    const taskId = data.id;

    return db.transaction(async (tx) => {
      const now = new Date();
      const existingTask = await getOwnedTaskForUser(tx, {
        taskId,
        userId,
      });
      const membership = await getBoardMembershipByTaskId(tx, {
        taskId,
      });

      await assertOwnedProjectForUser(tx, {
        projectId: data.projectId,
        userId,
      });

      const changes = buildTaskUpdateChanges({
        after: {
          assigneeId: data.assigneeId,
          completedAt: existingTask.completedAt ?? undefined,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority,
          projectId: data.projectId,
          status: data.status,
          title: data.title,
        },
        before: {
          assigneeId: existingTask.assigneeId ?? undefined,
          completedAt: existingTask.completedAt ?? undefined,
          description: existingTask.description,
          dueDate: existingTask.dueDate ?? undefined,
          priority: existingTask.priority,
          projectId: existingTask.projectId,
          status: existingTask.status,
          title: existingTask.title,
        },
      });

      if (changes.length === 0) {
        return existingTask;
      }

      const [updatedTask] = await tx
        .update(task)
        .set({
          assigneeId: data.assigneeId ?? null,
          description: data.description,
          dueDate: data.dueDate ?? null,
          priority: data.priority,
          projectId: data.projectId,
          status: data.status,
          title: data.title,
        })
        .where(eq(task.id, taskId))
        .returning();

      if (!updatedTask) {
        return undefined;
      }

      if (membership) {
        const membershipWasActive = isBoardMembershipActive({
          doneAt: membership.doneAt ?? undefined,
          now,
          removedAt: membership.removedAt ?? undefined,
          status: existingTask.status,
        });
        const shouldCloseMembership =
          membershipWasActive && existingTask.projectId !== data.projectId;
        const nextDoneAt = getNextDoneAt({
          isMembershipActive: membershipWasActive && !shouldCloseMembership,
          nextStatus: data.status,
          now,
          previousDoneAt: membership.doneAt ?? undefined,
          previousStatus: existingTask.status,
        });
        const previousDoneAtTime = membership.doneAt?.getTime();
        const nextDoneAtTime = nextDoneAt?.getTime();
        const shouldSyncDoneAt = membershipWasActive && previousDoneAtTime !== nextDoneAtTime;

        if (shouldCloseMembership) {
          await tx
            .update(board)
            .set({
              doneAt: null,
              removedAt: now,
            })
            .where(eq(board.id, membership.id));
        } else if (shouldSyncDoneAt) {
          await tx
            .update(board)
            .set({
              doneAt: nextDoneAt ?? null,
            })
            .where(eq(board.id, membership.id));
        }
      }

      await recordTaskActivity(tx, {
        actorId: userId,
        payload: {
          changes,
        },
        projectId: updatedTask.projectId,
        taskId: updatedTask.id,
        type: taskActivityType.task_updated,
      });

      return updatedTask;
    });
  });
