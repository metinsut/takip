import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { taskComment, user as userSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getOwnedTaskForUser } from "@/functions/task/task-access";
import { getTaskCommentsQueryKey } from "./shared";

export const getTaskComments = createServerFn({ method: "GET" })
  .inputValidator(z.object({ taskId: z.coerce.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    await getOwnedTaskForUser(db, {
      taskId: data.taskId,
      userId,
    });

    const comments = await db
      .select({
        id: taskComment.id,
        taskId: taskComment.taskId,
        body: taskComment.body,
        createdAt: taskComment.createdAt,
        updatedAt: taskComment.updatedAt,
        editedAt: taskComment.editedAt,
        author: {
          id: userSchema.id,
          name: userSchema.name,
          email: userSchema.email,
          image: userSchema.image,
        },
      })
      .from(taskComment)
      .innerJoin(userSchema, eq(taskComment.authorId, userSchema.id))
      .where(and(eq(taskComment.taskId, data.taskId), isNull(taskComment.deletedAt)))
      .orderBy(asc(taskComment.createdAt));

    return comments.map((comment) => ({
      ...comment,
      editedAt: comment.editedAt ?? undefined,
      author: {
        ...comment.author,
        image: comment.author.image ?? undefined,
      },
    }));
  });

export function useGetTaskComments(taskId: number) {
  return queryOptions({
    enabled: taskId > 0,
    queryKey: [getTaskCommentsQueryKey, taskId],
    queryFn: () => getTaskComments({ data: { taskId } }),
  });
}
