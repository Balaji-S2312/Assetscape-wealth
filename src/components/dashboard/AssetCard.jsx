import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from "lucide-react";
import Badge, { statusTone } from "@/components/common/Badge";
import CurrencyDisplay from "@/components/common/CurrencyDisplay";
import Sparkline from "@/components/charts/Sparkline";
import { assetGrowth, assetProfit } from "@/utils/calculations";
import { assetIcon, GOLD_CATEGORIES } from "@/utils/categoryIcons";
import { formatDate, formatPercent } from "@/utils/format";

export default function AssetCard({ asset, onEdit, onDelete }) {
  const Icon = assetIcon(asset.category);
  const growth = assetGrowth(asset);
  const positive = growth >= 0;
  const premium = GOLD_CATEGORIES.includes(asset.category);

  return (
    <article data-grid-card className="glass press flex flex-col rounded-2xl p-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
              premium ? "bg-gold/15 text-gold" : "bg-primary/12 text-primary"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{asset.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {asset.category} · {formatDate(asset.purchaseDate)}
            </p>
          </div>
        </div>
        <Badge tone={statusTone(asset.status)}>{asset.status}</Badge>
      </div>

      {asset.image ? (
        <img
          src={asset.image}
          alt={asset.name}
          className="mt-4 h-28 w-full rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <div className="mt-4 h-14">
          <Sparkline
            data={asset.history ?? []}
            color={positive ? "var(--positive)" : "var(--negative)"}
            height={56}
          />
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="min-w-0">
          <dt className="text-xs text-muted-foreground">Current value</dt>
          <dd className="truncate font-semibold">
            <CurrencyDisplay value={asset.currentValue} />
          </dd>
        </div>
        <div className="min-w-0 text-right">
          <dt className="text-xs text-muted-foreground">Profit / loss</dt>
          <dd
            className={`flex items-center justify-end gap-1 truncate font-semibold ${
              positive ? "text-positive" : "text-negative"
            }`}
          >
            {positive ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <CurrencyDisplay value={Math.abs(assetProfit(asset))} />
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-4">
        <span className={`text-sm font-bold ${positive ? "text-positive" : "text-negative"}`}>
          {formatPercent(growth)}
        </span>
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard/assets/$assetId"
            params={{ assetId: asset.id }}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-secondary"
          >
            Details
          </Link>
          <button
            type="button"
            onClick={() => onEdit?.(asset)}
            aria-label={`Edit ${asset.name}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(asset)}
            aria-label={`Delete ${asset.name}`}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-negative/12 hover:text-negative"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
