import Skeleton from "@/components/dashboard/Skeleton";

export default function PricingCardsSkeleton({
  count = 6,
  gridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6",
  cardClassName = "h-[420px] rounded-xl",
}: {
  count?: number;
  gridClassName?: string;
  cardClassName?: string;
}) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" className={cardClassName} />
      ))}
    </div>
  );
}

