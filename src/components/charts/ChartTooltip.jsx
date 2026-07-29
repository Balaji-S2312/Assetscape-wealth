import { formatCurrency } from "@/utils/currency";
import { useCurrency } from "@/context/SettingsContext";

/** Shared tooltip that respects the selected display currency. */
export default function ChartTooltip({ active, payload, label, currencyKeys = [], suffix = "" }) {
  const currency = useCurrency();
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-strong rounded-xl px-3 py-2 text-xs">
      {label ? <p className="mb-1 font-semibold">{label}</p> : null}
      <ul className="space-y-0.5">
        {payload.map((entry) => {
          const isCurrency = currencyKeys.length === 0 || currencyKeys.includes(entry.dataKey);
          return (
            <li key={entry.dataKey ?? entry.name} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color ?? entry.payload?.fill }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="ml-auto font-semibold">
                {isCurrency
                  ? formatCurrency(Math.abs(entry.value), currency)
                  : `${entry.value}${suffix}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
