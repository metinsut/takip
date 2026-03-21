import type { db } from "@/db";
import {
  type TaskActivityActorType,
  type TaskActivityPayload,
  type TaskActivityType,
  taskActivity,
} from "@/db/schema";

type InsertExecutor = Pick<typeof db, "insert">;

export async function recordTaskActivity(
  executor: InsertExecutor,
  input: {
    actorId?: string;
    actorType?: TaskActivityActorType;
    commentId?: number;
    payload: TaskActivityPayload;
    projectId: number;
    taskId: number;
    type: TaskActivityType;
  },
) {
  const [activity] = await executor
    .insert(taskActivity)
    .values({
      actorId: input.actorId,
      actorType: input.actorType ?? "user",
      commentId: input.commentId,
      payload: input.payload,
      projectId: input.projectId,
      taskId: input.taskId,
      type: input.type,
    })
    .returning();

  return activity ?? undefined;
}
