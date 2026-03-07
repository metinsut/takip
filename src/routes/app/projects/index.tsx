import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "./-list";

export const Route = createFileRoute("/app/projects/")({
  component: ProjectsIndex,
});

export function ProjectsIndex() {
  return <ProjectsList />;
}
