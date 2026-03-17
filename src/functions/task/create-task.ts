import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { saveTaskSchema, task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const createTask = createServerFn({ method: "POST" })
  .inputValidator(saveTaskSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [createdTask] = await db
      .insert(task)
      .values({
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        status: data.status ?? "todo",
        priority: data.priority ?? "medium",
        dueDate: data.dueDate,
        assigneeId: data.assigneeId,
        createdBy: userId,
      })
      .returning();

    return createdTask ?? undefined;
  });
