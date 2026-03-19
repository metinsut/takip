import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { projectSchema, task, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectIdFromCookie } from "@/functions/project";
import { getTasksQueryKey } from "./shared";

export const getTasks = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();
  const activeProjectId = await getProjectIdFromCookie();

  if (!userId || !activeProjectId) {
    throw new Error("Unauthorized");
  }

  const tasks = await db
    .select({
      ...getTableColumns(task),
      projectName: projectSchema.name,
      user: {
        id: userSchema.id,
        name: userSchema.name,
      },
    })
    .from(task)
    .innerJoin(projectSchema, eq(task.projectId, projectSchema.id))
    .innerJoin(userSchema, eq(task.createdBy, userSchema.id))
    .where(and(eq(projectSchema.createdBy, userId), eq(task.projectId, activeProjectId)))
    .orderBy(desc(task.updatedAt));

  return tasks;
});

export type TaskListItem = Awaited<ReturnType<typeof getTasks>>[number];

export function useGetTasks(activeProjectId: number | null | undefined) {
  return queryOptions({
    queryKey: [getTasksQueryKey, activeProjectId],
    queryFn: () => getTasks(),
  });
}
