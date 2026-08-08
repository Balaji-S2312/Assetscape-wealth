const TONES = {
  neutral: "bg-secondary text-secondary-foreground",
  positive: "bg-positive/15 text-positive",
  negative: "bg-negative/15 text-negative",
  gold: "bg-gold/18 text-gold",
  info: "bg-info/15 text-info",
  violet: "bg-violet/15 text-violet",
  outline: "border border-border text-muted-foreground",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONES[tone] ?? TONES.neutral} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusTone(status) {
  switch (status) {
    case "Active":
      return "positive";
    case "Overdue":
      return "negative";
    case "Pending":
    case "Deferred":
      return "gold";
    case "Sold":
    case "Closed":
      return "info";
    default:
      return "neutral";
  }
}
