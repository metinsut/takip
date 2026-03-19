import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { projectSchema, saveProjectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const createProject = createServerFn({ method: "POST" })
  .inputValidator(saveProjectSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [createdProject] = await db
      .insert(projectSchema)
      .values({
        name: data.name,
        description: data.description,
        createdBy: userId,
      })
      .returning();

    return createdProject;
  });
