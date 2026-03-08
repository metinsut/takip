import { useState } from "react";
import { DeleteAction } from "@/components/dialogs/delete-action";
import { toast } from "@/components/ui/sonner";
import { StopPropagation } from "@/components/wrapper/stop-propagation";
import { deleteProject } from "@/functions/projects/delete-project";
import type { ProjectListItem } from "@/functions/projects/get-projects";
import { m } from "@/paraglide/messages";

type Props = {
  project: ProjectListItem;
};

export const Actions = (props: Props) => {
  const { project } = props;
  const [open, setOpen] = useState(false);

  const onOpenChange = (open: boolean) => setOpen(open);

  const onDelete = () => {
    deleteProject({ data: { id: project.id } });
    toast.success("Project deleted successfully");
  };

  return (
    <StopPropagation className="flex justify-end">
      <DeleteAction
        open={open}
        onOpenChange={onOpenChange}
        onDelete={onDelete}
        title={m.deleteProjectTitle()}
        description={m.deleteProjectDescription()}
      />
    </StopPropagation>
  );
};
