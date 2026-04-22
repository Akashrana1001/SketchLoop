export default function FormField({
    id,
    name,
    type = 'text',
    label,
    value,
    onChange,
    onBlur,
    error,
    placeholder,
    autoComplete,
    required = false,
    hint,
    disabled = false,
}) {
    const hintId = hint ? `${id}-hint` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-100">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy}
                className={[
                    'w-full rounded-xl border bg-white/90 px-4 py-2.5 text-sm text-ink shadow-sm outline-none transition',
                    'placeholder:text-slate-500 focus:ring-2 focus:ring-accent/30',
                    error
                        ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-300/40'
                        : 'border-white/50 focus:border-accent',
                    disabled ? 'cursor-not-allowed opacity-70' : '',
                ].join(' ')}
            />
            {hint ? (
                <p id={hintId} className="mt-1.5 text-xs text-white/70">
                    {hint}
                </p>
            ) : null}
            {error ? (
                <p id={errorId} role="alert" className="mt-1.5 text-xs font-medium text-rose-300">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
