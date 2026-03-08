import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { db } from "@/db";
import { projectSchema } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { m } from "@/paraglide/messages";

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [deletedProject] = await db
      .delete(projectSchema)
      .where(and(eq(projectSchema.id, data.id), eq(projectSchema.createdBy, userId)))
      .returning();

    return deletedProject ?? null;
  });

export function useDeleteProject() {
  return useMutation({
    mutationFn: (id: string) => deleteProject({ data: { id } }),
    onSuccess: () => {
      toast.success(m.deleteProjectSuccess());
    },
    onError: () => {
      toast.error(m.deleteProjectError());
    },
  });
}
