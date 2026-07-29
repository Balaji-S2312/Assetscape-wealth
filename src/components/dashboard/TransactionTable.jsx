import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import DataTable from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import { formatDate } from "@/utils/format";

const TYPE_TONE = {
  Income: "positive",
  Expense: "negative",
  "Asset purchase": "violet",
  "Asset sale": "gold",
  "Liability payment": "info",
  Investment: "neutral",
};

export default function TransactionTable({ transactions, onEdit, onDelete, compact = false }) {
  const columns = [
    {
      key: "title",
      header: "Transaction",
      render: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
              row.amount >= 0 ? "bg-positive/12 text-positive" : "bg-negative/12 text-negative"
            }`}
          >
            {row.amount >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownLeft className="h-4 w-4" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium">{row.title}</p>
            <p className="truncate text-xs text-muted-foreground">{row.account}</p>
          </div>
        </div>
      ),
    },
    { key: "date", header: "Date", render: (row) => formatDate(row.date) },
    {
      key: "type",
      header: "Type",
      render: (row) => <Badge tone={TYPE_TONE[row.type] ?? "neutral"}>{row.type}</Badge>,
    },
    { key: "category", header: "Category", render: (row) => row.category },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      render: (row) => (
        <span className={`font-semibold ${row.amount >= 0 ? "text-positive" : "text-negative"}`}>
          {row.amount >= 0 ? "+" : "−"}
          <CurrencyDisplay value={Math.abs(row.amount)} />
        </span>
      ),
    },
  ];

  if (!compact) {
    columns.push({
      key: "actions",
      header: "",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit?.(row)}
            aria-label={`Edit ${row.title}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(row)}
            aria-label={`Delete ${row.title}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-negative/12 hover:text-negative"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    });
  }

  return (
    <DataTable columns={columns} rows={transactions} caption="Transaction history" />
  );
}
