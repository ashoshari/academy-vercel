import Skeleton from "@/components/dashboard/Skeleton";

export default function TableSkeleton({
  rows = 8,
  header = true,
  wrapperClassName = "",
}: {
  rows?: number;
  header?: boolean;
  wrapperClassName?: string;
}) {
  return (
    <div
      className={`w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden ${wrapperClassName}`}
    >
      <div className="p-4 space-y-3">
        {header && <Skeleton className="h-7 w-56 rounded-md" />}
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

