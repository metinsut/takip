import type { BoardTaskListItem } from "@/functions/project-board";
import { BoardTaskColumn } from "./board-column";
import type { BoardColumnData } from "./board-dnd-helpers";

export function BoardColumns(props: {
  columns: readonly BoardColumnData<BoardTaskListItem>[];
  disabled: boolean;
}) {
  const { columns, disabled } = props;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {columns.map((column) => (
        <BoardTaskColumn
          key={column.status}
          status={column.status}
          tasks={column.tasks}
          disabled={disabled}
        />
      ))}
    </div>
  );
}
