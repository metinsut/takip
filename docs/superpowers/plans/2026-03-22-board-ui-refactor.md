# Project Board UI Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the board route into smaller UI modules with clearer names, remove slot-style action props from task cards, and make the full task surface draggable while preserving normal clicks on interactive child elements.

**Architecture:** Keep route-level data loading in `src/routes/app/board/index.tsx`, move DnD state and mutation orchestration into a focused board hook, and split the rendered UI into small board-specific components under `src/routes/app/board/-board/`. Preserve the existing pure board reorder helpers, but rename them around DnD concerns and extend test coverage for any extracted route logic.

**Tech Stack:** Bun, TypeScript, React, TanStack Query, TanStack Router, dnd-kit

---

## File Structure

- Modify: `src/routes/app/board/index.tsx`
  Responsibility: keep the route file as a thin data-loading container.
- Create: `src/routes/app/board/-board/project-board.tsx`
  Responsibility: render the full board shell from loaded tasks.
- Create: `src/routes/app/board/-board/use-project-board-dnd.ts`
  Responsibility: own local board state, sensors, drag lifecycle, optimistic updates, and cache invalidation.
- Create: `src/routes/app/board/-board/board-header.tsx`
  Responsibility: render the board page heading, description, count badge, and backlog link.
- Create: `src/routes/app/board/-board/board-columns.tsx`
  Responsibility: render the responsive grid of status columns.
- Create: `src/routes/app/board/-board/board-drag-overlay.tsx`
  Responsibility: render the active task preview while dragging.
- Modify: `src/routes/app/board/-board/board-column.tsx`
  Responsibility: render one droppable column using the renamed sortable card wrapper.
- Modify: `src/routes/app/board/-board/board-task-card.tsx`
  Responsibility: keep the task card purely presentational with no injected action node.
- Create: `src/routes/app/board/-board/sortable-board-task-card.tsx`
  Responsibility: apply sortable listeners to the full task surface instead of a handle button.
- Replace: `src/routes/app/board/-board/board-view-helpers.ts` with `src/routes/app/board/-board/board-dnd-helpers.ts`
  Responsibility: hold board drag ids, column grouping, drop target lookup, local reorder, and route-extracted pure helpers.
- Replace: `src/routes/app/board/-board/board-view-helpers.test.ts` with `src/routes/app/board/-board/board-dnd-helpers.test.ts`
  Responsibility: cover the renamed helpers plus extracted route logic.

### Task 1: Lock down pure board DnD logic with failing tests

**Files:**
- Replace: `src/routes/app/board/-board/board-view-helpers.test.ts`
- Replace: `src/routes/app/board/-board/board-view-helpers.ts`

- [ ] **Step 1: Add failing expectations for route-extracted helpers**

Cover:
- drag id normalization from string and number inputs
- board layout change detection for order and status changes
- existing drop target and local reorder behavior

- [ ] **Step 2: Run the focused helper test and verify it fails**

Run: `bun test src/routes/app/board/-board/board-dnd-helpers.test.ts`
Expected: FAIL because the renamed helper module and new exports do not exist yet.

- [ ] **Step 3: Implement the minimal renamed helper module**

Add:
- board id helpers
- column builder
- drop target resolution
- local board reorder
- drag id normalization
- board layout change detection

- [ ] **Step 4: Re-run the focused helper test and verify it passes**

Run: `bun test src/routes/app/board/-board/board-dnd-helpers.test.ts`
Expected: PASS

### Task 2: Split the board route into focused UI modules

**Files:**
- Modify: `src/routes/app/board/index.tsx`
- Create: `src/routes/app/board/-board/project-board.tsx`
- Create: `src/routes/app/board/-board/use-project-board-dnd.ts`
- Create: `src/routes/app/board/-board/board-header.tsx`
- Create: `src/routes/app/board/-board/board-columns.tsx`
- Create: `src/routes/app/board/-board/board-drag-overlay.tsx`

- [ ] **Step 1: Make the route file a thin loader and hand off rendering to `ProjectBoard`**
- [ ] **Step 2: Move DnD state, sensors, and mutation orchestration into `useProjectBoardDnd`**
- [ ] **Step 3: Move static board layout sections into header, columns, and overlay components**
- [ ] **Step 4: Keep names explicit and avoid prop patterns that inject whole React nodes into child layout slots**

### Task 3: Move drag initiation to the task surface

**Files:**
- Modify: `src/routes/app/board/-board/board-task-card.tsx`
- Create: `src/routes/app/board/-board/sortable-board-task-card.tsx`
- Modify: `src/routes/app/board/-board/board-column.tsx`

- [ ] **Step 1: Remove the drag handle button and `action` prop from the task card**
- [ ] **Step 2: Apply sortable listeners and attributes on the outer draggable card wrapper**
- [ ] **Step 3: Keep clickable child elements intact by relying on the existing pointer distance activation threshold**
- [ ] **Step 4: Preserve current drag styling and overlay behavior**

### Task 4: Verify the refactor

**Files:**
- No additional source changes required unless verification fails.

- [ ] **Step 1: Run focused board helper tests**

Run: `bun test src/routes/app/board/-board/board-dnd-helpers.test.ts`
Expected: PASS

- [ ] **Step 2: Run a fresh typecheck**

Run: `bun run typecheck`
Expected: PASS
