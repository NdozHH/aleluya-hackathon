import useDataTable from "@/components/Table";
import { getSession } from "@/session";
import { type LoaderArgs, redirect } from "@remix-run/node";
import { type PaginationState, type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/Table/column-header";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { formatCurrency, getRequestParams } from "@/components/Table/utils";
import { DataTableRowActions } from "@/components/Table/row-actions";
import React from "react";

type PayrollType = {
  id: string;
  locked: boolean;
  worker_id: string;
  worker_name: string;
  worker_id_number: string;
  worker_document_type: string;
  worker_picture: null;
  contract_id: string;
  contract_category: string;
  contract_initial_day: string;
  contract_end_day: null;
  social_benefits_category: null;
  salary_category: string;
  base_salary: number;
  early_payment: boolean;
  compensated_days: number;
  accumulated_holidays: number;
  holidays_average_salary: number;
  novelties_average_salary: number;
  salary: number;
  worked_time: number;
  worker_payment: number;
  company_cost: number;
  novelties_days: number;
  novelties_value: number;
  overtime_hours: number;
  overtime_value: number;
  salary_income: number;
  non_salary_income: number;
  deductions: number;
  comments: null;
  payslip_mail: boolean;
  bank_file: boolean;
  location: string;
  connectivity_aid_option: boolean;
  connectivity_aid_days: number;
  details: {
    overtime: {
      quantity: number;
      value: number;
    };
    surcharge: {
      quantity: number;
      value: number;
    };
    company_overtime: {
      quantity: number;
      value: number;
    };
    holidays: {
      quantity: number;
      value: number;
    };
    incapacities: {
      quantity: number;
      value: number;
    };
    licenses: {
      quantity: number;
      value: number;
    };
    additional_income: {
      quantity: null;
      value: number;
    };
    deductions: {
      quantity: null;
      value: number;
    };
    withholding_tax: {
      quantity: null;
      value: number;
    };
    loans: {
      quantity: null;
      value: number;
    };
  };
};

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const authToken = session.get("authToken");
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = searchParams.get("page") || 1;
  const per_page = searchParams.get("per_page") || 10;
  const search = searchParams.get("search") || "";

  const apiUrl = `${process.env.API_URL}/016ceb30-4bb7-455f-8dff-60f7fcc9895e/current_period?page=${page}&per_page=${per_page}&search=${search}`;
  const response = await fetch(apiUrl, {
    method: "GET",

    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  });
  const result = await response.json();

  const pagesCount = Math.ceil(
    result.filters?.total_records / Number(per_page)
  );

  if (pagesCount !== 0 && Number(page) > pagesCount) {
    return redirect(`${url.pathname}${getRequestParams(request, { page })}`);
  }

  if (!result?.data?.payrolls) {
    return {
      payrolls: [],
      pageCount: 0,
    };
  }

  return {
    payrolls: result.data.payrolls as PayrollType[],
    pageCount: pagesCount,
  };
}

export const columns: ColumnDef<PayrollType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "worker_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Persona" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("worker_name")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "base_salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salario base" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("base_salary"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "novelties_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor de novedades" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("novelties_value"))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "worker_payment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total pago persona" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formatCurrency(row.getValue("worker_payment"))}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export default function Payroll() {
  const loaderData = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "10", 10);
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>(() => ({
      pageIndex: currentPage,
      pageSize: perPage,
    }));
  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { Table } = useDataTable({
    data: loaderData.payrolls,
    columns,
    pagination,
    onUpdatePagination: setPagination,
    pageCount: loaderData.pageCount,
  });

  return (
    <div id="here" className="h-full p-12">
      <h3>Payroll route</h3>
      <Table />
    </div>
  );
}
