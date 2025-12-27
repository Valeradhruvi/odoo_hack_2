
'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center gap-4 bg-white dark:bg-black p-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Something went wrong!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md text-center">
                {error.message || "An unexpected error occurred while loading this page."}
            </p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
