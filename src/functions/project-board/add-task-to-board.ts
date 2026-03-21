import { useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { toast } from "@/components/ui/sonner";
import { db } from "@/db";
import { addTaskToBoardSchema, board, taskStatus } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { assertOwnedProjectForUser } from "@/functions/task/task-access";
import { getNextBoardSortOrder, getOwnedBoardMembershipForUser } from "./board-access";
import { getTaskBoardActionCopy } from "./task-board-action";

export const addTaskToBoard = createServerFn({ method: "POST" })
  .inputValidator(addTaskToBoardSchema)
  .handler(async ({ data }) => {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    return db.transaction(async (tx) => {
      const now = new Date();
      const boardState = await getOwnedBoardMembershipForUser(tx, {
        now,
        taskId: data.taskId,
        userId,
      });

      await assertOwnedProjectForUser(tx, {
        projectId: boardState.task.projectId,
        userId,
      });

      if (boardState.isActive && boardState.membership) {
        return boardState.membership;
      }

      const nextSortOrder = await getNextBoardSortOrder(tx, {
        projectId: boardState.task.projectId,
        status: boardState.task.status,
      });

      const nextDoneAt = boardState.task.status === taskStatus.done ? now : null;

      if (boardState.membership) {
        const [reactivatedMembership] = await tx
          .update(board)
          .set({
            doneAt: nextDoneAt,
            projectId: boardState.task.projectId,
            removedAt: null,
            sortOrder: nextSortOrder,
          })
          .where(eq(board.id, boardState.membership.id))
          .returning();

        return reactivatedMembership ?? undefined;
      }

      const [createdMembership] = await tx
        .insert(board)
        .values({
          doneAt: nextDoneAt,
          projectId: boardState.task.projectId,
          sortOrder: nextSortOrder,
          taskId: boardState.task.id,
        })
        .returning();

      return createdMembership ?? undefined;
    });
  });

export function useAddTaskToBoard() {
  const copy = getTaskBoardActionCopy(false);

  return useMutation({
    mutationFn: (taskId: number) => addTaskToBoard({ data: { taskId } }),
    onSuccess: () => {
      toast.success(copy.successMessage);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : copy.errorMessage);
    },
  });
}
