import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { and, eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { projectSchema, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjects } from "./get-projects";

export const getProjectQueryKey = "project-query-key";

export const PROJECT_COOKIE_ID = "project-id";

export const getProject = createServerFn({ method: "GET" })
  .inputValidator(z.object({ projectId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [project] = await db
      .select({
        ...getTableColumns(projectSchema),
        createdByUser: {
          id: userSchema.id,
          name: userSchema.name,
          email: userSchema.email,
        },
      })
      .from(projectSchema)
      .innerJoin(userSchema, eq(projectSchema.createdBy, userSchema.id))
      .where(and(eq(projectSchema.id, data.projectId), eq(projectSchema.createdBy, userId)))
      .limit(1);

    return project;
  });

export function useGetProject(projectId: number) {
  return queryOptions({
    queryKey: [getProjectQueryKey, projectId],
    queryFn: () => getProject({ data: { projectId } }),
    enabled: !!projectId && projectId > 0,
  });
}

export const getProjectIdFromCookie = createServerFn().handler(async () => {
  const cookieProjectId = getCookie(PROJECT_COOKIE_ID);
  const activeProjectId = cookieProjectId ? Number(cookieProjectId) : undefined;
  const projects = await getProjects();
  const activeProject = projects.find((project) => project.id === activeProjectId);
  if (activeProject) {
    return activeProjectId;
  }
  return undefined;
});

export const resetProjectServerFn = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(PROJECT_COOKIE_ID);
});

export const setProjectServerFn = createServerFn({ method: "POST" })
  .inputValidator(z.number().int().positive())
  .handler(async ({ data }) => {
    setCookie(PROJECT_COOKIE_ID, data.toString());
  });
