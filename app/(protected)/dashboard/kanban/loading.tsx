
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-black min-h-screen">
            <div className="flex flex-col gap-1 px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="flex-1 p-6 flex gap-6 overflow-x-auto">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col w-[350px] min-w-[350px] gap-4">
                        <Skeleton className="h-14 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                        <Skeleton className="h-32 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
