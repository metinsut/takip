import { CheckCircleIcon } from "@phosphor-icons/react";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import type { ProjectListItem } from "@/functions/project/get-projects";
import { dateFormat } from "@/helpers/date-format";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { Actions } from "./actions";

type Props = {
  activeProject?: ProjectListItem;
};

export function useColumns(props: Props) {
  const { activeProject } = props;

  const columns: ColumnDef<ProjectListItem>[] = [
    {
      header: m.projectName(),
      accessorKey: "name",
      cell: ({ row }) => {
        const isActive = row.original.id === activeProject?.id;
        return (
          <div className={cn("flex items-center gap-2", isActive && "font-bold")}>
            {row.original.name}
            {isActive && <CheckCircleIcon className="text-green-600" weight="bold" />}
          </div>
        );
      },
    },
    {
      header: m.projectDescription(),
      accessorKey: "description",
    },
    {
      header: m.projectCreatedBy(),
      accessorFn: (row) => row.user.name,
    },
    {
      header: m.projectCreatedAt(),
      accessorKey: "createdAt",
      accessorFn: (row) => dayjs(row.createdAt).format(dateFormat.DATE_TIME_FORMAT),
    },
    {
      header: m.projectUpdatedAt(),
      accessorKey: "updatedAt",
      accessorFn: (row) => dayjs(row.updatedAt).format(dateFormat.DATE_TIME_FORMAT),
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => <Actions project={row.original} />,
    },
  ];

  return { columns };
}
