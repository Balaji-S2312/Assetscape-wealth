import { AlertTriangle } from "lucide-react";
import Modal from "@/components/common/Modal";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-negative/15">
          <AlertTriangle className="h-5 w-5 text-negative" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="press h-10 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary"
        >
          Cancel
        </button>
        <button
          type="button"
          data-autofocus
          disabled={loading}
          onClick={onConfirm}
          className="press h-10 rounded-xl bg-negative px-4 text-sm font-semibold text-negative-foreground disabled:opacity-60"
        >
          {loading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
