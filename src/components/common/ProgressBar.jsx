export default function ProgressBar({ value = 0, tone = "primary", label, showValue = true }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const toneClass =
    tone === "positive"
      ? "bg-positive"
      : tone === "negative"
        ? "bg-negative"
        : tone === "gold"
          ? "bg-gold"
          : "brand-gradient";

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
          {label ? <span className="min-w-0 truncate text-muted-foreground">{label}</span> : <span />}
          {showValue ? <span className="shrink-0 font-semibold">{clamped.toFixed(0)}%</span> : null}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Progress"}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${toneClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
