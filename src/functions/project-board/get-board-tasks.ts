import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, getTableColumns, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { board, task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectIdFromCookie } from "@/functions/project";
import { getBoardTasksQueryKey } from "./shared";

const boardStatusSortSql = sql<number>`
  case
    when ${task.status} = 'todo' then 0
    when ${task.status} = 'in_progress' then 1
    when ${task.status} = 'done' then 2
    else 3
  end
`;

export const getBoardTasks = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();
  const activeProjectId = await getProjectIdFromCookie();

  if (!userId || !activeProjectId) {
    throw new Error("Unauthorized");
  }

  return db
    .select({
      ...getTableColumns(task),
      boardAddedAt: board.addedAt,
      boardDoneAt: board.doneAt,
      boardId: board.id,
      boardSortOrder: board.sortOrder,
    })
    .from(board)
    .innerJoin(task, eq(board.taskId, task.id))
    .where(
      and(
        eq(board.projectId, activeProjectId),
        eq(task.createdBy, userId),
        isNull(board.removedAt),
        or(
          sql`${task.status} <> 'done'`,
          isNull(board.doneAt),
          sql`${board.doneAt} >= now() - interval '72 hours'`,
        ),
      ),
    )
    .orderBy(boardStatusSortSql, asc(board.sortOrder), asc(task.id));
});

export type BoardTaskListItem = Awaited<ReturnType<typeof getBoardTasks>>[number];

export function useGetBoardTasks(activeProjectId: number | null | undefined) {
  return queryOptions({
    queryKey: [getBoardTasksQueryKey, activeProjectId],
    queryFn: () => getBoardTasks(),
  });
}
