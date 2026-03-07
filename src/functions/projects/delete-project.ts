import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [deletedProject] = await db
      .delete(projectSchema)
      .where(and(eq(projectSchema.id, data.id), eq(projectSchema.createdBy, userId)))
      .returning();

    return deletedProject ?? null;
  });
