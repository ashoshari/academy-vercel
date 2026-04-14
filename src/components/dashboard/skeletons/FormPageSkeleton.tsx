import Skeleton from "@/components/dashboard/Skeleton";

export default function FormPageSkeleton({
  inputs = 4,
  includeWideInput = true,
  includeToggleRow = true,
  includeSubmit = true,
}: {
  inputs?: number;
  includeWideInput?: boolean;
  includeToggleRow?: boolean;
  includeSubmit?: boolean;
}) {
  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4">
      <div className="bg-white/95 backdrop-blur-xl border border-(--brand) shadow-lg rounded-2xl p-8">
        <div className="flex items-center mb-6 gap-x-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-7 w-56 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: inputs }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
          {includeWideInput && (
            <Skeleton className="h-12 w-full rounded-lg md:col-span-2" />
          )}
          {includeToggleRow && (
            <Skeleton className="h-20 w-full rounded-lg md:col-span-2" />
          )}
          {includeSubmit && (
            <Skeleton className="h-12 w-40 rounded-lg md:col-span-2 ml-auto" />
          )}
        </div>
      </div>
    </div>
  );
}

