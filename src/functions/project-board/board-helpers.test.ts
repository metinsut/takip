import { describe, expect, it } from "bun:test";
import {
  addTaskToBoardSchema,
  moveBoardTaskSchema,
  removeTaskFromBoardSchema,
  taskStatus,
} from "@/db/schema";
import {
  getNextDoneAt,
  isBoardMembershipActive,
  isBoardTaskVisible,
  reorderBoardTaskIds,
} from "./board-helpers";

describe("board helpers", () => {
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

  it("sets doneAt when an on-board task moves into done", () => {
    expect(
      getNextDoneAt({
        isMembershipActive: true,
        nextStatus: taskStatus.done,
        now,
        previousDoneAt: undefined,
        previousStatus: taskStatus.in_progress,
      }),
    ).toEqual(now);
  });

  it("clears doneAt when an on-board task leaves done", () => {
    expect(
      getNextDoneAt({
        isMembershipActive: true,
        nextStatus: taskStatus.todo,
        now,
        previousDoneAt: new Date("2026-03-20T10:00:00.000Z"),
        previousStatus: taskStatus.done,
      }),
    ).toBeUndefined();
  });

  it("keeps expired memberships inactive during plain task edits", () => {
    expect(
      isBoardMembershipActive({
        doneAt: new Date("2026-03-18T09:00:00.000Z"),
        now,
        removedAt: undefined,
        status: taskStatus.done,
      }),
    ).toBe(false);
  });

  it("reorders task ids around the requested target index", () => {
    expect(reorderBoardTaskIds([11, 22, 33], { taskId: 22, targetIndex: 0 })).toEqual([22, 11, 33]);
  });

  it("moves a task to the requested index within a status group", () => {
    expect(reorderBoardTaskIds([10, 20, 30], { taskId: 30, targetIndex: 1 })).toEqual([10, 30, 20]);
  });

  it("validates board mutation payloads", () => {
    expect(addTaskToBoardSchema.parse({ taskId: 4 })).toEqual({ taskId: 4 });
    expect(removeTaskFromBoardSchema.parse({ taskId: 7 })).toEqual({ taskId: 7 });
    expect(
      moveBoardTaskSchema.parse({
        status: taskStatus.in_progress,
        targetIndex: 2,
        taskId: 9,
      }),
    ).toEqual({
      status: taskStatus.in_progress,
      targetIndex: 2,
      taskId: 9,
    });
  });
});
