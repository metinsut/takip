import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

export const projectSchema = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("project_name_idx").on(table.name)],
);

export const updateProjectSchema = createUpdateSchema(projectSchema)
  .omit({
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: z.string().min(1),
    name: z.string().trim().min(3).max(160),
    description: z.string().trim().min(1).max(5000).optional(),
  });
export type UpdateProjectType = z.infer<typeof updateProjectSchema>;

export const createProjectSchema = createInsertSchema(projectSchema)
  .omit({
    id: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().trim().min(3).max(160),
    description: z.string().trim().min(1).max(5000).optional(),
  });
export type CreateProjectType = z.infer<typeof createProjectSchema>;
