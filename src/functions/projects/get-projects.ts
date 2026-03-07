import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq, getTableColumns } from "drizzle-orm";
import { db } from "@/db";
import { projectSchema, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectsQueryKey } from "./shared";

export const getProjects = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return [];
  }

  const projects = await db
    .select({
      ...getTableColumns(projectSchema),
      user: {
        id: userSchema.id,
        name: userSchema.name,
        email: userSchema.email,
        image: userSchema.image,
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
