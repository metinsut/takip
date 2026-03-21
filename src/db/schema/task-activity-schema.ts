import { index, integer, jsonb, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import type { TaskPriority, TaskStatus } from "./task-schema";

export const taskActivityType = {
  task_created: "task_created",
  task_updated: "task_updated",
  task_deleted: "task_deleted",
  comment_created: "comment_created",
  comment_updated: "comment_updated",
  comment_deleted: "comment_deleted",
} as const;

export const taskActivityActorType = {
  user: "user",
  system: "system",
} as const;

export const taskActivityTypeEnum = pgEnum(
  "task_activity_type",
  Object.values(taskActivityType) as [string, ...string[]],
);

export const taskActivityActorTypeEnum = pgEnum(
  "task_activity_actor_type",
  Object.values(taskActivityActorType) as [string, ...string[]],
);

export type TaskActivityTrackedField =
  | "projectId"
  | "title"
  | "description"
  | "status"
  | "priority"
  | "assigneeId"
  | "dueDate"
  | "completedAt";

export type TaskActivityTrackedValue = number | string | undefined;

export type TaskActivitySnapshot = {
  assigneeId?: string;
  completedAt?: string;
  description: string;
  dueDate?: string;
  priority: TaskPriority;
  projectId: number;
  status: TaskStatus;
  title: string;
};

export type TaskActivityFieldChange = {
  after: TaskActivityTrackedValue;
  before: TaskActivityTrackedValue;
  field: TaskActivityTrackedField;
};

export type TaskCreatedActivityPayload = {
  snapshot: TaskActivitySnapshot;
};

export type TaskUpdatedActivityPayload = {
  changes: TaskActivityFieldChange[];
};

export type TaskDeletedActivityPayload = {
  snapshot: TaskActivitySnapshot;
};

export type CommentCreatedActivityPayload = {
  body: string;
};

export type CommentUpdatedActivityPayload = {
  afterBody: string;
  beforeBody: string;
};

export type CommentDeletedActivityPayload = {
  body: string;
};

export type TaskActivityPayload =
  | CommentCreatedActivityPayload
  | CommentDeletedActivityPayload
  | CommentUpdatedActivityPayload
  | TaskCreatedActivityPayload
  | TaskDeletedActivityPayload
  | TaskUpdatedActivityPayload;

export const taskActivity = pgTable(
  "task_activity",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    taskId: integer("task_id").notNull(),
    projectId: integer("project_id").notNull(),
    commentId: integer("comment_id"),
    type: taskActivityTypeEnum("type").notNull(),
    actorType: taskActivityActorTypeEnum("actor_type").notNull().default("user"),
    actorId: text("actor_id"),
    payload: jsonb("payload").$type<TaskActivityPayload>().notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("task_activity_task_occurred_idx").on(table.taskId, table.occurredAt),
    index("task_activity_project_occurred_idx").on(table.projectId, table.occurredAt),
    index("task_activity_comment_occurred_idx").on(table.commentId, table.occurredAt),
  ],
);

export type TaskActivity = typeof taskActivity.$inferSelect;
export type TaskActivityType = (typeof taskActivityTypeEnum.enumValues)[number];
export type TaskActivityActorType = (typeof taskActivityActorTypeEnum.enumValues)[number];

export const taskActivityTypeSchema = z.enum(taskActivityTypeEnum.enumValues);
export const taskActivityActorTypeSchema = z.enum(taskActivityActorTypeEnum.enumValues);
