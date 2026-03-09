import { index, integer, pgTable, primaryKey, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { organizationSchema } from "./organization-schema";
import { task } from "./task-schema";

export const label = pgTable(
  "label",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizationSchema.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("label_organization_name_idx").on(table.organizationId, table.name),
    index("label_organization_id_idx").on(table.organizationId),
  ],
);

export const taskLabel = pgTable(
  "task_label",
  {
    taskId: integer("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => label.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.taskId, table.labelId], name: "task_label_task_id_label_id_pk" }),
    index("task_label_label_id_idx").on(table.labelId),
  ],
);
