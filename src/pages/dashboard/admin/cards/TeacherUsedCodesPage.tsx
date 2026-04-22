import { useState } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  CreditCard,
  Users,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomUpdate } from "@/hooks/useMutation";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import Pagination from "@/components/dashboard/core/Pagination";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import toast from "react-hot-toast";

const TeacherUsedCodesPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("page_size", pageSize.toString());

  if (teacherFilter) queryParams.append("teacher", teacherFilter);
  if (paidFilter !== "all") queryParams.append("is_admin_paid", paidFilter);

  const { data, isLoading } = useCustomQuery(
    `/card/teacher-used-codes/?${queryParams.toString()}`,
    ["teacher-used-codes", page, teacherFilter, paidFilter],
  );

  const { data: teachersData } = useCustomQuery(
    "/account/admin/teachers/?pagination=false",
    ["teachers-list-all"],
  );

  const { mutateAsync: bulkMarkPaid, isPending: isBulkPaying } =
    useCustomUpdate("/card/teacher-used-codes/bulk-mark-paid/", [
      "teacher-used-codes",
    ]);

  const results = data?.results || [];
  const count = data?.count || 0;
  const teachersList = teachersData?.data || teachersData || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = results.map((r: any) => r.id);
      setSelectedIds(new Set(allIds));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkPay = async () => {
    if (selectedIds.size === 0) return;
    try {
      await bulkMarkPaid({
        ids: Array.from(selectedIds),
        is_admin_paid: true,
      });
      toast.success("تم تحديث الحالة بنجاح");
      setSelectedIds(new Set());
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            حصة المدرسين (كودات)
          </h1>
          <p className="text-gray-600 text-sm">
            متابعة دفع حصص المدرسين من الكودات المستخدمة
          </p>
        </div>
        {selectedIds.size > 0 && (
          <button
            onClick={handleBulkPay}
            disabled={isBulkPaying}
            className="btn-brand-slide px-6 py-2.5 rounded-xl font-medium shadow-lg flex items-center gap-2 text-sm disabled:opacity-50"
          >
            <CheckCircle size={18} />
            تم الدفع ({selectedIds.size})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Teacher Filter */}
          <div className="relative">
            <Users className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={teacherFilter}
              onChange={(e) => {
                setTeacherFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all text-sm appearance-none bg-white"
            >
              <option value="">جميع المدرسين</option>
              {Array.isArray(teachersList) &&
                teachersList.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
            </select>
          </div>

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
              <option value="true">تم الدفع</option>
              <option value="false">لم يتم الدفع</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : results.length === 0 ? (
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
                  <th className="px-6 py-4 text-right">
                    <input
                      type="checkbox"
                      checked={
                        results.length > 0 &&
                        selectedIds.size === results.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-(--brand) rounded border-gray-300 focus:ring-(--brand)"
                    />
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    المدرس
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الطالب
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الدورة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الكود
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    حصة المدرس
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {results.map((item: any) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${selectedIds.has(item.id) ? "bg-blue-50/30" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={(e) =>
                          handleSelectRow(item.id, e.target.checked)
                        }
                        className="w-4 h-4 text-(--brand) rounded border-gray-300 focus:ring-(--brand)"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.teacher?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.student?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.course?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-(--brand)">
                          {item.generated_code?.code_string}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {item.code?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600">
                      {item.teacher_share} د.أ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.is_admin_paid ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit font-medium">
                            <CheckCircle size={10} />
                            تم الدفع
                          </span>
                          {item.admin_paid_by && (
                            <span className="text-[10px] text-gray-400 mr-1">
                              بواسطة: {item.admin_paid_by}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full w-fit font-medium">
                          <XCircle size={10} />
                          لم يتم الدفع
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[10px] text-gray-400 font-mono">
                      {formatDateTimeSimple(item.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {count > pageSize && (
        <Pagination
          currentPage={page}
          count={count}
          onPageChange={setPage}
          pageSize={pageSize}
        />
      )}
    </div>
  );
};

export default TeacherUsedCodesPage;
