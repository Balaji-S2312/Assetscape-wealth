/** Labelled form control with inline validation messaging. */
export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  hint,
  placeholder,
  options,
  required = false,
  rows = 4,
  min,
  max,
  step,
  icon: Icon,
  className = "",
}) {
  const id = `field-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const base =
    "w-full rounded-xl border bg-card px-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50";
  const stateClass = error ? "border-negative" : "border-border";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span className="ml-0.5 text-negative">*</span> : null}
      </label>

      <div className="relative">
        {Icon ? (
          <Icon
            className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
        ) : null}

        {type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            rows={rows}
            value={value ?? ""}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${base} ${stateClass} py-2.5 ${Icon ? "pl-9" : ""}`}
          />
        ) : type === "select" ? (
          <select
            id={id}
            name={name}
            value={value ?? ""}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${base} ${stateClass} h-11 ${Icon ? "pl-9" : ""}`}
          >
            <option value="">Select…</option>
            {(options ?? []).map((option) => {
              const val = typeof option === "string" ? option : option.value;
              const text = typeof option === "string" ? option : option.label;
              return (
                <option key={val} value={val}>
                  {text}
                </option>
              );
            })}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value ?? ""}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => onChange(name, e.target.value)}
            className={`${base} ${stateClass} h-11 ${Icon ? "pl-9" : ""}`}
          />
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-negative">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
