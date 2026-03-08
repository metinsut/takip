import type { Table as TableType } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { Spinner } from "../ui/spinner";

type Props<T> = {
  table: TableType<T>;
  noResult?: React.ReactNode;
  onRowClick?: (row: T) => void;
  getRowClassName?: (row: T) => string | undefined;
  isPending?: boolean;
  isFetching?: boolean;
  className?: string;
};

export function DataTable<T>(props: Props<T>) {
  const { table, noResult, onRowClick, getRowClassName, isPending, isFetching, className } = props;

  return (
    <div className={cn("rounded-md border relative", { "min-h-96": isPending }, className)}>
      <div
        className={cn("absolute h-0.5 w-full overflow-hidden rounded-full z-20", {
          hidden: !isFetching,
        })}
      >
        <div className="absolute h-full w-1/2 rounded-full bg-primary/70 animate-loading-line z-20" />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                className={cn(
                  row.getIsSelected() && "bg-green-500",
                  onRowClick && "cursor-pointer hover:bg-muted/50 transition-colors",
                  getRowClassName?.(row.original),
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getAllColumns().length} className="h-60">
                {noResult ? (
                  <div className="grid place-content-center w-full h-full py-20 absolute inset-0">
                    {noResult}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center">{m.noResult()}</p>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isPending && (
        <div
          className={cn(
            "flex flex-col gap-4 place-items-center place-content-center absolute bg-background inset-0 z-20",
          )}
        >
          <Spinner className="size-6" />
          <p className="text-sm text-muted-foreground">{m.loading()}</p>
        </div>
      )}
    </div>
  );
}
