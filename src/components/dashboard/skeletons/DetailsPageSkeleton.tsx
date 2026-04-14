import Skeleton from "@/components/dashboard/Skeleton";

export default function DetailsPageSkeleton({
  withTopHeader = true,
  container = "max-w-6xl mx-auto py-10 px-4",
  titleWidthClassName = "w-56",
  subtitleWidthClassName = "w-40",
  /** Heights in px */
  sectionsPx = [256, 192],
}: {
  /** Mimics pages that have a separate header row (back button + title) */
  withTopHeader?: boolean;
  container?: string;
  titleWidthClassName?: string;
  subtitleWidthClassName?: string;
  /** Heights in px for main sections */
  sectionsPx?: number[];
}) {
  return (
    <div className="space-y-6">
      {withTopHeader && (
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className={`h-7 ${titleWidthClassName} rounded-md`} />
            <Skeleton className={`h-4 ${subtitleWidthClassName} rounded-md`} />
          </div>
        </div>
      )}

      <div className={container}>
        <div className="bg-white/95 backdrop-blur-xl border border-(--brand) rounded-2xl shadow-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-56 rounded-md" />
                <Skeleton className="h-4 w-72 rounded-md" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sectionsPx.map((px, i) => (
              <Skeleton
                key={i}
                className="w-full rounded-lg"
                style={{ height: px }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

