import { FolderSimplePlusIcon } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { DeleteAction } from "@/components/dialogs/delete-action";
import { Button } from "@/components/ui/button";
import { StopPropagation } from "@/components/wrapper/stop-propagation";
import { useDeleteProject } from "@/functions/project/delete-project";
import { setProjectServerFn } from "@/functions/project/get-project";
import type { ProjectListItem } from "@/functions/project/get-projects";
import { m } from "@/paraglide/messages";

type Props = {
  project: ProjectListItem;
};

export const Actions = (props: Props) => {
  const { project } = props;
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutateAsync: deleteProject, isPending } = useDeleteProject();

  const onDelete = async () => {
    await deleteProject(project.id);
    await router.invalidate();
    setOpen(false);
  };

  const handleSetAsActiveProject = async () => {
    await setProjectServerFn({ data: project.id });
    await router.invalidate();
  };

  return (
    <StopPropagation className="flex justify-end items-center gap-2">
      <DeleteAction
        open={open}
        onOpenChange={(open) => setOpen(open)}
        onDelete={onDelete}
        title={m.deleteProjectTitle()}
        description={m.deleteProjectDescription()}
        isLoading={isPending}
      />
      <Button variant="ghost" size="icon-sm" onClick={handleSetAsActiveProject}>
        <FolderSimplePlusIcon />
      </Button>
    </StopPropagation>
  );
};
