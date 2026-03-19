import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { projectSchema, saveProjectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const updateProject = createServerFn({ method: "POST" })
  .inputValidator(saveProjectSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (!data.id) {
      throw new Error("Project ID is required");
    }

    const [updatedProject] = await db
      .update(projectSchema)
      .set(data)
      .where(and(eq(projectSchema.id, data.id), eq(projectSchema.createdBy, userId)))
      .returning();

    return updatedProject;
  });
