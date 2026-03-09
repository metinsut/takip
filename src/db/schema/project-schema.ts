import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

export const projectSchema = pgTable(
  "project",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
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

export type ProjectType = typeof projectSchema.$inferSelect;

export const updateProjectSchema = createUpdateSchema(projectSchema)
  .omit({
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    id: z.number().int().positive(),
    name: z.string().trim().min(3).max(160),
    description: z.string().trim().min(1).max(5000).optional(),
  });
export type UpdateProjectType = z.infer<typeof updateProjectSchema>;

export const createProjectSchema = createInsertSchema(projectSchema)
  .omit({
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().trim().min(3).max(160),
    description: z.string().trim().min(1).max(5000).optional(),
  });
export type CreateProjectType = z.infer<typeof createProjectSchema>;
