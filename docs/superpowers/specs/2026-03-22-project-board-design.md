# Project Board Design

**Goal:** Add a per-project board that selects active work from the existing task backlog without introducing dates, sprint boundaries, or UI in this step.

## Scope

- Add backend persistence for project board membership.
- Add server functions to read board tasks and manage board membership.
- Reuse the existing task status values as the board columns: `todo`, `in_progress`, `done`.
- Keep the existing task list as the full backlog view for all project tasks.

## Constraints

- One board exists implicitly for each project; no separate `project_board` table is needed yet.
- No board UI or menu work in this step.
- Board columns must stay aligned with `task.status`; no duplicate column field should be introduced.
- A task can be either on the board or only in the backlog, but the task itself always remains in the task list.
- When a task is manually removed from the board, its `task.status` must become `todo`.
- When a `done` task ages out of the board automatically, its `task.status` must remain `done`.

## Data Model

### `project_board_task`

Stores whether a task is part of the active board for its project.

- `id`: integer identity primary key
- `projectId`: FK to `project.id`, cascade on project delete
- `taskId`: FK to `task.id`, cascade on task delete
- `sortOrder`: integer, required
- `addedAt`: timestamptz, required, default now
- `doneAt`: timestamptz, optional
- `removedAt`: timestamptz, optional
- `createdAt`: timestamptz, required, default now
- `updatedAt`: timestamptz, required, default now, auto-updated

Indexes and constraints:

- unique `(task_id)` so one task has at most one board membership row
- index `(project_id, removed_at, sort_order)`
- index `(project_id, done_at)`

Notes:

- `sortOrder` is interpreted within the active board tasks of the same project and the same current `task.status` group.
- `doneAt` marks when the task most recently entered the `done` column while still on the board.
- `removedAt` marks a manual board exit at the persistence level.
- `projectId` in the membership row must always match the current `task.projectId`.

## Board Semantics

- The task list remains the backlog and always returns every task in the active project.
- The board is a filtered view over the same task pool.
- A task is considered on the board only when its membership is active.
- A membership is active when `removedAt` is `null` and the row is not an expired done membership.
- Board column membership is derived directly from `task.status`.

### Done Retention Window

- When a board task moves to `done`, set `doneAt = now`.
- A done task remains visible on the board for exactly 72 hours from `doneAt`.
- After 72 hours, the membership is treated as expired and inactive for board purposes.
- In this first version, this is handled in the board read query rather than by a cron job or background worker.
- The underlying task remains unchanged with `task.status = done`.
- An expired membership is not automatically reactivated by later task edits; reactivation must happen only through `addTaskToBoard`.

## Lifecycle Rules

### Add Task To Board

- Validate authenticated ownership of the task's project.
- If no membership row exists, create one with `removedAt = null`.
- If a membership row exists but is inactive or expired, reactivate the same row by clearing `removedAt`.
- Append the task to the end of its current status group by assigning the next `sortOrder`.
- Set `doneAt = now` only if the task status is already `done`; otherwise clear `doneAt`.

### Manual Remove From Board

- Validate authenticated ownership of the task's project.
- Set the membership row `removedAt = now`.
- Set the task `status = todo`.
- Clear `doneAt`.

### Update Task Status While On Board

- If the task is on the board and its status changes to `done`, set `doneAt = now`.
- If the task is on the board and its status changes from `done` to `todo` or `in_progress`, clear `doneAt`.
- If the task is not on the board, or its previous membership is already expired, board membership is not created or reactivated automatically.

### Automatic Board Exit For Aged Done Tasks

- No scheduled job is required for the first version.
- `getBoardTasks` excludes memberships where the task status is `done` and `doneAt` is older than 72 hours.
- Excluded tasks continue to appear in the backlog because they remain normal task rows.

### Project Change Edge Case

- If a future flow changes `task.projectId`, any active board membership must be closed rather than silently moved across projects.
- The task can then be manually added to the destination project's board.

## Server Functions

### `getBoardTasks`

Returns the active project's board tasks.

Requirements:

- Use the same active project context as the existing task functions.
- Join `project_board_task` to `task`.
- Return only active memberships with `removedAt = null`.
- Exclude tasks whose status is `done` and whose `doneAt` is older than 72 hours.
- Order rows by status group, then `sortOrder`, then stable fallback by task id if needed.

### `addTaskToBoard`

Adds an existing task from the backlog to the project's board.

Requirements:

- Validate ownership and project consistency.
- Create or reactivate membership in a transaction.
- Compute the next `sortOrder` within the task's current status group.
- Synchronize `doneAt` from the current task status.

### `removeTaskFromBoard`

Removes a task from the project's board.

Requirements:

- Validate ownership.
- Update the task and membership row in one transaction.
- Force the task status back to `todo`.
- Clear `doneAt` and mark membership removed.

### `moveBoardTask`

Supports future drag-and-drop movement inside or across board columns.

Requirements:

- Validate ownership.
- Accept the destination status and target index.
- Update `task.status` when crossing columns.
- Recalculate `sortOrder` values for the affected status groups.
- Synchronize `doneAt` based on the final status.

## Integration With Existing Task Mutations

- `updateTask` must become board-aware.
- If a task being updated is currently on the board, status transitions must also update `project_board_task.doneAt`.
- If a task has an expired membership, `updateTask` must treat it as backlog-only and must not reactivate it implicitly.
- If a task update ever changes `projectId`, any active board membership must be closed in the same transaction.
- `deleteTask` should rely on cascade delete to remove board membership rows.

## Error Handling

- All board mutations must fail with the same ownership and authorization rules already used by task mutations.
- Adding a task to the wrong project board must fail explicitly.
- Removing or moving a task that is not on the board, including expired memberships, should fail with a clear not-found style error rather than silently succeeding.

## Testing

- Add unit tests for board visibility rules around the 72-hour done retention window.
- Add unit tests for `doneAt` synchronization on status transitions.
- Add tests for reactivating a previously removed board membership.
- Add tests for manual board removal forcing the task status back to `todo`.
- Add tests for sort order recalculation when moving within a column and across columns.
