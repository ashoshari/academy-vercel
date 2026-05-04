import { useState } from "react";
import {
  Search,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import Pagination from "@/components/dashboard/core/Pagination";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import toast from "react-hot-toast";
import { useCustomPut } from "@/hooks/useMutation";
import EmptyState from "@/components/core/EmptyState";

const EnrollmentInstallmentsPage = () => {
  const [page, setPage] = useState(1);
  const [courseFilter, setCourseFilter] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [paidFilter, setPaidFilter] = useState<string>("all");
  const [overdueFilter, setOverdueFilter] = useState<string>("all");
  const [selectedInstallment, setSelectedInstallment] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("page_size", "15");

  if (courseFilter) queryParams.append("course_id", courseFilter);
  if (studentSearch) queryParams.append("student_name", studentSearch); // Assuming search or student_id
  if (paidFilter !== "all") queryParams.append("is_paid", paidFilter);
  if (overdueFilter !== "all") queryParams.append("is_overdue", overdueFilter);

  const { data, isLoading } = useCustomQuery(
    `/cards/enrollment-installments/?${queryParams.toString()}`,
    [
      "enrollment-installments",
      page,
      courseFilter,
      studentSearch,
      paidFilter,
      overdueFilter,
    ],
  );

  const { data: coursesDataRes } = useCustomQuery(
    "/training/admin/courses/?is_paginated=false",
    ["courses-list-simple"],
  );

  const { mutateAsync: patchInstallment, isPending: isPatching } = useCustomPut(
    () => `/cards/enrollment-installments/${selectedInstallment?.id}/`,
    ["enrollment-installments"],
  );

  const installments = data?.data;
  const coursesList = coursesDataRes?.data || coursesDataRes;

  const handleTogglePaid = async () => {
    if (!selectedInstallment) return;
    try {
      await patchInstallment({ is_paid: !selectedInstallment.is_paid });
      toast.success("تم تحديث حالة الدفع بنجاح");
      setShowConfirmModal(false);
      setSelectedInstallment(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء التحديث");
    }
  };

  const getStatusBadge = (isPaid: boolean) => {
    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} />
          مدفوع
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle size={12} />
        غير مدفوع
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 min-h-full" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">أقساط التسجيل</h1>
          <p className="text-gray-600 text-sm">
            متابعة وإدارة دفعات أقساط الطلاب للدورات
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Student Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="بحث عن طالب..."
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all text-sm"
            />
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
              <option value="true">مدفوع</option>
              <option value="false">غير مدفوع</option>
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
              <option value="true">متجاوز</option>
              <option value="false">غير متجاوز</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : !installments || installments.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <EmptyState
            title="لا توجد نتائج"
            description="لا توجد بيانات تطابق فلاتر البحث الحالية."
            size="md"
          />
        </div>
      ) : (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) flex flex-col min-h-0">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    المبلغ
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    تاريخ الاستحقاق
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    تاريخ الدفع
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
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {installments.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-(--brand)">
                      {item.amount} د.أ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {item.due_date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.is_paid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.paid_at ? formatDateTimeSimple(item.paid_at) : "-"}
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit">
                        {item.generated_code?.code_string}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.is_paid ? (
                        <button
                          type="button"
                          className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-800 transition-colors hover:bg-rose-100"
                          onClick={() => {
                            setSelectedInstallment(item);
                            setShowConfirmModal(true);
                          }}
                          title="تعيين هذا القسط كغير مدفوع"
                        >
                          تعيين كغير مدفوع
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="cursor-pointer rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100"
                          onClick={() => {
                            setSelectedInstallment(item);
                            setShowConfirmModal(true);
                          }}
                          title="تعيين هذا القسط كمدفوع"
                        >
                          تعيين كمدفوع
                        </button>
                      )}
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
          count={data?.pagination?.count}
          pageSize={15}
        />
      )}
      {showConfirmModal && selectedInstallment && (
        <ConfirmationModal
          open={showConfirmModal}
          onClose={() => !isPatching && setShowConfirmModal(false)}
          onConfirm={handleTogglePaid}
          title="تغيير حالة الدفع"
          confirmLabel="تأكيد التغيير"
          variant={selectedInstallment.is_paid ? "danger" : "success"}
          isPending={isPatching}
          description={
            <p>
              هل أنت متأكد من تغيير حالة الدفع لهذا القسط إلى{" "}
              <span className="font-bold">
                {selectedInstallment.is_paid ? "غير مدفوع" : "مدفوع"}
              </span>
              ؟
            </p>
          }
        />
      )}
    </div>
  );
};

export default EnrollmentInstallmentsPage;
