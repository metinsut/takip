# Task Comments And Activity Design

**Goal:** Add comment support and immutable task activity/history without changing the current UI.

## Scope

- Add modular database schemas for task comments and task activity.
- Add modular server functions for comment CRUD and activity reads.
- Record task and comment mutations as append-only activity events.
- Keep current-state reads efficient and history reads explicit.

## Constraints

- No UX/UI changes in this step.
- Prefer `undefined` over manual `null` returns in application code.
- Follow existing ownership model: the authenticated task owner can access and mutate the task domain.

## Data Model

### `task_comment`

Stores the current comment state.

- `id`: integer identity primary key
- `taskId`: FK to `task.id`, cascade on task delete
- `authorId`: FK to `user.id`
- `body`: comment content
- `createdAt`: timestamptz default now
- `updatedAt`: timestamptz default now, auto-updated
- `editedAt`: timestamptz, optional
- `deletedAt`: timestamptz, optional soft-delete marker
- `deletedBy`: FK to `user.id`, optional

Indexes:

- `(task_id, deleted_at, created_at)`
- `(author_id, created_at)`

### `task_activity`

Immutable audit trail for task and comment events.

- `id`: integer identity primary key
- `taskId`: scalar integer, required
- `projectId`: scalar integer, required
- `commentId`: scalar integer, optional
- `type`: enum
- `actorType`: enum
- `actorId`: scalar text, optional
- `payload`: structured `jsonb`
- `occurredAt`: timestamptz default now

Indexes:

- `(task_id, occurred_at desc)`
- `(project_id, occurred_at desc)`
- `(comment_id, occurred_at desc)`

`task_activity` intentionally avoids foreign keys so audit rows survive cascades and hard deletes.

## Event Taxonomy

- `task_created`
- `task_updated`
- `task_deleted`
- `comment_created`
- `comment_updated`
- `comment_deleted`

Payload rules:

- `task_created` and `task_deleted` keep a task snapshot.
- `task_updated` keeps field-level changes with `before` and `after`.
- `comment_created` keeps `body`.
- `comment_updated` keeps `beforeBody` and `afterBody`.
- `comment_deleted` keeps the final visible `body`.

## Access Model

- Reuse the current ownership rule: only the authenticated task owner can read or mutate task comments/activity.
- Centralize this in a task access helper to avoid repeating auth and ownership checks.

## Write Path

- Wrap task and comment mutations in transactions.
- Create activity rows in the same transaction as the state mutation.
- Skip no-op activity writes when no tracked field changed.

## Read Path

- `getTaskComments`: return non-deleted comments, newest or oldest deterministically.
- `getTaskActivities`: return immutable activity rows ordered by `occurredAt desc`.

## Testing

- Unit-test payload/diff builders first.
- Verify no-op updates do not emit meaningless task update payloads.
- Verify comment update/delete payload builders keep old/new content correctly.
