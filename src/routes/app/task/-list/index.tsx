import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table";
import { useGetTasks } from "@/functions/task";
import type { TaskListItem } from "@/functions/task/get-tasks";
import { columns } from "./columns";
import { Toolbar } from "./toolbar";

export function TasksList() {
  const navigate = useNavigate();
  const { data: tasks } = useSuspenseQuery(useGetTasks());

  const table = useReactTable({
    data: tasks,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRowClick = (row: TaskListItem) => {
    navigate({
      to: "/app/task/$taskId",
      params: { taskId: row.id },
      search: { projectId: undefined },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <Toolbar />
      <DataTable table={table} onRowClick={handleRowClick} />
    </div>
  );
}
