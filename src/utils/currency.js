/** Currency formatting helpers. Values are stored in the user's selected currency. */
export const CURRENCIES = {
  GBP: { symbol: "£", locale: "en-GB", label: "British Pound" },
  USD: { symbol: "$", locale: "en-US", label: "US Dollar" },
  EUR: { symbol: "€", locale: "de-DE", label: "Euro" },
  INR: { symbol: "₹", locale: "en-IN", label: "Indian Rupee" },
};

export function convert(amount, currency = "INR") {
  return Number(amount) || 0;
}

export function formatCurrency(amount, currency = "INR", options = {}) {
  const meta = CURRENCIES[currency] ?? CURRENCIES.INR;
  const { compact = false, decimals = 0 } = options;
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : decimals,
    minimumFractionDigits: 0,
  }).format(convert(amount, currency));
}

export function currencySymbol(currency = "INR") {
  return (CURRENCIES[currency] ?? CURRENCIES.INR).symbol;
}
