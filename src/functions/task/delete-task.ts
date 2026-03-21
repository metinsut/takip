import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { db } from "@/db";
import { task, taskActivityType } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { buildTaskDeletedPayload } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";
import { getOwnedTaskForUser } from "./task-access";

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return db.transaction(async (tx) => {
      const existingTask = await getOwnedTaskForUser(tx, {
        taskId: data.id,
        userId,
      });

      await recordTaskActivity(tx, {
        actorId: userId,
        payload: buildTaskDeletedPayload({
          assigneeId: existingTask.assigneeId ?? undefined,
          completedAt: existingTask.completedAt ?? undefined,
          description: existingTask.description,
          dueDate: existingTask.dueDate ?? undefined,
          priority: existingTask.priority,
          projectId: existingTask.projectId,
          status: existingTask.status,
          title: existingTask.title,
        }),
        projectId: existingTask.projectId,
        taskId: existingTask.id,
        type: taskActivityType.task_deleted,
      });

      const [deletedTask] = await tx.delete(task).where(eq(task.id, data.id)).returning();

      return deletedTask ?? undefined;
    });
  });

export function useDeleteTask() {
  return useMutation({
    mutationFn: (id: number) => deleteTask({ data: { id } }),
    onSuccess: () => {
      toast.success("Görev başarıyla silindi.");
    },
    onError: () => {
      toast.error("Görev silinirken bir hata oluştu.");
    },
  });
}
