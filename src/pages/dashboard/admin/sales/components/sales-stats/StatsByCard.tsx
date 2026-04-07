import SalesTableSection from "../sales-table-section/SalesTableSection";
const TH =
  "px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider";
const TD = "px-6 py-4 whitespace-nowrap text-sm text-gray-900 tabular-nums";
const TD_TEXT = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";
interface SalesByCardRow {
  card_id: string;
  card_price: string;
  sold_count: number;
  total_teacher_share: string;
}
function StatsByCard({ byCard }: { byCard: SalesByCardRow[] }) {
  return (
    <SalesTableSection
      title="حسب البطاقة"
      count={byCard.length}
      countLabel="بطاقة"
    >
      <table className="min-w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className={TH}>معرّف البطاقة</th>
            <th className={TH}>سعر البطاقة</th>
            <th className={TH}>عدد المبيعات</th>
            <th className={TH}>حصة المعلم</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {byCard.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-12 text-center text-gray-500 text-sm"
              >
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            byCard.map((row) => (
              <tr key={row.card_id} className="hover:bg-gray-50">
                <td
                  className={`${TD_TEXT} font-mono text-xs max-w-[min(100vw,320px)] truncate`}
                  title={row.card_id}
                >
                  {row.card_id}
                </td>
                <td className={TD}>{row.card_price}</td>
                <td className={TD}>{row.sold_count}</td>
                <td className={TD}>{row.total_teacher_share}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </SalesTableSection>
  );
}

export default StatsByCard;
