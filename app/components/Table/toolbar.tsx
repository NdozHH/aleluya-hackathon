import { type Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import { DataTableViewOptions } from "./view-options";
import { useFetcher, useSearchParams } from "@remix-run/react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <fetcher.Form method="GET" action="/payroll">
          <Input
            placeholder="Buscar personas..."
            value={
              (table.getColumn("worker_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table
                .getColumn("worker_name")
                ?.setFilterValue(event.target.value);

              const params = new URLSearchParams();

              if (event.target.value) {
                params.append("search", event.target.value);
              } else {
                params.delete("search");
              }

              setSearchParams(params);
              fetcher.submit(searchParams);
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </fetcher.Form>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
