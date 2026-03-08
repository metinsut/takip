import { FolderSimplePlusIcon } from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DeleteAction } from "@/components/dialogs/delete-action";
import { Button } from "@/components/ui/button";
import { StopPropagation } from "@/components/wrapper/stop-propagation";
import { useDeleteProject } from "@/functions/projects/delete-project";
import { setProjectServerFn } from "@/functions/projects/get-project";
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

  const handleSetAsActiveProject = () => {
    setProjectServerFn({ data: project.id });
  };

  return (
    <StopPropagation className="flex justify-end gap-2">
      <DeleteAction
        open={open}
        onOpenChange={(open) => setOpen(open)}
        onDelete={onDelete}
        title={m.deleteProjectTitle()}
        description={m.deleteProjectDescription()}
        isLoading={isPending}
      />
      <Button variant="ghost" size="icon-sm" onClick={handleSetAsActiveProject}>
        <FolderSimplePlusIcon data-icon="inline-start" />
      </Button>
    </StopPropagation>
  );
};
