import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { createTaskSchema, task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProject } from "@/functions/project/get-project";

export const createTask = createServerFn({ method: "POST" })
  .inputValidator(createTaskSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const project = await getProject({ data: { projectId: data.projectId } });
    if (!project) {
      throw new Error("Project not found");
    }

    const [createdTask] = await db
      .insert(task)
      .values({
        id: crypto.randomUUID(),
        projectId: data.projectId,
        title: data.title,
        description: data.description ?? null,
        status: data.status ?? "todo",
        priority: data.priority ?? "medium",
        assigneeId: data.assigneeId ?? null,
        dueDate: data.dueDate ?? null,
        createdBy: userId,
      })
      .returning();

    return createdTask ?? null;
  });
