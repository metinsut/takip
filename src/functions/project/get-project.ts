import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const getProjectQueryKey = "project-query-key";

export const PROJECT_COOKIE_ID = "project-id";

export const getProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ projectId: z.number().int().positive() }))
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

export function useGetProject(projectId: number) {
  return queryOptions({
    queryKey: [getProjectQueryKey, projectId],
    queryFn: () => getProject({ data: { projectId } }),
    enabled: !!projectId && projectId > 0,
  });
}

export const getProjectServerFn = createServerFn().handler(async () => {
  const cookieProjectId = getCookie(PROJECT_COOKIE_ID);
  return cookieProjectId ? Number(cookieProjectId) : null;
});

export const setProjectServerFn = createServerFn({ method: "POST" })
  .inputValidator(z.number().int().positive())
  .handler(async ({ data }) => {
    setCookie(PROJECT_COOKIE_ID, data.toString());
  });
