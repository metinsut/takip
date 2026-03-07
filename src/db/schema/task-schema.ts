import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

export const taskStatusValues = ["todo", "in_progress", "done"] as const;

export const taskPriorityValues = ["low", "medium", "high"] as const;

export const taskStatusEnum = pgEnum("task_status", taskStatusValues);
export const taskPriorityEnum = pgEnum("task_priority", taskPriorityValues);

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id"),
    title: text("title").notNull(),
    description: text("description"),
    status: taskStatusEnum("status").default("todo").notNull(),
    priority: taskPriorityEnum("priority").default("medium").notNull(),
    assigneeId: text("assignee_id").references(() => user.id, { onDelete: "set null" }),
    reporterId: text("reporter_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    dueDate: timestamp("due_date"),
    completedAt: timestamp("completed_at"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("task_project_id_idx").on(table.projectId),
    index("task_status_idx").on(table.status),
    index("task_priority_idx").on(table.priority),
    index("task_assignee_id_idx").on(table.assigneeId),
    index("task_reporter_id_idx").on(table.reporterId),
    index("task_due_date_idx").on(table.dueDate),
    index("task_project_status_sort_order_idx").on(table.projectId, table.status, table.sortOrder),
  ],
);

export const taskStatusSchema = z.enum(taskStatusValues);
export const taskPrioritySchema = z.enum(taskPriorityValues);

export const taskSelectSchema = createSelectSchema(task);

export const taskInsertSchema = createInsertSchema(task, {
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().min(1).max(5000).optional(),
  projectId: z.string().trim().min(1).max(64).optional(),
  assigneeId: z.string().trim().min(1).optional(),
  reporterId: z.string().trim().min(1),
  dueDate: z.coerce.date().optional(),
});

export const createTaskSchema = taskInsertSchema.omit({
  id: true,
  reporterId: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Listing endpoint can reuse this for filter and pagination validation.
export const listTasksSchema = z.object({
  projectId: z.string().trim().min(1).max(64).optional(),
  assigneeId: z.string().trim().min(1).optional(),
  status: z.array(taskStatusSchema).optional(),
  priority: z.array(taskPrioritySchema).optional(),
  search: z.string().trim().min(1).max(160).optional(),
  includeCompleted: z.boolean().default(true),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type Task = typeof task.$inferSelect;
export type NewTask = typeof task.$inferInsert;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
