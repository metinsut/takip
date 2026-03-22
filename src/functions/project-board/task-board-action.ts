import { m } from "@/paraglide/messages";

export type TaskBoardActionCopy = {
  action: "add" | "remove";
  errorMessage: string;
  label: string;
  successMessage: string;
};

type TaskBoardActionCopyOptions = {
  locale?: "ar" | "de" | "en" | "tr";
};

export function getTaskBoardActionCopy(
  isOnBoard: boolean,
  options?: TaskBoardActionCopyOptions,
): TaskBoardActionCopy {
  const messageOptions = options?.locale ? { locale: options.locale } : undefined;

  if (isOnBoard) {
    return {
      action: "remove",
      errorMessage: m.boardRemoveTaskError({}, messageOptions),
      label: m.boardRemoveTaskLabel({}, messageOptions),
      successMessage: m.boardRemoveTaskSuccess({}, messageOptions),
    };
  }

  return {
    action: "add",
    errorMessage: m.boardMoveTaskError({}, messageOptions),
    label: m.boardMoveTaskLabel({}, messageOptions),
    successMessage: m.boardMoveTaskSuccess({}, messageOptions),
  };
}
