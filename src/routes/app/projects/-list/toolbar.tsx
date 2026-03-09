import { PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { ProjectListItem } from "@/functions/project/get-projects";
import { m } from "@/paraglide/messages";

type Props = {
  activeProject: ProjectListItem | undefined;
};

export function Toolbar(props: Props) {
  const { activeProject } = props;
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{m.activeProject()}:</span>
        <span className="text-sm font-semibold">{activeProject?.name}</span>
      </div>
      <Button
        nativeButton={false}
        render={
          <Link to="/app/projects/$projectId" params={{ projectId: "add" }}>
            <PlusIcon />
            {m.addProject()}
          </Link>
        }
      />
    </div>
  );
}
