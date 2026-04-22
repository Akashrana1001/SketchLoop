import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BoardCard from '@/components/dashboard/BoardCard';
import CreateBoardPanel from '@/components/dashboard/CreateBoardPanel';
import JoinBoardPanel from '@/components/dashboard/JoinBoardPanel';
import FormAlert from '@/components/forms/FormAlert';
import useAuthedApi from '@/hooks/useAuthedApi';
import useAuth from '@/hooks/useAuth';

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { authedRequest } = useAuthedApi();
    const [boards, setBoards] = useState([]);
    const [isLoadingBoards, setIsLoadingBoards] = useState(true);
    const [isMutatingBoard, setIsMutatingBoard] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadBoards = async () => {
            setIsLoadingBoards(true);
            setErrorMessage('');

            try {
                const response = await authedRequest('/boards');

                if (isMounted) {
                    setBoards(Array.isArray(response.data) ? response.data : []);
                }
            } catch (error) {
                if (isMounted) {
                    const fallbackMessage = 'Unable to load boards right now.';
                    setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
                }
            } finally {
                if (isMounted) {
                    setIsLoadingBoards(false);
                }
            }
        };

        loadBoards();

        return () => {
            isMounted = false;
        };
    }, [authedRequest]);

    const totalStrokes = useMemo(
        () => boards.reduce((total, board) => total + (Number(board.strokes) || 0), 0),
        [boards],
    );

    const totalParticipants = useMemo(
        () => boards.reduce((total, board) => total + (Number(board.participants) || 0), 0),
        [boards],
    );

    const handleCreateBoard = async ({ title }) => {
        setErrorMessage('');
        setIsMutatingBoard(true);

        try {
            const response = await authedRequest('/boards', {
                method: 'POST',
                body: JSON.stringify({ title }),
            });

            if (response?.data?.roomId) {
                setBoards((previousBoards) => [response.data, ...previousBoards]);
                navigate(`/board/${response.data.roomId}`);
            }
        } catch (error) {
            const fallbackMessage = 'Unable to create board right now.';
            setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
        } finally {
            setIsMutatingBoard(false);
        }
    };

    const handleJoinBoard = async (roomId) => {
        setErrorMessage('');
        setIsMutatingBoard(true);

        try {
            await authedRequest(`/boards/${encodeURIComponent(roomId)}`);
            navigate(`/board/${roomId}`);
        } catch (error) {
            const fallbackMessage = 'Unable to join this board.';
            setErrorMessage(error instanceof Error ? error.message : fallbackMessage);
        } finally {
            setIsMutatingBoard(false);
        }
    };

    const handleOpenBoard = (roomId) => {
        navigate(`/board/${roomId}`);
    };

    return (
        <div className="space-y-6">
            <section className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-soft sm:p-9">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Dashboard</p>
                <h1 className="mt-2 text-3xl font-semibold text-ink">
                    Welcome back{user?.name ? `, ${user.name}` : ''}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-ink/70 sm:text-base">
                    Manage whiteboards, start new collaboration rooms, and jump into live drawing sessions with your team.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">Boards</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(boards.length)}</p>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">Participants</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(totalParticipants)}</p>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">Total strokes</p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900">{formatNumber(totalStrokes)}</p>
                    </article>
                </div>
            </section>

            <FormAlert message={errorMessage} />

            <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
                    <CreateBoardPanel isSubmitting={isMutatingBoard} onCreate={handleCreateBoard} />
                    <JoinBoardPanel isSubmitting={isMutatingBoard} onJoin={handleJoinBoard} />
                </aside>

                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-ink">Your whiteboards</h2>
                        {isLoadingBoards ? <span className="text-sm text-ink/60">Refreshing...</span> : null}
                    </div>

                    {isLoadingBoards ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3].map((placeholder) => (
                                <div
                                    key={placeholder}
                                    className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white/80"
                                />
                            ))}
                        </div>
                    ) : boards.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {boards.map((board) => (
                                <BoardCard key={board.roomId} board={board} onOpenBoard={handleOpenBoard} />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center">
                            <p className="text-lg font-semibold text-slate-900">No boards yet</p>
                            <p className="mt-2 text-sm text-slate-600">
                                Create your first board from the sidebar to start collaborating in real time.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
