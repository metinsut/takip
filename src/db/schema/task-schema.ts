import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";
import { projectSchema } from "./project-schema";

export const taskStatusEnum = pgEnum("status", ["todo", "in_progress", "done"]);
export const taskPriorityEnum = pgEnum("priority", ["low", "medium", "high"]);

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projectSchema.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
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
export type NewTask = typeof task.$inferInsert;
export type TaskStatus = (typeof taskStatusEnum.enumValues)[number];
export type TaskPriority = (typeof taskPriorityEnum.enumValues)[number];

const taskStatusSchema = z.enum(taskStatusEnum.enumValues);
const taskPrioritySchema = z.enum(taskPriorityEnum.enumValues);

export const updateTaskSchema = createUpdateSchema(task)
  .omit({
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: z.string().min(1),
    projectId: z.string().uuid().optional(),
    title: z.string().trim().min(1).max(500).optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: z.coerce.date().optional().nullable(),
  });
export type UpdateTaskType = z.infer<typeof updateTaskSchema>;

export const createTaskSchema = createInsertSchema(task)
  .omit({
    id: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
    completedAt: true,
    sortOrder: true,
  })
  .extend({
    projectId: z.string().uuid(),
    title: z.string().trim().min(1).max(500),
    description: z.string().trim().max(5000).optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: z.coerce.date().optional(),
  });
export type CreateTaskType = z.infer<typeof createTaskSchema>;
