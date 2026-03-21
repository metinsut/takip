import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { taskActivityType, taskComment } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getOwnedCommentForUser } from "@/functions/task/task-access";
import { buildCommentDeletedPayload } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";

export const deleteTaskComment = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return db.transaction(async (tx) => {
      const existingComment = await getOwnedCommentForUser(tx, {
        commentId: data.id,
        userId,
      });

      const [deletedComment] = await tx
        .update(taskComment)
        .set({
          deletedAt: new Date(),
          deletedBy: userId,
        })
        .where(eq(taskComment.id, data.id))
        .returning();

      if (!deletedComment) {
        return undefined;
      }

      await recordTaskActivity(tx, {
        actorId: userId,
        commentId: deletedComment.id,
        payload: buildCommentDeletedPayload({
          body: existingComment.body,
        }),
        projectId: existingComment.projectId,
        taskId: deletedComment.taskId,
        type: taskActivityType.comment_deleted,
      });

      return deletedComment;
    });
  });
