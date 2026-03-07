import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { type ProjectIdInput, projectIdSchema, project as projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectQueryKey } from "./shared";

export const getProject = createServerFn({ method: "GET" })
  .inputValidator(projectIdSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return null;
    }

    const [project] = await db
      .select()
      .from(projectSchema)
      .where(and(eq(projectSchema.id, data.id), eq(projectSchema.createdBy, userId)))
      .limit(1);

    return project ?? null;
  });

export function useGetProject(input: ProjectIdInput) {
  return queryOptions({
    queryKey: [getProjectQueryKey, input.id],
    queryFn: () => getProject({ data: input }),
  });
}
