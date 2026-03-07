import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth-schema";

export const project = pgTable(
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

export const projectSelectSchema = createSelectSchema(project);

export const projectInsertSchema = createInsertSchema(project, {
  id: z.string().trim().min(1).max(64),
  name: z.string().trim().min(3).max(160),
  description: z.string().trim().min(1).max(5000).optional(),
});

export const createProjectSchema = projectInsertSchema.omit({
  id: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
});

export const projectIdSchema = z.object({
  id: z.string().trim().min(1).max(64),
});

export const updateProjectSchema = projectIdSchema
  .extend({
    name: z.string().trim().min(3).max(160).optional(),
    description: z.string().trim().min(1).max(5000).nullable().optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided.",
  });

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ProjectIdInput = z.infer<typeof projectIdSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
