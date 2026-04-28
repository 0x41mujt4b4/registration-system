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
    <div className={`w-full ${className || ""}`}>
        <label htmlFor={id} className="block uppercase tracking-wide text-black text-sm font-bold mb-2">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full p-3 text-black bg-white border rounded-lg shadow-sm outline-none focus:ring-offset-1 focus:ring-sky-600 focus:ring-1"
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