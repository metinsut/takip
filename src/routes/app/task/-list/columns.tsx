import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { TaskListItem } from "@/functions/task/get-tasks";
import { dateFormat } from "@/helpers/date-format";
import { Actions } from "./actions";

export const columns: ColumnDef<TaskListItem>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Başlık",
    accessorKey: "title",
  },
  {
    header: "Açıklama",
    accessorKey: "description",
  },
  {
    header: "Proje",
    accessorKey: "projectName",
  },
  {
    header: "Durum",
    accessorKey: "status",
  },
  {
    header: "Öncelik",
    accessorKey: "priority",
  },
  {
    header: "Oluşturan",
    accessorFn: (row) => row.user.name,
  },
  {
    header: "Son güncelleme",
    accessorKey: "updatedAt",
    accessorFn: (row) => dayjs(row.updatedAt).format(dateFormat.DATETIME_FORMAT),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => <Actions task={row.original} />,
  },
];
