import { describe, expect, it } from "bun:test";
import { getSortableBoardTaskCursorClass } from "./sortable-board-task-card";

describe("getSortableBoardTaskCursorClass", () => {
  it("returns a grabbing cursor while the task is being dragged", () => {
    expect(getSortableBoardTaskCursorClass({ disabled: false, isDragging: true })).toContain(
      "cursor-grabbing",
    );
  });

  it("returns a grab cursor while the task is idle", () => {
    expect(getSortableBoardTaskCursorClass({ disabled: false, isDragging: false })).toContain(
      "cursor-grab",
    );
  });

  it("returns a grabbing cursor on pointer down before dragging starts", () => {
    expect(getSortableBoardTaskCursorClass({ disabled: false, isDragging: false })).toContain(
      "active:cursor-grabbing",
    );
  });

  it("returns the default cursor when dragging is disabled", () => {
    expect(getSortableBoardTaskCursorClass({ disabled: true, isDragging: false })).toContain(
      "cursor-default",
    );
  });
});
