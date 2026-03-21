import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { saveTaskSchema, task, taskActivityType } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
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
      const existingTask = await getOwnedTaskForUser(tx, {
        taskId,
        userId,
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
