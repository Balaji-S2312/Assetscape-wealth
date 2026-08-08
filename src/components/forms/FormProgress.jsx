import ProgressBar from "@/components/common/ProgressBar";

/** Shows how complete a multi-section form is. */
export default function FormProgress({ completed, total, label = "Form completion" }) {
  const percent = total ? (completed / total) * 100 : 0;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">
          {completed} of {total} required fields
        </p>
      </div>
      <ProgressBar value={percent} showValue={false} label="" />
    </div>
  );
}
