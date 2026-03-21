import { describe, expect, it } from "bun:test";
import { getTaskBoardActionCopy } from "./task-board-action";

describe("getTaskBoardActionCopy", () => {
  it("returns add copy for backlog tasks", () => {
    expect(getTaskBoardActionCopy(false)).toEqual({
      action: "add",
      errorMessage: "Görev board'a taşınamadı.",
      label: "Board'a taşı",
      successMessage: "Görev board'a taşındı.",
    });
  });

  it("returns remove copy for board tasks", () => {
    expect(getTaskBoardActionCopy(true)).toEqual({
      action: "remove",
      errorMessage: "Görev board'dan çıkarılamadı.",
      label: "Board'dan çıkar",
      successMessage: "Görev board'dan çıkarıldı.",
    });
  });
});
