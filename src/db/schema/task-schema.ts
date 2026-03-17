import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";
import { projectSchema } from "./project-schema";

export const taskStatus = {
  todo: "todo",
  in_progress: "in_progress",
  done: "done",
} as const;

export const taskPriority = {
  low: "low",
  medium: "medium",
  high: "high",
} as const;

export const taskStatusEnum = pgEnum("status", Object.values(taskStatus) as [string, ...string[]]);
export const taskPriorityEnum = pgEnum(
  "priority",
  Object.values(taskPriority) as [string, ...string[]],
);

export const task = pgTable(
  "task",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projectSchema.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    status: taskStatusEnum("status").notNull().default("todo"),
    priority: taskPriorityEnum("priority").default("medium").notNull(),
    assigneeId: text("assignee_id").references(() => user.id, { onDelete: "set null" }),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    dueDate: timestamp("due_date"),
    completedAt: timestamp("completed_at"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("task_project_status_sort_order_idx").on(table.projectId, table.status, table.sortOrder),
    index("task_project_due_date_idx").on(table.projectId, table.dueDate),
    index("task_project_assignee_idx").on(table.projectId, table.assigneeId),
    index("task_project_created_by_idx").on(table.projectId, table.createdBy),
  ],
);

export type Task = typeof task.$inferSelect;
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];

export const taskStatusSchema = z.enum(taskStatusEnum.enumValues);
export const taskPrioritySchema = z.enum(taskPriorityEnum.enumValues);

export const saveTaskSchema = createInsertSchema(task)
  .omit({
    createdBy: true,
    createdAt: true,
    updatedAt: true,
    completedAt: true,
    sortOrder: true,
  })
  .extend({
    id: z.number().int().positive().optional(),
    projectId: z.number().int().positive(),
    title: z.string().trim().min(1).max(500),
    description: z.string().trim().min(1).max(5000),
    status: taskStatusSchema,
    priority: taskPrioritySchema,
    dueDate: z.date().optional(),
    assigneeId: z.string().trim().min(1).optional(),
  });
export type SaveTaskType = z.infer<typeof saveTaskSchema>;
