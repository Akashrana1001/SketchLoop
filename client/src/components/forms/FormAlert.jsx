export default function FormAlert({ message, variant = 'error' }) {
    if (!message) {
        return null;
    }

    const classes =
        variant === 'success'
            ? 'border-emerald-300/40 bg-emerald-500/15 text-emerald-100'
            : 'border-rose-300/40 bg-rose-500/15 text-rose-100';

    return (
        <div role={variant === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${classes}`}>
            {message}
        </div>
    );
}
