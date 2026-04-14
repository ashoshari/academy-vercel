import Skeleton from "@/components/dashboard/Skeleton";

export default function StatsCardsSkeleton({
  count = 3,
  gridClassName = "grid grid-cols-1 md:grid-cols-3 gap-4",
}: {
  count?: number;
  gridClassName?: string;
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" className="h-28 rounded-xl" />
      ))}
    </div>
  );
}

