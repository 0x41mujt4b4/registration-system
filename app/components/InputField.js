export default function InputField({ id, label, type, value, defaultValue, onChange, required}) {
    return (
        <div className="relative max-w-xs w-full">
            <label htmlFor={id} className="block uppercase tracking-wide text-black text-sm font-bold mb-2">{label}</label>
            {id === 'fees-amount' && (
                <span className="h-8 mb-1 text-slate-600 absolute left-3 inset-y-0 my-auto">
                    &#x24;
                </span>
            )}
            {id === 'name' && (
                <span className="h-8 mb-1 text-slate-600 absolute left-3 inset-y-0 my-auto">
                    &#x1F464;
                </span>
            )}
            <input
                required={required}
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                defaultValue = {defaultValue}
                className="w-full pl-10 pr-3 py-3 text-black outline-none border focus:border-sky-600 shadow-sm rounded-lg font-serif text-md"
            />
        </div>
    )
}