import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { Project } from "@/db/schema/project-schema";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";

export const columns: ColumnDef<Project>[] = [
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
    accessorKey: "createdBy",
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
];
