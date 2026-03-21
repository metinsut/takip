import { index, integer, pgTable, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod";
import { projectSchema } from "./project-schema";
import { task, taskStatusSchema } from "./task-schema";

export const board = pgTable(
  "board",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projectSchema.id, { onDelete: "cascade" }),
    taskId: integer("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
    doneAt: timestamp("done_at", { withTimezone: true }),
    removedAt: timestamp("removed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("board_task_id_unique").on(table.taskId),
    index("board_project_removed_sort_idx").on(table.projectId, table.removedAt, table.sortOrder),
    index("board_project_done_idx").on(table.projectId, table.doneAt),
  ],
);

export type Board = typeof board.$inferSelect;

export const addTaskToBoardSchema = z.object({
  taskId: z.number().int().positive(),
});

export const removeTaskFromBoardSchema = z.object({
  taskId: z.number().int().positive(),
});

export const moveBoardTaskSchema = z.object({
  taskId: z.number().int().positive(),
  status: taskStatusSchema,
  targetIndex: z.number().int().min(0),
});

export type AddTaskToBoardType = z.infer<typeof addTaskToBoardSchema>;
export type RemoveTaskFromBoardType = z.infer<typeof removeTaskFromBoardSchema>;
export type MoveBoardTaskType = z.infer<typeof moveBoardTaskSchema>;
