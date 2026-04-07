import SalesTableSection from "../sales-table-section/SalesTableSection";
const TH =
  "px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider";
const TD = "px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums";
const TD_TEXT = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

interface NamedRef {
  id: string | null;
  title: string | null;
}
interface SalesByCategoryRow {
  subsection: NamedRef;
  subsubsection: NamedRef;
  specialization: NamedRef;
  specialization_material: NamedRef;
  sold_count: number;
  total_teacher_share: string;
  total_card_revenue: string;
}
function cellTitle(ref: NamedRef | undefined): string {
  const t = ref?.title?.trim();
  return t || "—";
}
function StatsByCategory({ byCategory }: { byCategory: SalesByCategoryRow[] }) {
  return (
    <SalesTableSection
      title="حسب التصنيف"
      count={byCategory.length}
      countLabel="تصنيف"
    >
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className={TH}>القسم الفرعي</th>
            <th className={TH}>القسم الفرعي الثاني</th>
            <th className={TH}>التخصص</th>
            <th className={TH}>المادة</th>
            <th className={TH}>عدد المبيعات</th>
            <th className={TH}>حصة المعلم</th>
            <th className={TH}>إيراد البطاقة</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {byCategory.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-12 text-center text-gray-500 text-sm"
              >
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            byCategory.map((row, idx) => (
              <tr
                key={`${row.subsection.id}-${row.specialization_material.id}-${idx}`}
                className="hover:bg-gray-50"
              >
                <td className={TD_TEXT}>{cellTitle(row.subsection)}</td>
                <td className={TD_TEXT}>{cellTitle(row.subsubsection)}</td>
                <td className={TD_TEXT}>{cellTitle(row.specialization)}</td>
                <td className={TD_TEXT}>
                  {cellTitle(row.specialization_material)}
                </td>
                <td className={TD}>{row.sold_count}</td>
                <td className={TD}>{row.total_teacher_share}</td>
                <td className={TD}>{row.total_card_revenue}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SalesTableSection>
  );
}

export default StatsByCategory;
