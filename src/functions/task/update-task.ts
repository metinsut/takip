import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { task, updateTaskSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getTask } from "./get-task";

export const updateTask = createServerFn({ method: "POST" })
  .inputValidator(updateTaskSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existing = await getTask({ data: { taskId: data.id } });
    if (!existing || existing.createdBy !== userId) {
      throw new Error("Task not found");
    }

    const values = {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.priority !== undefined ? { priority: data.priority } : {}),
      ...(data.dueDate !== undefined ? { dueDate: data.dueDate } : {}),
    };

    const [updatedTask] = await db
      .update(task)
      .set(values)
      .where(and(eq(task.id, data.id), eq(task.createdBy, userId)))
      .returning();

    return updatedTask ?? null;
  });
