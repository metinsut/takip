import { describe, expect, it } from "bun:test";
import { getTaskBoardActionCopy } from "./task-board-action";

describe("getTaskBoardActionCopy", () => {
  it("returns add copy for backlog tasks in English", () => {
    expect(getTaskBoardActionCopy(false, { locale: "en" })).toEqual({
      action: "add",
      errorMessage: "Task could not be moved to the board.",
      label: "Move to board",
      successMessage: "Task moved to the board.",
    });
  });

  it("returns remove copy for board tasks in Turkish", () => {
    expect(getTaskBoardActionCopy(true, { locale: "tr" })).toEqual({
      action: "remove",
      errorMessage: "Görev panodan çıkarılamadı.",
      label: "Panodan çıkar",
      successMessage: "Görev panodan çıkarıldı.",
    });
  });
});
