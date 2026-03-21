import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { user } from "./auth-schema";
import { task } from "./task-schema";

export const taskComment = pgTable(
  "task_comment",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    taskId: integer("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    deletedBy: text("deleted_by").references(() => user.id, { onDelete: "set null" }),
  },
  (table) => [
    index("task_comment_task_deleted_created_idx").on(
      table.taskId,
      table.deletedAt,
      table.createdAt,
    ),
    index("task_comment_author_created_idx").on(table.authorId, table.createdAt),
  ],
);

export type TaskComment = typeof taskComment.$inferSelect;

export const createTaskCommentSchema = z.object({
  taskId: z.number().int().positive(),
  body: z.string().trim().min(1).max(10_000),
});

export const updateTaskCommentSchema = z.object({
  id: z.number().int().positive(),
  body: z.string().trim().min(1).max(10_000),
});

export type CreateTaskCommentType = z.infer<typeof createTaskCommentSchema>;
export type UpdateTaskCommentType = z.infer<typeof updateTaskCommentSchema>;
