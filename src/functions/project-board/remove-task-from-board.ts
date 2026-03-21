import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  projectBoardTask,
  removeTaskFromBoardSchema,
  task,
  taskActivityType,
  taskStatus,
} from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { buildTaskUpdateChanges } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";
import { getActiveBoardMembershipByTaskId } from "./board-access";

export const removeTaskFromBoard = createServerFn({ method: "POST" })
  .inputValidator(removeTaskFromBoardSchema)
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

      const changes = buildTaskUpdateChanges({
        after: {
          assigneeId: boardState.task.assigneeId ?? undefined,
          completedAt: boardState.task.completedAt ?? undefined,
          description: boardState.task.description,
          dueDate: boardState.task.dueDate ?? undefined,
          priority: boardState.task.priority,
          projectId: boardState.task.projectId,
          status: taskStatus.todo,
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
          status: taskStatus.todo,
        })
        .where(eq(task.id, boardState.task.id))
        .returning();

      const [updatedMembership] = await tx
        .update(projectBoardTask)
        .set({
          doneAt: null,
          removedAt: now,
        })
        .where(eq(projectBoardTask.id, boardState.membership.id))
        .returning();

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

      return {
        membership: updatedMembership ?? undefined,
        task: updatedTask ?? undefined,
      };
    });
  });
