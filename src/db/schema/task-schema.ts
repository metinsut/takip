import { index, integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
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
