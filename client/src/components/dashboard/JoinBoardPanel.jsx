import { useState } from 'react';
import Button from '@/components/ui/Button';

function parseBoardId(value) {
    const trimmed = value.trim();

    if (!trimmed) {
        return '';
    }

    if (trimmed.includes('/board/')) {
        const parts = trimmed.split('/board/');
        return parts[parts.length - 1].split('?')[0].split('#')[0].trim();
    }

    return trimmed;
}

export default function JoinBoardPanel({ isSubmitting, onJoin }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const roomId = parseBoardId(inputValue);

        if (!roomId) {
            return;
        }

        await onJoin(roomId);
        setInputValue('');
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Join board by link or ID</h2>
            <p className="mt-1 text-sm text-slate-600">Paste a board URL or enter a room ID to join instantly.</p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-700" htmlFor="boardJoinInput">
                    Board link or ID
                </label>
                <input
                    id="boardJoinInput"
                    name="boardJoinInput"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="https://app.example.com/board/room-123"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <Button type="submit" size="sm" variant="ghost" disabled={isSubmitting}>
                    {isSubmitting ? 'Joining...' : 'Join Board'}
                </Button>
            </form>
        </section>
    );
}
