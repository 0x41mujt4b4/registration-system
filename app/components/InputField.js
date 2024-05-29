export default function InputField({ id, label, type, value, defaultValue, onChange, required}) {
    return (
        <div className="relative max-w-xs ">
            <label htmlFor={id} className="block uppercase tracking-wide text-gray-200 text-xs font-bold mb-2">{label}</label>
            {id === 'fees-amount' && (
                <span className="h-6 mb-2 text-gray-400 absolute left-3 inset-y-0 my-auto">
                    &#x24;
                </span>
            )}
            {id === 'name' && (
                <span className="h-6 mb-2 text-gray-400 absolute left-3 inset-y-0 my-auto">
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
                className="w-full pl-12 pr-3 py-2 text-gray-500 outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
            />
        </div>
    )
}