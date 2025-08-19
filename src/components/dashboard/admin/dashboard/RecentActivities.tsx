import { useCustomQuery } from "@/hooks/useQuery";
import { useMemo, useState } from "react";

const PAGE_SIZE = 20;

interface Pagination {
  next: number | null;
  previous: number | null;
  count: number;
}

interface Activity {
  id: string;
  action: string;
  note: string;
  created_at: string;
}

function timeAgo(iso: string) {
  const now = new Date().getTime();
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSec < 60) return "الآن";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60)
    return `منذ ${diffMin} دقيقة${
      diffMin > 10 ? "" : diffMin === 2 ? "تين" : diffMin === 1 ? "" : "‌"
    }`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `منذ ${diffHr} ساعة`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `منذ ${diffDay} يوم`;
  const diffMon = Math.floor(diffDay / 30);
  if (diffMon < 12) return `منذ ${diffMon} شهر`;
  const diffYr = Math.floor(diffMon / 12);
  return `منذ ${diffYr} سنة`;
}

function colorForAction(action: string) {
  const a = action.toLowerCase();
  if (
    a.includes("add") ||
    a.includes("create") ||
    a.includes("insert") ||
    a.includes("added")
  )
    return "bg-orange-500";
  if (a.includes("register") || a.includes("signup") || a.includes("enroll"))
    return "bg-green-500";
  if (a.includes("upload") || a.includes("publish")) return "bg-blue-500";
  if (a.includes("update") || a.includes("edit")) return "bg-purple-500";
  if (a.includes("delete") || a.includes("remove")) return "bg-red-500";
  return "bg-gray-400";
}

export default function RecentActivities() {
  const [page, setPage] = useState<number>(0);

  const { data, isLoading, isError, refetch } = useCustomQuery(
    `/account/admin/main-recent-activities/?page=${page}`,
    ["main-recent-activities", page]
  );

  const pagination: Pagination | undefined = data?.pagination;
  const activities: Activity[] = data?.data ?? [];

  const lastPage = useMemo(() => {
    const total = pagination?.count ?? 0;
    return Math.max(0, Math.ceil(total / PAGE_SIZE) - 1);
  }, [pagination?.count]);

  const canPrev = page > 0 && (pagination?.previous !== null || page > 0);
  const canNext =
    page < lastPage && (pagination?.next !== null || page < lastPage);

  const handlePrev = () => {
    if (!canPrev) return;
    setPage((p) => Math.max(0, p - 1));
  };

  const handleNext = () => {
    if (!canNext) return;
    setPage((p) => Math.min(lastPage, p + 1));
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">النشاطات الحديثة</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>الصفحة</span>
          <strong className="text-gray-800">
            {lastPage ? page + 1 : activities.length ? page + 1 : 0}
          </strong>
          <span>من</span>
          <strong className="text-gray-800">{lastPage + 1}</strong>
        </div>
      </div>

      {/* Loading / Error / Empty */}
      {isLoading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-12 bg-gray-100 rounded-lg"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg">
          حدث خطأ أثناء جلب البيانات.
          <button onClick={() => refetch?.()} className="ml-2 underline">
            إعادة المحاولة
          </button>
        </div>
      )}

      {!isLoading && !isError && activities.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          لا توجد نشاطات لعرضها.
        </div>
      )}

      {/* Activities list */}
      <div className="space-y-2">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50/50 transition-colors"
          >
            <div
              className={`w-2 h-2 ${colorForAction(act.action)} rounded-full`}
            />
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm">
                {act.note || act.action}
              </p>
              <p className="text-gray-500 text-xs">{timeAgo(act.created_at)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className={`px-3 py-1.5 rounded-lg border text-sm ${
            canPrev
              ? "border-gray-200 text-gray-700 hover:bg-gray-50"
              : "border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          السابق
        </button>

        <div className="text-xs text-gray-500">
          إجمالي العناصر:{" "}
          <strong className="text-gray-800">{pagination?.count ?? 0}</strong>
        </div>

        <button
          onClick={handleNext}
          disabled={!canNext}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            canNext
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
}
