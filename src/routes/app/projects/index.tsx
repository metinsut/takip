import { createFileRoute } from "@tanstack/react-router";
import { ProjectsList } from "./-list";

export const Route = createFileRoute("/app/projects/")({
  component: ProjectsIndex,
});

function ProjectsIndex() {
  return <ProjectsList />;
}
