import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange, from, to, total }) {
  if (total === 0) return null;
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{from}</span>–
        <span className="font-semibold text-foreground">{to}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-secondary disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
          .map((n, index, arr) => (
            <span key={n} className="flex items-center">
              {index > 0 && n - arr[index - 1] > 1 ? (
                <span className="px-1 text-xs text-muted-foreground">…</span>
              ) : null}
              <button
                type="button"
                onClick={() => onChange(n)}
                aria-label={`Page ${n}`}
                aria-current={n === page ? "page" : undefined}
                className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition-colors ${
                  n === page
                    ? "brand-gradient text-primary-foreground"
                    : "border border-border hover:bg-secondary"
                }`}
              >
                {n}
              </button>
            </span>
          ))}
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
          className="grid h-9 w-9 place-items-center rounded-lg border border-border transition-colors hover:bg-secondary disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
