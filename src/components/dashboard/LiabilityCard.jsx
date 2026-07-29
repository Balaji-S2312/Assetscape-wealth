import { Pencil, Trash2 } from "lucide-react";
import Badge, { statusTone } from "@/components/common/Badge";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import ProgressBar from "@/components/common/ProgressBar";
import { liabilityIcon } from "@/utils/categoryIcons";
import { formatDate } from "@/utils/format";

export default function LiabilityCard({ liability, onEdit, onDelete, onView }) {
  const Icon = liabilityIcon(liability.category);
  const repaid =
    liability.originalAmount > 0
      ? ((liability.originalAmount - liability.outstanding) / liability.originalAmount) * 100
      : 0;

  return (
    <article data-grid-card className="glass press flex flex-col rounded-2xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-negative/12 text-negative">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{liability.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {liability.category} · {liability.interestRate}% APR
            </p>
          </div>
        </div>
        <Badge tone={statusTone(liability.status)}>{liability.status}</Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Outstanding</dt>
          <dd className="truncate font-semibold text-negative">
            <CurrencyDisplay value={liability.outstanding} />
          </dd>
        </div>
        <div className="min-w-0 text-right">
          <dt className="text-xs text-muted-foreground">Monthly</dt>
          <dd className="truncate font-semibold">
            <CurrencyDisplay value={liability.monthlyPayment} />
          </dd>
        </div>
      </dl>

      <div className="mt-4">
        <ProgressBar value={repaid} tone="positive" label="Repaid" />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
        <span className="truncate text-xs text-muted-foreground">
          Ends {formatDate(liability.dueDate)}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView?.(liability)}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onEdit?.(liability)}
            aria-label={`Edit ${liability.name}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(liability)}
            aria-label={`Delete ${liability.name}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-negative/12 hover:text-negative"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
