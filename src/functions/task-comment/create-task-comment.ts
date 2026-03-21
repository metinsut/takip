import { createServerFn } from "@tanstack/react-start";
import { db } from "@/db";
import { createTaskCommentSchema, taskActivityType, taskComment } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getOwnedTaskForUser } from "@/functions/task/task-access";
import { buildCommentCreatedPayload } from "@/functions/task-activity/build-task-activity-payload";
import { recordTaskActivity } from "@/functions/task-activity/record-task-activity";

export const createTaskComment = createServerFn({ method: "POST" })
  .inputValidator(createTaskCommentSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return db.transaction(async (tx) => {
      const ownedTask = await getOwnedTaskForUser(tx, {
        taskId: data.taskId,
        userId,
      });

      const [comment] = await tx
        .insert(taskComment)
        .values({
          authorId: userId,
          body: data.body,
          taskId: data.taskId,
        })
        .returning();

      if (!comment) {
        return undefined;
      }

      await recordTaskActivity(tx, {
        actorId: userId,
        commentId: comment.id,
        payload: buildCommentCreatedPayload({
          body: comment.body,
        }),
        projectId: ownedTask.projectId,
        taskId: comment.taskId,
        type: taskActivityType.comment_created,
      });

      return comment;
    });
  });
