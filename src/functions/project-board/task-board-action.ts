export type TaskBoardActionCopy = {
  action: "add" | "remove";
  errorMessage: string;
  label: string;
  successMessage: string;
};

export function getTaskBoardActionCopy(isOnBoard: boolean): TaskBoardActionCopy {
  if (isOnBoard) {
    return {
      action: "remove",
      errorMessage: "Görev board'dan çıkarılamadı.",
      label: "Board'dan çıkar",
      successMessage: "Görev board'dan çıkarıldı.",
    };
  }

  return {
    action: "add",
    errorMessage: "Görev board'a taşınamadı.",
    label: "Board'a taşı",
    successMessage: "Görev board'a taşındı.",
  };
}
