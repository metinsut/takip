import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { saveTaskSchema, task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getTask } from "./get-task";

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

    const existing = await getTask({ data: { taskId: data.id } });

    if (!existing || existing.createdBy !== userId) {
      throw new Error("Task not found");
    }

    const [updatedTask] = await db
      .update(task)
      .set(data)
      .where(and(eq(task.id, data.id), eq(task.createdBy, userId)))
      .returning();

    return updatedTask ?? null;
  });
