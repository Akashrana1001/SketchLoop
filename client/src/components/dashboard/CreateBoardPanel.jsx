import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function CreateBoardPanel({ isSubmitting, onCreate }) {
    const [title, setTitle] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextTitle = title.trim();
        await onCreate({
            title: nextTitle || undefined,
        });
        setTitle('');
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Create new board</h2>
            <p className="mt-1 text-sm text-slate-600">Start a fresh whiteboard for planning sessions and team collaboration.</p>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <label className="block text-sm font-medium text-slate-700" htmlFor="boardTitle">
                    Board title
                </label>
                <input
                    id="boardTitle"
                    name="boardTitle"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Sprint planning board"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
                <Button type="submit" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Board'}
                </Button>
            </form>
        </section>
    );
}
