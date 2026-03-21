import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { z } from "zod";
import { db } from "@/db";
import { taskActivity, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getOwnedTaskForUser } from "@/functions/task/task-access";
import { getTaskActivitiesQueryKey } from "./shared";

const actorUser = alias(userSchema, "task_activity_actor_user");

export const getTaskActivities = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      limit: z.number().int().positive().max(200).optional(),
      taskId: z.coerce.number().int().positive(),
    }),
  )
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await getOwnedTaskForUser(db, {
      taskId: data.taskId,
      userId,
    });

    const activities = await db
      .select({
        id: taskActivity.id,
        taskId: taskActivity.taskId,
        projectId: taskActivity.projectId,
        commentId: taskActivity.commentId,
        type: taskActivity.type,
        actorType: taskActivity.actorType,
        actorId: taskActivity.actorId,
        payload: taskActivity.payload,
        occurredAt: taskActivity.occurredAt,
        actorUser: {
          id: actorUser.id,
          name: actorUser.name,
          email: actorUser.email,
          image: actorUser.image,
        },
      })
      .from(taskActivity)
      .leftJoin(actorUser, eq(taskActivity.actorId, actorUser.id))
      .where(eq(taskActivity.taskId, data.taskId))
      .orderBy(desc(taskActivity.occurredAt), desc(taskActivity.id))
      .limit(data.limit ?? 100);

    return activities.map((activity) => {
      const actor = activity.actorUser;

      return {
        ...activity,
        actorId: activity.actorId ?? undefined,
        actorUser: actor
          ? {
              ...actor,
              image: actor.image ?? undefined,
            }
          : undefined,
        commentId: activity.commentId ?? undefined,
      };
    });
  });

export function useGetTaskActivities(taskId: number, limit = 100) {
  return queryOptions({
    enabled: taskId > 0,
    queryKey: [getTaskActivitiesQueryKey, taskId, limit],
    queryFn: () => getTaskActivities({ data: { limit, taskId } }),
  });
}
