import { formatCurrency } from "@/utils/currency";
import { useCurrency } from "@/context/SettingsContext";

/** Renders a GBP-denominated value in the user's chosen display currency. */
export default function CurrencyDisplay({ value, compact = false, decimals = 0, className = "" }) {
  const currency = useCurrency();
  return <span className={className}>{formatCurrency(value, currency, { compact, decimals })}</span>;
}
