import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteAction } from "@/components/dialogs/delete-action";
import { StopPropagation } from "@/components/wrapper/stop-propagation";
import { useDeleteProject } from "@/functions/projects/delete-project";
import type { ProjectListItem } from "@/functions/projects/get-projects";
import { getProjectsQueryKey } from "@/functions/projects/shared";
import { m } from "@/paraglide/messages";

type Props = {
  project: ProjectListItem;
};

export const Actions = (props: Props) => {
  const { project } = props;
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProject, isPending } = useDeleteProject();

  const onDelete = async () => {
    await deleteProject(project.id);
    queryClient.invalidateQueries({ queryKey: [getProjectsQueryKey] });
  };

  return (
    <StopPropagation className="flex justify-end">
      <DeleteAction
        open={open}
        onOpenChange={(open) => setOpen(open)}
        onDelete={onDelete}
        title={m.deleteProjectTitle()}
        description={m.deleteProjectDescription()}
        isLoading={isPending}
      />
    </StopPropagation>
  );
};
