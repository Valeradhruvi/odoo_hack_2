
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-black min-h-screen">
            <div className="flex flex-col gap-1 px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            <div className="flex-1 p-6">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                    <div className="flex justify-between mb-4">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-zinc-200 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className="bg-white dark:bg-black h-24 p-2">
                                <Skeleton className="h-4 w-4 mb-2" />
                                <Skeleton className="h-4 w-full rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
