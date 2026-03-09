import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getTaskQueryKey } from "./shared";

export const getTask = createServerFn({ method: "GET" })
  .inputValidator(z.object({ taskId: z.coerce.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      return null;
    }

    const [taskRow] = await db
      .select()
      .from(task)
      .where(and(eq(task.id, data.taskId), eq(task.createdBy, userId)))
      .limit(1);

    return taskRow ?? null;
  });

export function useGetTask(taskId: string) {
  return queryOptions({
    queryKey: [getTaskQueryKey, taskId],
    queryFn: () => getTask({ data: { taskId } }),
  });
}
