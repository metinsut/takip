import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { projectSchema, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const getProjectsQueryKey = "projects-query-key";

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const projects = await db
    .select({
      ...getTableColumns(projectSchema),
      user: {
        id: userSchema.id,
        name: userSchema.name,
      },
    })
    .from(projectSchema)
    .innerJoin(userSchema, eq(projectSchema.createdBy, userSchema.id))
    .where(eq(projectSchema.createdBy, userId))
    .orderBy(desc(projectSchema.updatedAt));

  return projects;
});

export type ProjectListItem = Awaited<ReturnType<typeof getProjects>>[number];

export function useGetProjects() {
  return queryOptions({
    queryKey: [getProjectsQueryKey],
    queryFn: () => getProjects(),
  });
}
