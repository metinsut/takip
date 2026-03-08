import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { ProjectListItem } from "@/functions/projects/get-projects";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";
import { Actions } from "./actions";

export const columns: ColumnDef<ProjectListItem>[] = [
  {
    header: m.projectName(),
    accessorKey: "name",
  },
  {
    header: m.projectDescription(),
    accessorKey: "description",
  },
  {
    header: m.projectCreatedBy(),
    accessorFn: (row) => row.user.name || row.user.email || row.createdBy,
  },
  {
    header: m.projectCreatedAt(),
    accessorKey: "createdAt",
    accessorFn: (row) => dayjs(row.createdAt).format(dateFormat.DATETIME_FORMAT),
  },
  {
    header: m.projectUpdatedAt(),
    accessorKey: "updatedAt",
    accessorFn: (row) => dayjs(row.updatedAt).format(dateFormat.DATETIME_FORMAT),
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => <Actions project={row.original} />,
  },
];
