export default function CheckboxField({
    id,
    name,
    label,
    checked,
    onChange,
    onBlur,
    hint,
    disabled = false,
}) {
    const hintId = hint ? `${id}-hint` : undefined;

    return (
        <div>
            <label className="inline-flex cursor-pointer items-start gap-3 text-sm text-white/85" htmlFor={id}>
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    aria-describedby={hintId}
                    className="mt-0.5 h-4 w-4 rounded border-white/50 bg-white/10 text-accent focus:ring-2 focus:ring-accent/40"
                />
                <span>{label}</span>
            </label>

            {hint ? (
                <p id={hintId} className="mt-1.5 text-xs text-white/70">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}
