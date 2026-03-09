import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { createProjectSchema, projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const createProject = createServerFn({ method: "POST" })
  .inputValidator(createProjectSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [createdProject] = await db
      .insert(projectSchema)
      .values({
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description ?? null,
        createdBy: userId,
      })
      .returning();

    return createdProject ?? null;
  });
