import { useState } from "react";
import {
  DollarSign,
  CheckCircle,
  XCircle,
  CreditCard,
  Users,
  BookOpen,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomUpdate } from "@/hooks/useMutation";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import Pagination from "@/components/dashboard/core/Pagination";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import toast from "react-hot-toast";

const TeacherUsedCodesPage = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPaidStatus, setTargetPaidStatus] = useState(true);
  const [activeRecord, setActiveRecord] = useState<any>(null);

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("page_size", pageSize.toString());

  if (teacherFilter) queryParams.append("teacher", teacherFilter);
  if (courseFilter) queryParams.append("course", courseFilter);
  if (paidFilter !== "all") queryParams.append("is_admin_paid", paidFilter);

  const { data, isLoading } = useCustomQuery(
    `/cards/teacher-used-codes/?${queryParams.toString()}`,
    ["teacher-used-codes", page, teacherFilter, courseFilter, paidFilter],
  );

  const { data: coursesData } = useCustomQuery("/training/admin/courses/", [
    "courses",
  ]);

  const { data: teachersData } = useCustomQuery(
    "/account/admin/teachers/?pagination=false",
    ["teachers-list-all"],
  );

  const { mutateAsync: bulkMarkPaid, isPending: isBulkPaying } =
    useCustomUpdate("/cards/teacher-used-codes/bulk-mark-paid/", [
      "teacher-used-codes",
    ]);

  const results = data?.data || [];
  const count = data?.pagination?.count || 0;
  const teachersList = teachersData?.data || teachersData || [];
  const coursesList = coursesData?.data || [];

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
    const ids = activeRecord ? [activeRecord.id] : Array.from(selectedIds);
    const isPaid = activeRecord
      ? !activeRecord.is_admin_paid
      : targetPaidStatus;

    if (ids.length === 0) return;
    try {
      await bulkMarkPaid({
        ids: ids,
        is_admin_paid: isPaid,
      });
      toast.success("تم تحديث الحالة بنجاح");
      setSelectedIds(new Set());
      setActiveRecord(null);
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  };

  return (
    <div className="space-y-6">
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
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setTargetPaidStatus(true);
                setIsModalOpen(true);
              }}
              disabled={isBulkPaying}
              className="btn-brand-slide px-4 py-2.5 rounded-xl font-medium shadow-lg flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <CheckCircle size={18} />
              تم الدفع ({selectedIds.size})
            </button>
            <button
              onClick={() => {
                setTargetPaidStatus(false);
                setIsModalOpen(true);
              }}
              disabled={isBulkPaying}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-medium shadow-sm flex items-center gap-2 text-sm disabled:opacity-50 border border-red-200"
            >
              <XCircle size={18} />
              إلغاء الدفع ({selectedIds.size})
            </button>
          </div>
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

          {/* Course Filter */}
          <div className="relative">
            <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={courseFilter}
              onChange={(e) => {
                setCourseFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all text-sm appearance-none bg-white"
            >
              <option value="">جميع الدورات</option>
              {Array.isArray(coursesList) &&
                coursesList.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
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
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    المدرس
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    الطالب
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    الدورة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    الكود
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    حصة المدرس
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    التاريخ
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    الإجراءات
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
                              بواسطة: {item.admin_paid_by.name}
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        className="cursor-pointer hover:scale-110 transition-transform"
                        onClick={() => {
                          setActiveRecord(item);
                          setIsModalOpen(true);
                        }}
                        title={
                          item.is_admin_paid
                            ? "تغيير إلى لم يتم الدفع"
                            : "تغيير إلى تم الدفع"
                        }
                      >
                        {item.is_admin_paid ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <XCircle size={18} className="text-red-500" />
                        )}
                      </button>
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

      <ConfirmationModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveRecord(null);
        }}
        onConfirm={handleBulkPay}
        title={
          activeRecord
            ? "تغيير حالة الدفع"
            : targetPaidStatus
              ? "تأكيد الدفع"
              : "تأكيد إلغاء الدفع"
        }
        description={
          activeRecord ? (
            <p>
              هل أنت متأكد من تغيير حالة الدفع لهذا السجل إلى{" "}
              <span className="font-bold">
                {activeRecord.is_admin_paid ? "لم يتم الدفع" : "تم الدفع"}
              </span>
              ؟
            </p>
          ) : targetPaidStatus ? (
            `هل أنت متأكد من تمييز ${selectedIds.size} سجلات كمدفوعة؟`
          ) : (
            `هل أنت متأكد من إلغاء دفع ${selectedIds.size} سجلات؟`
          )
        }
        confirmLabel="تأكيد"
        cancelLabel="تراجع"
        variant={
          activeRecord
            ? activeRecord.is_admin_paid
              ? "danger"
              : "success"
            : targetPaidStatus
              ? "success"
              : "danger"
        }
        icon={
          activeRecord
            ? activeRecord.is_admin_paid
              ? XCircle
              : CheckCircle
            : targetPaidStatus
              ? CheckCircle
              : XCircle
        }
        isPending={isBulkPaying}
      />
    </div>
  );
};

export default TeacherUsedCodesPage;
