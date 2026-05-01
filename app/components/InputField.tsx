import React from "react";

const controlClass =
  "box-border h-10 w-full rounded-lg border border-slate-200 bg-white pr-3 text-sm font-sans text-slate-900 shadow-sm outline-none transition-colors " +
  "focus:border-sky-600 focus:ring-1 focus:ring-sky-600";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (val: string) => void;
  required?: boolean;
}

export default function InputField({ id, label, type = "text", value, defaultValue, onChange, required }: InputFieldProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
        {label}
      </label>
      <div className="relative">
        {id === "fees-amount" ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
            aria-hidden
          >
            $
          </span>
        ) : null}
        {id === "name" ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
            aria-hidden
          >
            &#x1F464;
          </span>
        ) : null}
        <input
          required={required}
          type={type}
          id={id}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          defaultValue={defaultValue}
          className={`${controlClass} pl-9`}
        />
      </div>
    </div>
  );
}
