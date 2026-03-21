import { and, eq, getTableColumns } from "drizzle-orm";
import type { db } from "@/db";
import { projectSchema, task, taskComment } from "@/db/schema";

type SelectExecutor = Pick<typeof db, "select">;

export async function assertOwnedProjectForUser(
  executor: SelectExecutor,
  input: {
    projectId: number;
    userId: string;
  },
) {
  const [project] = await executor
    .select({
      id: projectSchema.id,
      createdBy: projectSchema.createdBy,
    })
    .from(projectSchema)
    .where(and(eq(projectSchema.id, input.projectId), eq(projectSchema.createdBy, input.userId)))
    .limit(1);

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function getOwnedTaskForUser(
  executor: SelectExecutor,
  input: {
    taskId: number;
    userId: string;
  },
) {
  const [taskRow] = await executor
    .select({
      ...getTableColumns(task),
    })
    .from(task)
    .where(and(eq(task.id, input.taskId), eq(task.createdBy, input.userId)))
    .limit(1);

  if (!taskRow) {
    throw new Error("Task not found");
  }

  return taskRow;
}

export async function getOwnedCommentForUser(
  executor: SelectExecutor,
  input: {
    commentId: number;
    userId: string;
  },
) {
  const [commentRow] = await executor
    .select({
      ...getTableColumns(taskComment),
      projectId: task.projectId,
      taskCreatedBy: task.createdBy,
    })
    .from(taskComment)
    .innerJoin(task, eq(taskComment.taskId, task.id))
    .where(and(eq(taskComment.id, input.commentId), eq(task.createdBy, input.userId)))
    .limit(1);

  if (!commentRow || commentRow.deletedAt) {
    throw new Error("Comment not found");
  }

  return commentRow;
}
