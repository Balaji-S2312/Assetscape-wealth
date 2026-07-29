/** Currency formatting helpers. Frontend-only conversion for display. */
export const CURRENCIES = {
  GBP: { symbol: "£", locale: "en-GB", rate: 1, label: "British Pound" },
  USD: { symbol: "$", locale: "en-US", rate: 1.27, label: "US Dollar" },
  EUR: { symbol: "€", locale: "de-DE", rate: 1.17, label: "Euro" },
  INR: { symbol: "₹", locale: "en-IN", rate: 106.4, label: "Indian Rupee" },
};

export function convert(amountInGbp, currency = "GBP") {
  const meta = CURRENCIES[currency] ?? CURRENCIES.GBP;
  return amountInGbp * meta.rate;
}

export function formatCurrency(amountInGbp, currency = "GBP", options = {}) {
  const meta = CURRENCIES[currency] ?? CURRENCIES.GBP;
  const { compact = false, decimals = 0 } = options;
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : decimals,
    minimumFractionDigits: 0,
  }).format(convert(amountInGbp, currency));
}

export function currencySymbol(currency = "GBP") {
  return (CURRENCIES[currency] ?? CURRENCIES.GBP).symbol;
}
