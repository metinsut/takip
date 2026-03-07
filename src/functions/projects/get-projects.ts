import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectsQueryKey } from "./shared";

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return [];
  }

  const projects = await db
    .select()
    .from(projectSchema)
    .where(eq(projectSchema.createdBy, userId))
    .orderBy(desc(projectSchema.updatedAt));

  return projects;
});

export function useGetProjects() {
  return queryOptions({
    queryKey: [getProjectsQueryKey],
    queryFn: () => getProjects(),
  });
}
