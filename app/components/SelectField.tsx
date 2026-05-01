const controlClass =
  "box-border h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-sans text-slate-900 shadow-sm outline-none transition-colors " +
  "focus:border-sky-600 focus:ring-1 focus:ring-sky-600";

interface SelectFieldProps {
  id: string;
  label: string;
  options: string[];
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export default function SelectField({ id, label, options, placeholder, value, onChange, className }: SelectFieldProps) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      <label htmlFor={id} className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={controlClass}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
