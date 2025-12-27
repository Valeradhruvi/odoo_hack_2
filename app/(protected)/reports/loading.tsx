
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-black min-h-screen">
            <div className="flex flex-col gap-1 px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-80" />
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px] flex-1">
                    <Skeleton className="h-full rounded-xl" />
                    <Skeleton className="h-full rounded-xl" />
                </div>
            </div>
        </div>
    );
}
