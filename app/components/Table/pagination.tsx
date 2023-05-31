import { type Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useFetcher, useSearchParams } from "@remix-run/react";
import { useGetParams } from "./utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const getParams = useGetParams();
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <fetcher.Form method="GET" action="/payroll">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              name="pageSize"
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));

                const params = new URLSearchParams();

                params.append("per_page", value);

                setSearchParams(params);
                fetcher.submit(searchParams);
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fetcher.Form>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button> */}
          {table.getState().pagination.pageIndex - 1 > 0 ? (
            <Link
              prefetch="intent"
              to={getParams({
                page: String(table.getState().pagination.pageIndex - 1),
                per_page: table.getState().pagination.pageSize,
              })}
              onClick={() => table.previousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : null}
          {table.getState().pagination.pageIndex + 1 < table.getPageCount() ? (
            <Link
              prefetch="intent"
              to={getParams({
                page: String(table.getState().pagination.pageIndex + 1),
                per_page: table.getState().pagination.pageSize,
              })}
              onClick={() => table.nextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}
          {/* <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  );
}
