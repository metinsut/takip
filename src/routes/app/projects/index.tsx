import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute("/app/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { projects } = useLoaderData({ from: "/app/projects" });
  return (
    <div>
      <div className="grid gap-4">
        {projects.map((project) => (
          <div key={project.id}>{project.name}</div>
        ))}
      </div>
    </div>
  );
}
