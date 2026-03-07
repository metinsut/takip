import { useLoaderData } from "@tanstack/react-router";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { columns } from "./columns";
import { Toolbar } from "./toolbar";

export function ProjectsList() {
  const { projects } = useLoaderData({ from: "/app/projects" });

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
