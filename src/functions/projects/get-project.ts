import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectQueryKey } from "./shared";

export const PROJECT_COOKIE = "project";

export const getProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ projectId: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return null;
    }

    const [project] = await db
      .select()
      .from(projectSchema)
      .where(and(eq(projectSchema.id, data.projectId), eq(projectSchema.createdBy, userId)))
      .limit(1);

    return project ?? null;
  });

export function useGetProject(projectId: string) {
  return queryOptions({
    queryKey: [getProjectQueryKey, projectId],
    queryFn: () => getProject({ data: { projectId } }),
  });
}

export const getProjectServerFn = createServerFn().handler(async () => {
  const cookieProject = getCookie(PROJECT_COOKIE);
  const project = cookieProject ? JSON.parse(cookieProject) : null;
  return project;
});
