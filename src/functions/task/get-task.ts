import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { db } from "@/db";
import { task, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getTaskQueryKey } from "./shared";

const createdByUser = alias(userSchema, "created_by_user");
const assigneeUser = alias(userSchema, "assignee_user");

export const getTask = createServerFn({ method: "GET" })
  .inputValidator(z.object({ taskId: z.coerce.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [taskRow] = await db
      .select({
        ...getTableColumns(task),
        createdByUser: {
          id: createdByUser.id,
          name: createdByUser.name,
          email: createdByUser.email,
        },
        assigneeUser: {
          id: assigneeUser.id,
          name: assigneeUser.name,
          email: assigneeUser.email,
        },
      })
      .from(task)
      .innerJoin(createdByUser, eq(task.createdBy, createdByUser.id))
      .leftJoin(assigneeUser, eq(task.assigneeId, assigneeUser.id))
      .where(and(eq(task.id, data.taskId), eq(task.createdBy, userId)))
      .limit(1);

    return taskRow;
  });

export function useGetTask(taskId: string) {
  return queryOptions({
    queryKey: [getTaskQueryKey, taskId],
    queryFn: () => getTask({ data: { taskId } }),
  });
}
