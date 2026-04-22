import { useState } from "react";
import {
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import Pagination from "@/components/dashboard/core/Pagination";

const TeacherEnrollmentInstallmentsPage = () => {
  const [page, setPage] = useState(1);
  const [paidFilter, setPaidFilter] = useState<string>("all");
  const [overdueFilter, setOverdueFilter] = useState<string>("all");

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("page_size", "10");

  if (paidFilter !== "all") queryParams.append("is_paid", paidFilter);
  if (overdueFilter !== "all") queryParams.append("is_overdue", overdueFilter);

  const { data, isLoading } = useCustomQuery(
    `/v2/teacher/card-sales/installment-enrollments/?${queryParams.toString()}`,
    ["teacher-enrollment-installments", page, paidFilter, overdueFilter],
  );

  const enrollments = data?.data;

  const getInstallmentBadge = (summary: any) => {
    const {
      paid_installments,
      total_installments,
      overdue_unpaid_installments,
    } = summary;

    if (paid_installments === total_installments) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} />
          مكتمل ({paid_installments}/{total_installments})
        </span>
      );
    }

    if (overdue_unpaid_installments > 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle size={12} />
          متأخر ({paid_installments}/{total_installments})
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-(--brand)">
        <Calendar size={12} />
        جاري ({paid_installments}/{total_installments})
      </span>
    );
  };

  const getNextDueDate = (schedule: any[]) => {
    const nextInstallment = schedule?.find((inst: any) => !inst.is_paid);
    return nextInstallment ? nextInstallment.due_date : "-";
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">أقساط الطلاب</h1>
          <p className="text-gray-600 text-sm">
            متابعة دفعات أقساط الطلاب المسجلين في دوراتك
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {/* Paid Filter */}
          <div className="relative">
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={paidFilter}
              onChange={(e) => {
                setPaidFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all text-sm appearance-none bg-white"
            >
              <option value="all">حالة الدفع (الكل)</option>
              <option value="true">مدفوع بالكامل</option>
              <option value="false">غير مكتمل</option>
            </select>
          </div>

          {/* Overdue Filter */}
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={overdueFilter}
              onChange={(e) => {
                setOverdueFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all text-sm appearance-none bg-white"
            >
              <option value="all">تجاوز الموعد (الكل)</option>
              <option value="true">يوجد أقساط متأخرة</option>
              <option value="false">لا يوجد تأخير</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : !enrollments || enrollments.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد سجلات
          </h3>
          <p className="text-gray-500">
            لا توجد بيانات تطابق فلاتر البحث الحالية.
          </p>
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الطالب
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الدورة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    المبلغ الإجمالي
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    المدفوع
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    المتبقي
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    حالة الأقساط
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    موعد القسط القادم
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الكود
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {enrollments.map((item: any) => (
                  <tr
                    key={item.enrollment_id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {item.student?.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.student?.mobile_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.course?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      {item.installment_summary?.total_due_amount} د.أ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {item.installment_summary?.total_paid_amount} د.أ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      {item.installment_summary?.total_unpaid_amount} د.أ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getInstallmentBadge(item.installment_summary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {getNextDueDate(item.installment_schedule)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit">
                        {item.generated_code?.code_string}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {data?.pagination && (
        <Pagination
          currentPage={page}
          onPageChange={setPage}
          count={data?.pagination?.count || data?.count}
          pageSize={10}
        />
      )}
    </div>
  );
};

export default TeacherEnrollmentInstallmentsPage;
