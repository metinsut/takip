import { FoldersIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import Cookies from "js-cookie";
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
  ComboboxValue,
} from "@/components/ui/combobox";
import { useGetProjects } from "@/functions/projects";
import { PROJECT_COOKIE } from "@/functions/projects/get-project";
import type { ProjectListItem } from "@/functions/projects/get-projects";
import { m } from "@/paraglide/messages";

export function SelectProject() {
  const { data: projects } = useQuery(useGetProjects());
  const { project } = useLoaderData({ from: "__root__" });

  function handleValueChange(project: ProjectListItem) {
    Cookies.set(PROJECT_COOKIE, JSON.stringify(project));
  }

  return (
    <Combobox
      value={project}
      onValueChange={handleValueChange}
      items={projects}
      itemToStringLabel={(project) => project.name}
      isItemEqualToValue={(item, value) => item.id === value?.id}
    >
      <ComboboxTrigger
        render={
          <Button variant="outline">
            <ComboboxValue />
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
              <ComboboxItem key={project.id} value={project}>
                {project.name}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
