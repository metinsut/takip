# Project Board Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add backend schema and server functions for a per-project board that selects active work from the existing task backlog, without building UI in this step.

**Architecture:** Keep `task` as the source of truth for backlog items and task status. Add a separate `project_board_task` membership table to represent whether a task is currently on the active board, plus enough metadata to support done retention and future drag-and-drop ordering. Concentrate pure board rules in small helper modules so 72-hour visibility and sort-order logic are testable without hitting the database.

**Tech Stack:** Bun, TypeScript, TanStack Start server functions, PostgreSQL, Drizzle ORM, Zod

---

## File Structure

- Create: `src/db/schema/project-board-task-schema.ts`
  Responsibility: define the `project_board_task` table, related types, and Zod input schemas for board mutations.
- Modify: `src/db/schema/index.ts`
  Responsibility: export the new schema surface.
- Create: `src/functions/project-board/board-helpers.ts`
  Responsibility: pure board rules for done retention, membership activity, `doneAt` synchronization, and sort-order recalculation.
- Create: `src/functions/project-board/board-helpers.test.ts`
  Responsibility: unit tests for the pure rules above.
- Create: `src/functions/project-board/shared.ts`
  Responsibility: board query key constants.
- Create: `src/functions/project-board/board-access.ts`
  Responsibility: board-specific ownership, membership lookup, and next sort-order helpers for transactional server functions.
- Create: `src/functions/project-board/get-board-tasks.ts`
  Responsibility: read the active project's board tasks with done-retention filtering.
- Create: `src/functions/project-board/add-task-to-board.ts`
  Responsibility: activate or reactivate board membership for an existing task.
- Create: `src/functions/project-board/remove-task-from-board.ts`
  Responsibility: mark membership removed and force the task back to `todo`.
- Create: `src/functions/project-board/move-board-task.ts`
  Responsibility: reorder tasks within a column or move them across board columns.
- Create: `src/functions/project-board/index.ts`
  Responsibility: export the board function surface.
- Modify: `src/functions/task/update-task.ts`
  Responsibility: keep board membership `doneAt` in sync when an on-board task changes status or project.
- Create: `drizzle/0002_*.sql`
  Responsibility: the generated migration SQL file that creates the new table and indexes.
- Modify: `drizzle/meta/_journal.json`
- Modify: `drizzle/meta/0002_snapshot.json`

### Task 1: Add failing tests for pure board rules

**Files:**
- Create: `src/functions/project-board/board-helpers.test.ts`
- Create: `src/functions/project-board/board-helpers.ts`

- [ ] **Step 1: Write the failing test for done-retention visibility**

```ts
import { describe, expect, it } from "bun:test";
import { taskStatus } from "@/db/schema";
import { isBoardMembershipActive, isBoardTaskVisible } from "./board-helpers";

describe("isBoardTaskVisible", () => {
  const now = new Date("2026-03-22T10:00:00.000Z");

  it("returns true for active non-done tasks", () => {
    expect(
      isBoardTaskVisible({
        doneAt: undefined,
        now,
        removedAt: undefined,
        status: taskStatus.todo,
      }),
    ).toBe(true);
  });

  it("returns true for done tasks inside the 72-hour window", () => {
    expect(
      isBoardTaskVisible({
        doneAt: new Date("2026-03-19T11:00:00.000Z"),
        now,
        removedAt: undefined,
        status: taskStatus.done,
      }),
    ).toBe(true);
  });

  it("returns false for done tasks outside the 72-hour window", () => {
    expect(
      isBoardTaskVisible({
        doneAt: new Date("2026-03-19T09:59:59.000Z"),
        now,
        removedAt: undefined,
        status: taskStatus.done,
      }),
    ).toBe(false);
  });

  it("treats expired done memberships as inactive", () => {
    expect(
      isBoardMembershipActive({
        doneAt: new Date("2026-03-19T09:59:59.000Z"),
        now,
        removedAt: undefined,
        status: taskStatus.done,
      }),
    ).toBe(false);
  });
});
```

- [ ] **Step 2: Run the targeted test and verify it fails for missing implementation**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: FAIL with missing module or missing exported function errors.

- [ ] **Step 3: Extend the same test file with `doneAt` synchronization and reorder expectations**

```ts
import { taskStatus } from "@/db/schema";
import { getNextDoneAt, reorderBoardTaskIds } from "./board-helpers";

it("sets doneAt when an on-board task moves into done", () => {
  const now = new Date("2026-03-22T10:00:00.000Z");

  expect(
    getNextDoneAt({
      isMembershipActive: true,
      now,
      previousDoneAt: undefined,
      previousStatus: taskStatus.in_progress,
      nextStatus: taskStatus.done,
    }),
  ).toEqual(now);
});

it("clears doneAt when an on-board task leaves done", () => {
  expect(
    getNextDoneAt({
      isMembershipActive: true,
      now: new Date("2026-03-22T10:00:00.000Z"),
      previousDoneAt: new Date("2026-03-20T10:00:00.000Z"),
      previousStatus: taskStatus.done,
      nextStatus: taskStatus.todo,
    }),
  ).toBeUndefined();
});

it("reorders task ids around the requested target index", () => {
  expect(reorderBoardTaskIds([11, 22, 33], { taskId: 22, targetIndex: 0 })).toEqual([22, 11, 33]);
});
```

- [ ] **Step 4: Run the test again and verify the new cases also fail for the right reason**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: FAIL on missing `getNextDoneAt` and `reorderBoardTaskIds`.

- [ ] **Step 5: Implement the minimal helper module**

```ts
import { taskStatus, type TaskStatus } from "@/db/schema";

const DONE_RETENTION_MS = 72 * 60 * 60 * 1000;

export function isBoardTaskVisible(input: {
  doneAt?: Date;
  now: Date;
  removedAt?: Date;
  status: TaskStatus;
}) {
  return isBoardMembershipActive(input);
}

export function isBoardMembershipActive(input: {
  doneAt?: Date;
  now: Date;
  removedAt?: Date;
  status: TaskStatus;
}) {
  if (input.removedAt) return false;
  if (input.status !== taskStatus.done) return true;
  if (!input.doneAt) return true;
  return input.now.getTime() - input.doneAt.getTime() <= DONE_RETENTION_MS;
}

export function getNextDoneAt(input: {
  isMembershipActive: boolean;
  nextStatus: TaskStatus;
  now: Date;
  previousDoneAt?: Date;
  previousStatus: TaskStatus;
}) {
  if (!input.isMembershipActive) return input.previousDoneAt;
  if (input.nextStatus === taskStatus.done && input.previousStatus !== taskStatus.done) return input.now;
  if (input.nextStatus !== taskStatus.done) return undefined;
  return input.previousDoneAt ?? input.now;
}

export function reorderBoardTaskIds(taskIds: number[], input: { taskId: number; targetIndex: number }) {
  const next = taskIds.filter((id) => id !== input.taskId);
  next.splice(input.targetIndex, 0, input.taskId);
  return next;
}
```

- [ ] **Step 6: Run the targeted test and verify it passes**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: PASS

- [ ] **Step 7: Commit the pure board rules**

```bash
git add src/functions/project-board/board-helpers.ts src/functions/project-board/board-helpers.test.ts
git commit -m "test: add project board helper coverage"
```

### Task 2: Add board schema and export surface

**Files:**
- Create: `src/db/schema/project-board-task-schema.ts`
- Modify: `src/db/schema/index.ts`

- [ ] **Step 1: Write the failing type-level import check in the existing helper test file**

Add a minimal import in `src/functions/project-board/board-helpers.test.ts`:

```ts
import { taskStatus } from "@/db/schema";
```

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: FAIL if the new schema file or export changes introduce a broken barrel export.

- [ ] **Step 2: Create the board schema file**

```ts
import { index, integer, pgTable, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { z } from "zod";
import { projectSchema } from "./project-schema";
import { task, taskStatusSchema } from "./task-schema";

export const projectBoardTask = pgTable(
  "project_board_task",
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
    uniqueIndex("project_board_task_task_id_unique").on(table.taskId),
    index("project_board_task_project_removed_sort_idx").on(
      table.projectId,
      table.removedAt,
      table.sortOrder,
    ),
    index("project_board_task_project_done_idx").on(table.projectId, table.doneAt),
  ],
);

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
```

- [ ] **Step 3: Export the new schema surface**

Modify `src/db/schema/index.ts` to export `./project-board-task-schema`.

- [ ] **Step 4: Run the helper test again and verify the schema barrel still resolves**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the schema layer**

```bash
git add src/db/schema/project-board-task-schema.ts src/db/schema/index.ts
git commit -m "feat: add project board schema"
```

### Task 3: Add board access helpers and query keys

**Files:**
- Create: `src/functions/project-board/shared.ts`
- Create: `src/functions/project-board/board-access.ts`

- [ ] **Step 1: Create the shared query key file**

```ts
export const getBoardTasksQueryKey = "board-tasks-query-key";
```

- [ ] **Step 2: Create transaction-friendly board access helpers**

```ts
import { and, desc, eq, getTableColumns, isNull, max } from "drizzle-orm";
import type { db } from "@/db";
import { projectBoardTask, task } from "@/db/schema";
import { getOwnedTaskForUser } from "@/functions/task/task-access";

type SelectExecutor = Pick<typeof db, "select">;

export async function getOwnedBoardMembershipForUser(
  executor: SelectExecutor,
  input: { taskId: number; userId: string },
) {
  const taskRow = await getOwnedTaskForUser(executor, input);
  const [membership] = await executor
    .select({ ...getTableColumns(projectBoardTask) })
    .from(projectBoardTask)
    .where(eq(projectBoardTask.taskId, taskRow.id))
    .limit(1);

  return { membership, task: taskRow };
}
```

- [ ] **Step 3: Add helper coverage for next sort-order lookup and active membership checks**

Implement helpers in `src/functions/project-board/board-access.ts` for:
- `getBoardMembershipByTaskId`
- `getActiveBoardMembershipByTaskId`
- `getNextBoardSortOrder`

- [ ] **Step 4: Run the helper test suite to ensure no broken imports**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: PASS

- [ ] **Step 5: Commit the board access layer**

```bash
git add src/functions/project-board/shared.ts src/functions/project-board/board-access.ts
git commit -m "feat: add project board access helpers"
```

### Task 4: Add board read path

**Files:**
- Create: `src/functions/project-board/get-board-tasks.ts`
- Create: `src/functions/project-board/index.ts`

- [ ] **Step 1: Write a failing read-path test inside `src/functions/project-board/board-helpers.test.ts` for expired done filtering**

Add a pure expectation that documents the query rule:

```ts
it("treats removed memberships as invisible even before retention logic", () => {
  expect(
    isBoardTaskVisible({
      doneAt: undefined,
      now: new Date("2026-03-22T10:00:00.000Z"),
      removedAt: new Date("2026-03-22T09:00:00.000Z"),
      status: taskStatus.in_progress,
    }),
  ).toBe(false);
});
```

- [ ] **Step 2: Create the board read function**

```ts
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, getTableColumns, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { projectBoardTask, task } from "@/db/schema";
import { getAuthenticatedUserId } from "@/functions/auth/get-authenticated-userId";
import { getProjectIdFromCookie } from "@/functions/project";
import { getBoardTasksQueryKey } from "./shared";

export const getBoardTasks = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await getAuthenticatedUserId();
  const activeProjectId = await getProjectIdFromCookie();

  if (!userId || !activeProjectId) {
    throw new Error("Unauthorized");
  }

  return db
    .select({
      ...getTableColumns(task),
      boardId: projectBoardTask.id,
      boardSortOrder: projectBoardTask.sortOrder,
      boardAddedAt: projectBoardTask.addedAt,
      boardDoneAt: projectBoardTask.doneAt,
    })
    .from(projectBoardTask)
    .innerJoin(task, eq(projectBoardTask.taskId, task.id))
    .where(
      and(
        eq(projectBoardTask.projectId, activeProjectId),
        eq(task.createdBy, userId),
        isNull(projectBoardTask.removedAt),
        or(
          sql`${task.status} <> 'done'`,
          isNull(projectBoardTask.doneAt),
          sql`${projectBoardTask.doneAt} >= now() - interval '72 hours'`,
        ),
      ),
    )
    .orderBy(asc(task.status), asc(projectBoardTask.sortOrder), asc(task.id));
});

export function useGetBoardTasks(activeProjectId: number | null | undefined) {
  return queryOptions({
    queryKey: [getBoardTasksQueryKey, activeProjectId],
    queryFn: () => getBoardTasks(),
  });
}
```

- [ ] **Step 3: Export the read function from `src/functions/project-board/index.ts`**

```ts
export * from "./get-board-tasks";
export * from "./shared";
```

- [ ] **Step 4: Run the helper test suite and `bun run typecheck`**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: PASS

Run: `bun run typecheck`
Expected: no TypeScript errors from the new board read module.

- [ ] **Step 5: Commit the board read path**

```bash
git add src/functions/project-board/get-board-tasks.ts src/functions/project-board/index.ts
git commit -m "feat: add project board read functions"
```

### Task 5: Add write functions for add and remove board membership

**Files:**
- Create: `src/functions/project-board/add-task-to-board.ts`
- Create: `src/functions/project-board/remove-task-from-board.ts`
- Modify: `src/functions/project-board/index.ts`

- [ ] **Step 1: Add a failing helper test that documents manual removal semantics**

```ts
it("clears doneAt when a task is manually removed from the board", () => {
  expect(
    getNextDoneAt({
      isMembershipActive: true,
      now: new Date("2026-03-22T10:00:00.000Z"),
      previousDoneAt: new Date("2026-03-21T10:00:00.000Z"),
      previousStatus: taskStatus.done,
      nextStatus: taskStatus.todo,
    }),
  ).toBeUndefined();
});
```

- [ ] **Step 2: Create `addTaskToBoard` as a transaction**

Implementation requirements:
- load the owned task and any existing membership
- reject project mismatches
- compute `sortOrder` with `getNextBoardSortOrder`
- insert or update the same membership row
- set `removedAt = null`
- preserve the original `addedAt` when reactivating an existing row
- set `doneAt = now` only when `task.status === "done"`

- [ ] **Step 3: Create `removeTaskFromBoard` as a transaction**

Implementation requirements:
- load the owned task and active membership
- throw `"Board task not found"` if the membership is missing, removed, or expired
- update the task row to `status = "todo"`
- update the membership row with `removedAt = now` and `doneAt = null`

- [ ] **Step 4: Reuse existing task activity helpers when the remove flow changes task status**

If `removeTaskFromBoard` changes `task.status`, emit the same `task_updated` activity payload shape used by `updateTask` so board-driven status changes stay visible in history.

- [ ] **Step 5: Run `bun run typecheck`**

Expected: no type errors in add/remove board flows.

- [ ] **Step 6: Export the new mutations from `src/functions/project-board/index.ts`**

```ts
export * from "./add-task-to-board";
export * from "./get-board-tasks";
export * from "./remove-task-from-board";
export * from "./shared";
```

- [ ] **Step 7: Commit add/remove board mutations**

```bash
git add src/functions/project-board/add-task-to-board.ts src/functions/project-board/remove-task-from-board.ts
git commit -m "feat: add project board membership mutations"
```

### Task 6: Add move and reorder board mutation

**Files:**
- Create: `src/functions/project-board/move-board-task.ts`
- Modify: `src/functions/project-board/index.ts`

- [ ] **Step 1: Expand the helper test with within-column and cross-column reorder expectations**

```ts
it("moves a task to the requested index within a status group", () => {
  expect(reorderBoardTaskIds([10, 20, 30], { taskId: 30, targetIndex: 1 })).toEqual([10, 30, 20]);
});
```

- [ ] **Step 2: Implement `moveBoardTask`**

Implementation requirements:
- load the owned task and active membership
- treat expired memberships as not on board
- load active board memberships for the source and destination status groups
- if the destination status differs, update `task.status`
- reorder ids with `reorderBoardTaskIds`
- persist sequential `sortOrder` values starting at `0`
- synchronize `doneAt` through `getNextDoneAt`

- [ ] **Step 3: Reuse task activity recording when `moveBoardTask` changes `task.status`**

Expected behavior:
- no task activity for pure reorder inside the same column
- `task_updated` activity when the status changes across columns

- [ ] **Step 4: Run the helper test suite and `bun run typecheck`**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: PASS

Run: `bun run typecheck`
Expected: PASS

- [ ] **Step 5: Export the move mutation from `src/functions/project-board/index.ts`**

```ts
export * from "./add-task-to-board";
export * from "./get-board-tasks";
export * from "./move-board-task";
export * from "./remove-task-from-board";
export * from "./shared";
```

- [ ] **Step 6: Commit the move mutation**

```bash
git add src/functions/project-board/move-board-task.ts src/functions/project-board/board-helpers.test.ts src/functions/project-board/board-helpers.ts
git commit -m "feat: add project board move mutation"
```

### Task 7: Make `updateTask` board-aware

**Files:**
- Modify: `src/functions/task/update-task.ts`

- [ ] **Step 1: Write a failing helper assertion that documents expired memberships staying inactive**

```ts
it("does not reactivate expired board membership through plain task edits", () => {
  expect(
    isBoardMembershipActive({
      doneAt: new Date("2026-03-18T09:00:00.000Z"),
      now: new Date("2026-03-22T10:00:00.000Z"),
      removedAt: undefined,
      status: taskStatus.done,
    }),
  ).toBe(false);
});
```

- [ ] **Step 2: Update `src/functions/task/update-task.ts` to synchronize board metadata inside the existing transaction**

Implementation requirements:
- fetch any membership row for the task
- if the membership is active and the status changes, update `doneAt` with `getNextDoneAt`
- if `projectId` changes and a membership exists, mark it removed instead of migrating it
- do not reactivate memberships from plain task edits

- [ ] **Step 3: Keep the existing `task_updated` activity behavior intact**

Expected behavior:
- board metadata changes should not suppress or duplicate the existing task activity event
- no-op task updates should still return early

- [ ] **Step 4: Run `bun run typecheck` and `bun test src/functions/project-board/board-helpers.test.ts`**

Expected: PASS

- [ ] **Step 5: Commit the task integration**

```bash
git add src/functions/task/update-task.ts
git commit -m "feat: sync project board state from task updates"
```

### Task 8: Generate migration and verify the workspace

**Files:**
- Create: `drizzle/0002_*.sql`
- Modify: `drizzle/meta/_journal.json`
- Modify: `drizzle/meta/0002_snapshot.json`

- [ ] **Step 1: Run the migration generator**

Run: `bun run generate`
Expected: a new `drizzle/*.sql` migration plus updated `drizzle/meta` files for `project_board_task`.

- [ ] **Step 2: Run the targeted helper tests**

Run: `bun test src/functions/project-board/board-helpers.test.ts`
Expected: PASS

- [ ] **Step 3: Run the full TypeScript check**

Run: `bun run typecheck`
Expected: PASS

- [ ] **Step 4: Run lint**

Run: `bun run lint`
Expected: PASS, or record the exact lint blocker if unrelated workspace issues remain.

- [ ] **Step 5: Commit the generated migration and final verification state**

```bash
git add drizzle src/db/schema/project-board-task-schema.ts src/db/schema/index.ts src/functions/project-board src/functions/task/update-task.ts
git commit -m "feat: add project board backend"
```
