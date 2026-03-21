# Task Comments And Activity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add modular task comment and task activity persistence plus server functions, with immutable history for task and comment mutations.

**Architecture:** Keep current task state in normalized tables and append every meaningful mutation to an immutable `task_activity` table. Route all task-domain writes through transaction-safe helpers so comment and task history stay consistent.

**Tech Stack:** Bun, TypeScript, TanStack Start server functions, PostgreSQL, Drizzle ORM, Zod

---

### Task 1: Add failing tests for activity payload builders

**Files:**
- Create: `src/functions/task-activity/build-task-activity-payload.test.ts`
- Create: `src/functions/task-activity/build-task-activity-payload.ts`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `bun test src/functions/task-activity/build-task-activity-payload.test.ts` and verify it fails for missing implementation**
- [ ] **Step 3: Implement minimal payload builder and diff helpers**
- [ ] **Step 4: Run the same test and verify it passes**

### Task 2: Add new schemas and export surface

**Files:**
- Create: `src/db/schema/task-comment-schema.ts`
- Create: `src/db/schema/task-activity-schema.ts`
- Modify: `src/db/schema/index.ts`

- [ ] **Step 1: Add comment and activity schema definitions**
- [ ] **Step 2: Export schemas and related types**
- [ ] **Step 3: Keep schema-level optional values compatible with app-side `undefined` handling**

### Task 3: Add shared task access and activity recording helpers

**Files:**
- Create: `src/functions/task/task-access.ts`
- Create: `src/functions/task-activity/record-task-activity.ts`

- [ ] **Step 1: Centralize authenticated owner task lookup**
- [ ] **Step 2: Add transaction-friendly activity insert helper**

### Task 4: Extend task mutations with activity recording

**Files:**
- Modify: `src/functions/task/create-task.ts`
- Modify: `src/functions/task/update-task.ts`
- Modify: `src/functions/task/delete-task.ts`

- [ ] **Step 1: Create task inside a transaction and emit `task_created`**
- [ ] **Step 2: Update task inside a transaction and emit `task_updated` only when tracked fields change**
- [ ] **Step 3: Delete task inside a transaction and emit `task_deleted` before removing the row**
- [ ] **Step 4: Replace manual `null` fallbacks with `undefined` in touched functions**

### Task 5: Add modular comment and activity server functions

**Files:**
- Create: `src/functions/task-comment/create-task-comment.ts`
- Create: `src/functions/task-comment/update-task-comment.ts`
- Create: `src/functions/task-comment/delete-task-comment.ts`
- Create: `src/functions/task-comment/get-task-comments.ts`
- Create: `src/functions/task-comment/index.ts`
- Create: `src/functions/task-activity/get-task-activities.ts`
- Create: `src/functions/task-activity/index.ts`
- Modify: `src/functions/task/index.ts`

- [ ] **Step 1: Add comment create/read/update/delete server functions**
- [ ] **Step 2: Emit `comment_created`, `comment_updated`, and `comment_deleted` activity rows**
- [ ] **Step 3: Add activity read function and query key helpers if needed**

### Task 6: Generate migration and verify the workspace

**Files:**
- Create: `drizzle/<generated>.sql`
- Modify: `drizzle/meta/_journal.json`
- Modify: `drizzle/meta/<generated snapshot>.json`

- [ ] **Step 1: Run `bun run generate` to create the migration**
- [ ] **Step 2: Run `bun test src/functions/task-activity/build-task-activity-payload.test.ts`**
- [ ] **Step 3: Run `bun run typecheck`**
- [ ] **Step 4: Run `bun run lint` or report the exact blocker**
