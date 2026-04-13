import Pagination from "@/components/dashboard/core/Pagination";
import Spinner from "@/components/dashboard/Spinner";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import type { SalesFilters } from "../../utils/salesFilters";
import { NamedRef } from "../../types/types";
import { parseSalesPayload } from "../../utils/parseSalesPayload";

const TH =
  "px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider";
const TD = "px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums";
const TD_TEXT = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

function cellTitle(ref: NamedRef | undefined): string {
  const t = ref?.title?.trim();
  return t || "—";
}

export default function SalesTable({
  filters,
  setPage,
  salesResponse,
  isLoadingSales,
}: {
  filters: SalesFilters;
  setPage: (page: number) => void;
  salesResponse: unknown;
  isLoadingSales: boolean;
}) {
  const payload = parseSalesPayload(salesResponse);
  const rows = payload?.data ?? [];
  const totalCount = payload?.count ?? 0;

  return (
    <div className="space-y-4 w-full min-w-0" dir="rtl">
      <h3 className="text-base font-semibold text-gray-800 px-0.5">
        قائمة المبيعات التفصيلية
      </h3>
      {isLoadingSales ? (
        <div className="flex justify-center w-full py-12">
          <Spinner size={40} thickness={4} className="text-(--brand)" />
        </div>
      ) : !rows.length ? (
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <p className="text-gray-500">لا توجد نتائج في القائمة</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={TH}>تاريخ التفعيل</th>
                    <th className={TH}>الطالب</th>
                    <th className={TH}>الجوال</th>
                    <th className={TH}>الدورة</th>
                    <th className={TH}>سعر البطاقة</th>
                    <th className={TH}>حصة المعلم</th>
                    <th className={TH}>% من البطاقة</th>
                    <th className={TH}>القسم</th>
                    <th className={TH}>المستوى</th>
                    <th className={TH}>التخصص</th>
                    <th className={TH}>المادة</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rows.map((row) => (
                    <tr key={row.enrollment_id} className="hover:bg-gray-50">
                      <td className={TD_TEXT}>
                        {formatDateTimeSimple(row.activated_at)}
                      </td>
                      <td className={TD_TEXT}>{row.student?.name ?? "—"}</td>
                      <td className={TD_TEXT}>
                        {row.student?.mobile_number ?? "—"}
                      </td>
                      <td className={TD_TEXT}>
                        <span className="font-medium text-gray-900 line-clamp-2 max-w-56">
                          {row.course?.name ?? "—"}
                        </span>
                      </td>
                      <td className={TD}>{row.card?.price ?? "—"}</td>
                      <td className={TD}>{row.teacher_share}</td>
                      <td className={TD}>
                        {Number(row.share_percent_of_card).toFixed(2)}
                      </td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.category?.subsection)}
                      </td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.category?.subsubsection)}
                      </td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.category?.specialization)}
                      </td>
                      <td className={TD_TEXT}>
                        {cellTitle(row.category?.specialization_material)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={filters.page}
            onPageChange={(page: number) => setPage(page)}
            count={totalCount}
            pageSize={filters.page_size}
          />
        </>
      )}
    </div>
  );
}
