import { FoldersIcon } from "@phosphor-icons/react";
import { useLoaderData, useRouter } from "@tanstack/react-router";
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
import { toast } from "@/components/ui/sonner";
import { setProjectServerFn } from "@/functions/project/get-project";
import { m } from "@/paraglide/messages";

export function SelectProject() {
  const { activeProjectId, projects } = useLoaderData({ from: "__root__" });
  const router = useRouter();

  async function handleValueChange(projectId: number | null) {
    if (!projectId) {
      toast.error(m.selectProjectError());
      return;
    }
    await setProjectServerFn({ data: projectId });
    await router.invalidate();
  }

  const projectName = projects?.find((project) => project.id === activeProjectId)?.name;

  return (
    <Combobox value={activeProjectId} onValueChange={handleValueChange} items={projects}>
      <ComboboxTrigger
        render={
          <Button variant="outline">
            <FoldersIcon />
            <span>{projectName}</span>
          </Button>
        }
      />
      <ComboboxContent className="min-w-56">
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
