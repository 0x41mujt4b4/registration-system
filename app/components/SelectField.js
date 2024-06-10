import * as Select from "@radix-ui/react-select";
import React from "react";

export default function SelectField({ id, label, options, placeholder, value, onChange, className }) {

  return (
      <Select.Root value={value} onValueChange={onChange}>
        <div className={`w-96 max-w-xs ${className}`}>
        <label htmlFor={id} className="block uppercase tracking-wide text-black text-sm font-bold mb-2">{label}</label>
          <Select.Trigger className="w-full inline-flex items-center justify-between p-3 text-black bg-white border rounded-lg shadow-sm outline-none focus:ring-offset-1 focus:ring-sky-600 focus:ring-1">
            <Select.Value placeholder={placeholder} />
            <Select.Icon className="text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content
              position="popper"
              avoidCollisions={false}
              className="w-[var(--radix-select-trigger-width)] mt-3 overflow-y-auto bg-white border rounded-lg shadow-sm h-40"
            >
              <Select.Viewport className="">
              {options.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </div>
      </Select.Root>
  );
};

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    // If you want to make this component more customizable you can use classnames and tailwind-merge library.
    return (
      <Select.Item
        className="flex items-center justify-between px-3 cursor-default py-2 duration-150 text-slate-900 data-[state=checked]:text-sky-600 data-[state=checked]:bg-sky-50 data-[highlighted]:text-sky-600 data-[highlighted]:bg-sky-50 data-[highlighted]:hover:text-sky-600 data-[highlighted]:hover:bg-sky-50 outline-none"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>
          <div className="pr-4 line-clamp-1">{children}</div>
        </Select.ItemText>
        <div className="w-6">
          <Select.ItemIndicator>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-sky-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>{" "}
          </Select.ItemIndicator>
        </div>
      </Select.Item>
    );
  }
);

SelectItem.displayName = "SelectItem";