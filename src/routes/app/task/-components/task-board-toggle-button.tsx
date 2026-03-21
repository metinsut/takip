import { useQueryClient } from "@tanstack/react-query";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  getBoardTasksQueryKey,
  getTaskBoardActionCopy,
  useAddTaskToBoard,
  useRemoveTaskFromBoard,
} from "@/functions/project-board";
import { getTaskQueryKey, getTasksQueryKey } from "@/functions/task";
import { getTaskActivitiesQueryKey } from "@/functions/task-activity";

type Props = Omit<ButtonProps, "children" | "onClick"> & {
  isOnBoard: boolean;
  taskId: number;
};

export function TaskBoardToggleButton(props: Props) {
  const { disabled, isOnBoard, taskId, ...buttonProps } = props;
  const queryClient = useQueryClient();
  const addTaskMutation = useAddTaskToBoard();
  const removeTaskMutation = useRemoveTaskFromBoard();
  const copy = getTaskBoardActionCopy(isOnBoard);
  const isPending = addTaskMutation.isPending || removeTaskMutation.isPending;

  const handleToggleBoard = async () => {
    if (isPending) {
      return;
    }

    const mutation = isOnBoard ? removeTaskMutation : addTaskMutation;
    await mutation.mutateAsync(taskId);

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [getBoardTasksQueryKey] }),
      queryClient.invalidateQueries({ queryKey: [getTaskActivitiesQueryKey] }),
      queryClient.invalidateQueries({ queryKey: [getTaskQueryKey] }),
      queryClient.invalidateQueries({ queryKey: [getTasksQueryKey] }),
    ]);
  };

  return (
    <Button {...buttonProps} disabled={disabled || isPending} onClick={handleToggleBoard}>
      {copy.label}
    </Button>
  );
}
