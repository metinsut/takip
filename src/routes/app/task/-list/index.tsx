import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { useGetTasks } from "@/functions/task";
import type { TaskListItem } from "@/functions/task/get-tasks";
import { columns } from "./columns";
import { Toolbar } from "./toolbar";

export function TasksList() {
  const { activeProjectId } = useLoaderData({ from: "__root__" });
  const navigate = useNavigate();
  const { data: tasks } = useSuspenseQuery(useGetTasks(activeProjectId));

  const table = useReactTable({
    data: tasks,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: TaskListItem) => {
    navigate({
      to: "/app/task/$taskId",
      params: { taskId: String(row.id) },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Toolbar />
      <DataTable table={table} onRowClick={handleRowClick} />
    </div>
  );
}
