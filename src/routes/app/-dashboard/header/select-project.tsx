import { FoldersIcon } from "@phosphor-icons/react";
import { useLoaderData } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { setProjectServerFn } from "@/functions/projects/get-project";
import { m } from "@/paraglide/messages";

export function SelectProject() {
  const { activeProjectId, projects } = useLoaderData({ from: "__root__" });

  function handleValueChange(projectId: string | null) {
    if (!projectId) {
      setProjectServerFn({ data: "" });
      return;
    }
    setProjectServerFn({ data: projectId });
  }

  const projectName = projects?.find((project) => project.id === activeProjectId)?.name;

  return (
    <Combobox value={activeProjectId} onValueChange={handleValueChange} items={projects}>
      <ComboboxTrigger
        className="max-w-3xs"
        render={
          <Button variant="outline">
            <span className="truncate">{projectName}</span>
            <FoldersIcon />
          </Button>
        }
      />
      <ComboboxContent>
        <ComboboxInput showTrigger={false} placeholder={m.searchProject()} showClear={false} />
        <ComboboxList>
          <ComboboxEmpty>{m.noProjectsFound()}</ComboboxEmpty>
          <ComboboxCollection>
            {(project) => (
              <ComboboxItem key={project.id} value={project.id}>
                {project.name}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
