import { getPasswordStrength } from '@/lib/validators/authValidators';

const bars = [0, 1, 2, 3];

const levelClasses = {
    weak: 'bg-rose-400',
    fair: 'bg-amber-400',
    good: 'bg-sky-400',
    strong: 'bg-emerald-400',
};

export default function PasswordStrengthIndicator({ password }) {
    const strength = getPasswordStrength(password);

    return (
        <div className="space-y-2" aria-live="polite">
            <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Password strength</span>
                <span className="font-semibold text-white">{strength.label}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {bars.map((barIndex) => (
                    <span
                        key={barIndex}
                        className={[
                            'h-1.5 rounded-full bg-white/20 transition',
                            barIndex < strength.score ? levelClasses[strength.level] : '',
                        ].join(' ')}
                    />
                ))}
            </div>
        </div>
    );
}
