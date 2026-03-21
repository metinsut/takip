import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { saveTaskSchema, task, taskActivityType } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { buildTaskCreatedPayload } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";
import { assertOwnedProjectForUser } from "./task-access";

export const createTask = createServerFn({ method: "POST" })
  .inputValidator(saveTaskSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return db.transaction(async (tx) => {
      await assertOwnedProjectForUser(tx, {
        projectId: data.projectId,
        userId,
      });

      const [createdTask] = await tx
        .insert(task)
        .values({
          assigneeId: data.assigneeId,
          createdBy: userId,
          description: data.description,
          dueDate: data.dueDate,
          priority: data.priority ?? "medium",
          projectId: data.projectId,
          status: data.status ?? "todo",
          title: data.title,
        })
        .returning();

      if (!createdTask) {
        return undefined;
      }

      await recordTaskActivity(tx, {
        actorId: userId,
        payload: buildTaskCreatedPayload({
          assigneeId: createdTask.assigneeId ?? undefined,
          completedAt: createdTask.completedAt ?? undefined,
          description: createdTask.description,
          dueDate: createdTask.dueDate ?? undefined,
          priority: createdTask.priority,
          projectId: createdTask.projectId,
          status: createdTask.status,
          title: createdTask.title,
        }),
        projectId: createdTask.projectId,
        taskId: createdTask.id,
        type: taskActivityType.task_created,
      });

      return createdTask;
    });
  });
