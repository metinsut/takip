import { useSuspenseQuery } from "@tanstack/react-query";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { useGetProjects } from "@/functions/projects";
import { columns } from "./columns";
import { Toolbar } from "./toolbar";

export function ProjectsList() {
  const { data: projects } = useSuspenseQuery(useGetProjects());

  const table = useReactTable({
    data: projects,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid gap-4">
      <Toolbar />
      <DataTable table={table} />
    </div>
  );
}
