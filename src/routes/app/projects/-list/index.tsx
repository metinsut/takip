import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import type { ProjectListItem } from "@/functions/project/get-projects";
import { useColumns } from "./columns";
import { Toolbar } from "./toolbar";

export function ProjectsList() {
  const navigate = useNavigate();
  const { activeProjectId, projects } = useLoaderData({ from: "__root__" });

  const activeProject = projects.find((project) => project.id === activeProjectId);
  const { columns } = useColumns({ activeProject });

  const table = useReactTable({
    data: projects,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: ProjectListItem) => {
    navigate({ to: "/app/projects/$projectId", params: { projectId: row.id.toString() } });
  };

  return (
    <div className="flex flex-col gap-3">
      <Toolbar activeProject={activeProject} />
      <DataTable table={table} onRowClick={handleRowClick} />
    </div>
  );
}
