import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { taskActivityType, taskComment, updateTaskCommentSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getOwnedCommentForUser } from "@/functions/task/task-access";
import { buildCommentUpdatedPayload } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";

export const updateTaskComment = createServerFn({ method: "POST" })
  .inputValidator(updateTaskCommentSchema)
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

      if (existingComment.body === data.body) {
        return existingComment;
      }

      const [updatedComment] = await tx
        .update(taskComment)
        .set({
          body: data.body,
          editedAt: new Date(),
        })
        .where(eq(taskComment.id, data.id))
        .returning();

      if (!updatedComment) {
        return undefined;
      }

      await recordTaskActivity(tx, {
        actorId: userId,
        commentId: updatedComment.id,
        payload: buildCommentUpdatedPayload({
          afterBody: updatedComment.body,
          beforeBody: existingComment.body,
        }),
        projectId: existingComment.projectId,
        taskId: updatedComment.taskId,
        type: taskActivityType.comment_updated,
      });

      return updatedComment;
    });
  });
