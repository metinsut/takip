import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { project as projectSchema, updateProjectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const updateProject = createServerFn({ method: "POST" })
  .inputValidator(updateProjectSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const values = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
    };

    const [updatedProject] = await db
      .update(projectSchema)
      .set(values)
      .where(and(eq(projectSchema.id, data.id), eq(projectSchema.createdBy, userId)))
      .returning();

    return updatedProject ?? null;
  });
