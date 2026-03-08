import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { useGetProjects } from "@/functions/projects";
import type { ProjectListItem } from "@/functions/projects/get-projects";
import { columns } from "./columns";
import { Toolbar } from "./toolbar";

export function ProjectsList() {
  const navigate = useNavigate();
  const { data: projects } = useSuspenseQuery(useGetProjects());
  const { activeProjectId } = useLoaderData({ from: "__root__" });

  const table = useReactTable({
    data: projects,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: ProjectListItem) => {
    navigate({ to: "/app/projects/$projectId", params: { projectId: row.id } });
  };

  const activeProject = projects.find((project) => project.id === activeProjectId);

  return (
    <div className="flex flex-col gap-3">
      <Toolbar activeProject={activeProject} />
      <DataTable table={table} onRowClick={handleRowClick} />
    </div>
  );
}
