/** Card wrapper for charts and grouped dashboard content. */
export default function ChartCard({ title, subtitle, action, children, className = "" }) {
  return (
    <section
      data-chart-card
      className={`glass flex flex-col rounded-2xl p-5 ${className}`}
      aria-label={title}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{title}</h3>
          {subtitle ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="mt-4 min-w-0 flex-1">{children}</div>
    </section>
  );
}
