import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading data", full = false }) {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 ${full ? "min-h-[60vh]" : "py-16"}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{label}…</p>
    </div>
  );
}
