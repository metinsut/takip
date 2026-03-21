import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteAction } from "@/components/dialogs/delete-action";
import { StopPropagation } from "@/components/wrapper/stop-propagation";
import { useDeleteTask } from "@/functions/task/delete-task";
import type { TaskListItem } from "@/functions/task/get-tasks";
import { getTasksQueryKey } from "@/functions/task/shared";
import { TaskBoardToggleButton } from "@/routes/app/task/-components/task-board-toggle-button";

type Props = {
  isOnBoard: boolean;
  task: TaskListItem;
};

export function Actions(props: Props) {
  const { isOnBoard, task } = props;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTask, isPending } = useDeleteTask();

  const onDelete = async () => {
    await deleteTask(task.id);
    queryClient.invalidateQueries({ queryKey: [getTasksQueryKey] });
    setOpen(false);
  };

  return (
    <StopPropagation className="flex items-center justify-end gap-2">
      <TaskBoardToggleButton isOnBoard={isOnBoard} taskId={task.id} variant="ghost" size="sm" />
      <DeleteAction
        open={open}
        onOpenChange={(open) => setOpen(open)}
        onDelete={onDelete}
        title="Görev Silinecek!"
        description="Görevi silmek istediğinize emin misiniz?"
        isLoading={isPending}
      />
    </StopPropagation>
  );
}
