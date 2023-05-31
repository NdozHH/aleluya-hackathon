import { type Row } from "@tanstack/react-table";
import {
  Eye,
  FileText,
  MoreHorizontal,
  Send,
  StickyNote,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <StickyNote className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Agregar nota
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Ver cálculos
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileText className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Ver colilla de pago
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Send className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Enviar colilla de pago
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Trash2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Eliminar nómina
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
