import { describe, expect, it } from "bun:test";
import { type TaskStatus, taskStatus } from "@/db/schema";
import {
  buildBoardColumns,
  getBoardColumnId,
  getBoardDropTarget,
  hasBoardLayoutChanged,
  moveBoardTaskLocally,
  normalizeBoardDragId,
} from "./board-dnd-helpers";

const boardTasks: Array<{
  id: number;
  status: TaskStatus;
  title: string;
}> = [
  {
    id: 11,
    status: taskStatus.todo,
    title: "Tasarım",
  },
  {
    id: 22,
    status: taskStatus.todo,
    title: "API",
  },
  {
    id: 33,
    status: taskStatus.in_progress,
    title: "UI",
  },
  {
    id: 44,
    status: taskStatus.done,
    title: "Deploy",
  },
];

describe("board dnd helpers", () => {
  it("normalizes drag ids from string and number values", () => {
    expect(normalizeBoardDragId("task:11")).toBe("task:11");
    expect(normalizeBoardDragId(11)).toBe("11");
    expect(normalizeBoardDragId(null)).toBeUndefined();
  });

  it("detects when board layout order changes", () => {
    expect(
      hasBoardLayoutChanged(boardTasks, [
        boardTasks[1],
        boardTasks[0],
        boardTasks[2],
        boardTasks[3],
      ]),
    ).toBe(true);
  });

  it("detects when board layout status changes", () => {
    expect(
      hasBoardLayoutChanged(boardTasks, [
        boardTasks[0],
        { ...boardTasks[1], status: taskStatus.in_progress },
        boardTasks[2],
        boardTasks[3],
      ]),
    ).toBe(true);
  });

  it("returns false when board layout stays the same", () => {
    expect(hasBoardLayoutChanged(boardTasks, [...boardTasks])).toBe(false);
  });

  it("builds three fixed columns in board order", () => {
    const columns = buildBoardColumns([...boardTasks]);

    expect(columns.map((column) => column.status)).toEqual([
      taskStatus.todo,
      taskStatus.in_progress,
      taskStatus.done,
    ]);
    expect(columns[0]?.tasks.map((task) => task.id)).toEqual([11, 22]);
    expect(columns[1]?.tasks.map((task) => task.id)).toEqual([33]);
    expect(columns[2]?.tasks.map((task) => task.id)).toEqual([44]);
  });

  it("resolves card drops from the hovered task id", () => {
    const columns = buildBoardColumns([...boardTasks]);

    expect(
      getBoardDropTarget(columns, {
        overId: "task:33",
      }),
    ).toEqual({
      status: taskStatus.in_progress,
      targetIndex: 0,
    });
  });

  it("resolves column drops to the end of that column", () => {
    const columns = buildBoardColumns([...boardTasks]);

    expect(
      getBoardDropTarget(columns, {
        overId: getBoardColumnId(taskStatus.done),
      }),
    ).toEqual({
      status: taskStatus.done,
      targetIndex: 1,
    });
  });

  it("moves a task across columns locally", () => {
    const nextTasks = moveBoardTaskLocally([...boardTasks], {
      status: taskStatus.in_progress,
      targetIndex: 1,
      taskId: 22,
    });

    const columns = buildBoardColumns(nextTasks);

    expect(columns[0]?.tasks.map((task) => task.id)).toEqual([11]);
    expect(columns[1]?.tasks.map((task) => task.id)).toEqual([33, 22]);
    expect(columns[1]?.tasks[1]?.status).toBe(taskStatus.in_progress);
  });

  it("reorders a task within the same column locally", () => {
    const nextTasks = moveBoardTaskLocally([...boardTasks], {
      status: taskStatus.todo,
      targetIndex: 0,
      taskId: 22,
    });

    expect(buildBoardColumns(nextTasks)[0]?.tasks.map((task) => task.id)).toEqual([22, 11]);
  });
});
