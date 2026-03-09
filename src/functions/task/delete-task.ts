import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { toast } from "@/components/ui/sonner";
import { db } from "@/db";
import { task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";

export const deleteTask = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const [deletedTask] = await db
      .delete(task)
      .where(and(eq(task.id, data.id), eq(task.createdBy, userId)))
      .returning();

    return deletedTask ?? null;
  });

export function useDeleteTask() {
  return useMutation({
    mutationFn: (id: number) => deleteTask({ data: { id } }),
    onSuccess: () => {
      toast.success("Görev başarıyla silindi.");
    },
    onError: () => {
      toast.error("Görev silinirken bir hata oluştu.");
    },
  });
}
