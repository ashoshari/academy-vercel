import {
  Plus,
  Edit,
  Eye,
  Book,
  Users,
  Phone,
  Mail,
  UserCheck,
  DollarSign,
  Rows,
  Grid,
  Search,
  CircleX,
  EyeOff,
  RefreshCcw,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import Spinner from "@/components/dashboard/Spinner";
import { useState } from "react";
import { flushSync } from "react-dom";
import Pagination from "@/components/dashboard/core/Pagination";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  location: string;
  parentPhone?: string;
  parentEmail?: string;
  schoolName?: string;
  grade: string;
  isActive: boolean;
  isVerified: boolean;
  registrationDate: string;
  lastLogin: string;
  totalCoursesEnrolled: number;
  completedCourses: number;
  currentCourses: number;
  totalSpent: number;
  averageGrade: number;
  studyHours: number;
  enrolledCourses: CourseEnrollment[];
  achievements: Achievement[];
  paymentHistory: PaymentRecord[];
  activityLog: ActivityRecord[];
}

export interface CourseEnrollment {
  courseId: number;
  courseName: string;
  courseType: "exam" | "ministry" | "course" | "cards";
  teacherName: string;
  enrollmentDate: string;
  completionDate?: string;
  progress: number; // 0-100
  grade?: number; // 0-100
  status: "active" | "completed" | "paused" | "dropped";
  timeSpent: number; // in hours
  lastAccessed: string;
  price: number;
  isPaid: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: "completion" | "grade" | "streak" | "participation";
}

export interface PaymentRecord {
  id: number;
  amount: number;
  date: string;
  method: "card" | "cash" | "bank_transfer";
  status: "completed" | "pending" | "failed";
  description: string;
  courseId?: number;
}

export interface ActivityRecord {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  category: "login" | "course" | "payment" | "achievement" | "exam";
}

type PendingStudentVisibility = {
  id: string | number;
  isActive: boolean;
  name: string;
};

const StudentsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState<any>(null);
  const [gradeFilter, setGradeFilter] = useState<any>();
  const [statusFilter, setStatusFilter] = useState<any>();
  const [page, setPage] = useState(1);
  const [pendingStudentVisibility, setPendingStudentVisibility] =
    useState<PendingStudentVisibility | null>(null);

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("search", searchTerm);
  if (courseFilter) queryParams.append("course_name", courseFilter);
  if (gradeFilter) queryParams.append("grade", gradeFilter);
  if (statusFilter) queryParams.append("is_active", statusFilter);
  if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();
  // GET Students
  const { data, isLoading } = useCustomQuery(
    `/account/admin/students/?${queryString}`,
    ["students", page, searchTerm, courseFilter, gradeFilter, statusFilter],
  );

  // GET Courses
  const { data: courses } = useCustomQuery("/training/admin/courses/", [
    "courses",
  ]);
  // GET Grades
  const { data: grades } = useCustomQuery("/core/grades/", ["grades"]);
  // GET Statistics
  const dataStatistics = useCustomQuery("/account/admin/students-statistics/", [
    "students-statistics",
  ]);

  const studentsData = data?.data;
  const paginationData = data?.pagination;
  const coursesData = courses?.data;
  const gradesData = grades?.data;
  const { mutateAsync: putStudent, isPending } = useCustomUpdate(
    () => `/account/admin/students/${studentId}/`,
    ["students", "students-statistics"],
  );
  // POST Reset IMEI
  const { mutateAsync: resetIMEI } = useCustomPost(
    `/account/admin/students/${studentId}/reset-device-sessions/`,
    ["resetIMEI"],
  );
  const handleResetIMEI = async (id: string) => {
    setStudentId(id);
    try {
      const response = await resetIMEI({ id });
      toast.success(response?.data ?? "تم إعادة تعيين IMEI");
      queryClient.invalidateQueries({
        queryKey: [
          "students",
          page,
          searchTerm,
          courseFilter,
          gradeFilter,
          statusFilter,
        ],
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ?? "حدث خطأ في إعادة تعيين IMEI",
      );
    }
  };
  const requestStudentVisibilityToggle = (student: any) => {
    setPendingStudentVisibility({
      id: student.id,
      isActive: Boolean(student?.is_active),
      name: String(student?.name ?? "").trim() || "هذا الطالب",
    });
  };

  const confirmStudentVisibilityToggle = async () => {
    if (!pendingStudentVisibility) return;
    const { id, isActive } = pendingStudentVisibility;
    flushSync(() => {
      setStudentId(String(id));
    });
    try {
      const response = await putStudent({
        is_active: !isActive,
      });
      toast.success(response?.data?.message ?? "تم تحديث حالة الطلب");
      setPendingStudentVisibility(null);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ?? "حدث خطأ في تحديث حالة الطالب",
      );
    }
  };
  const StudentCard = ({ student }: { student: any }) => (
    <div className="flex flex-col bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="h-[30%] p-6 bg-linear-to-r from-(--brand) to-(--brand-light) text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                student?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  student?.name,
                )}&background=ffffff&color=f97316&size=64`
              }
              alt={student?.name}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{student?.name || "-"}</h3>
            <p className="text-orange-100 text-sm">
              {student?.grade?.name || "-"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student?.is_active
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {student?.is_allow_to_use_web
                  ? "متاح للمشاهدة على الويب"
                  : "غير متاح للمشاهدة على الويب"}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  student?.is_active
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {student?.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {student?.total_number_of_enrolled_courses}
            </div>
            <div className="text-xs text-gray-500">دورات مسجلة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {student?.total_number_of_completed_courses}
            </div>
            <div className="text-xs text-gray-500">دورات مكتملة</div>
          </div>
          <div className="text-center col-span-2">
            <div className="text-2xl font-bold text-orange-600">
              {student?.total_spend} د.أ
            </div>
            <div className="text-xs text-gray-500">إجمالي الإنفاق</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 space-y-5 mb-6">
          <div className="flex items-center h-full gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>{student?.mobile_number}</span>
          </div>
          {/* {student?.email && ( */}
          <div className="flex items-center h-full gap-2 text-sm text-gray-600">
            <Mail size={14} />
            <span className="truncate">{student?.email || "-"}</span>
          </div>
          {/* )} */}
          <div className="flex items-center h-full gap-2 text-sm text-gray-600">
            <Info size={14} />
            <span className="truncate">{student?.imei || "-"}</span>
          </div>
          <div className="flex items-center h-full gap-2 text-sm text-gray-600">
            <RefreshCcw size={14} />
            <span className="truncate">
              {student?.imei_reseted_count || "-"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center gap-1 w-full">
            <div>
              <button
                onClick={() => {
                  navigate(`/dashboard/students/${student.id}`);
                }}
                className="cursor-pointer p-2 text-gray-400 hover:text-green-600 rounded-lg transition-colors"
                title="عرض التفاصيل"
              >
                <Book size={16} />
              </button>
              <button
                onClick={() => requestStudentVisibilityToggle(student)}
                className="cursor-pointer p-2 text-gray-400 hover:text-(--brand-secondary) rounded-lg transition-colors"
                title={student?.is_active ? "إخفاء الطالب" : "إظهار الطالب"}
              >
                {student?.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  handleResetIMEI(student?.id);
                }}
                className="cursor-pointer p-2 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                title="إعادة تعيين رمز هوية الجهاز"
              >
                <RefreshCcw size={16} />
              </button>
              <button
                onClick={() => {
                  navigate(`/dashboard/students/edit/${student.id}`);
                }}
                className="cursor-pointer p-2 text-gray-400 hover:text-orange-600 rounded-lg transition-colors"
                title="تعديل الطالب"
              >
                <Edit size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col items-center gap-5 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الطلاب</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الطلاب المسجلين في المنصة
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/students/add")}
            className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة طالب
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الطلاب</p>
              <p className="text-3xl font-bold text-gray-800">
                {dataStatistics?.data?.data?.total_students ?? "-"}
              </p>
            </div>
            <Users className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الطلاب النشطون</p>
              <p className="text-3xl font-bold text-green-600">
                {dataStatistics?.data?.data?.active_students ?? "-"}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الطلاب الغير نشطون</p>
              <p className="text-3xl font-bold text-(--brand-secondary)">
                {dataStatistics?.data?.data?.inactive_students ?? "-"}
              </p>
            </div>
            <CircleX className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الإيرادات</p>
              <p className="text-3xl font-bold text-orange-600">
                {dataStatistics?.data?.data?.total_income
                  ? dataStatistics?.data?.data?.total_income + " د.أ"
                  : "0"}
              </p>
            </div>
            <DollarSign className="w-12 h-12 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الدورات..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
            />
          </div>

          {/* Courses Filter */}
          <select
            value={courseFilter || ""}
            onChange={(e) =>
              setCourseFilter(e.target.value ? e.target.value : null)
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
          >
            <option value="">جميع الدورات</option>
            {coursesData?.map((course: any) => (
              <option key={course.id} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>

          {/* Grade Filter */}
          <select
            value={gradeFilter || ""}
            onChange={(e) =>
              setGradeFilter(e.target.value ? e.target.value : null)
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
          >
            <option value="">جميع المراحل</option>
            {gradesData?.map((grade: any) => (
              <option key={grade.id} value={grade.id}>
                {grade.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
          >
            <option value="">جميع الحالات</option>
            <option value="true">نشط</option>
            <option value="false">غير نشط</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Students Grid/Table */}
      {isLoading || isPending ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !studentsData || studentsData.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة طلاب جدد للمنصة</p>

          <button
            onClick={() => navigate("/dashboard/students/add")}
            className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة طالب جديد
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentsData?.map((student: any) => (
              <StudentCard key={student.id} student={student} />
            ))}

            {studentsData?.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-500 mb-6">
                  ابدأ بإضافة طلاب جدد للمنصة
                </p>

                <button
                  onClick={() => navigate("/dashboard/students/add")}
                  className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  إضافة طالب جديد
                </button>
              </div>
            )}
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          {/* Table */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطالب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدورات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإنفاق
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رمز هوية الجهاز
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مرات إعادة التعيين هوية الجهاز
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentsData?.map((student: any) => (
                    <tr key={student?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">
                            {student?.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student?.grade?.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {student?.total_number_of_enrolled_courses}
                          </span>
                          <span className="text-gray-500">
                            ({student?.total_number_of_completed_courses} مكتمل)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">
                          {student?.total_spend} د.أ
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student?.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {student?.is_active ? "نشط" : "غير نشط"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student?.is_allow_to_use_web
                                ? "bg-blue-100 text-(--brand-secondary)"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {student?.is_allow_to_use_web ? "ويب" : "تطبيق"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">
                          {student?.mobile_number || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">
                          {student?.email || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">
                          {student?.imei || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-medium">
                          {student?.imei_reseted_count || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigate(`/dashboard/students/${student.id}`);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Book size={16} />
                          </button>
                          <button
                            onClick={() =>
                              requestStudentVisibilityToggle(student)
                            }
                            className="cursor-pointer p-2 text-gray-400 hover:text-(--brand-secondary) rounded-lg transition-colors"
                            title={
                              student?.is_active
                                ? "إخفاء الطالب"
                                : "إظهار الطالب"
                            }
                          >
                            {student?.is_active ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              handleResetIMEI(student?.id);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-purple-600 transition-colors"
                            title="إعادة تعيين رمز هوية الجهاز"
                          >
                            <RefreshCcw size={16} />
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/dashboard/students/edit/${student.id}`,
                              );
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-orange-600 transition-colors"
                            title="تعديل الطالب"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      )}

      {pendingStudentVisibility && (
        <ConfirmationModal
          open
          onClose={() => !isPending && setPendingStudentVisibility(null)}
          onConfirm={confirmStudentVisibilityToggle}
          title="تأكيد ظهور الطالب"
          variant={pendingStudentVisibility.isActive ? "danger" : "success"}
          icon={pendingStudentVisibility.isActive ? EyeOff : Eye}
          confirmLabel={
            pendingStudentVisibility.isActive
              ? "نعم، إخفاء الطالب"
              : "نعم، إظهار الطالب"
          }
          isPending={isPending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingStudentVisibility.isActive ? "إخفاء" : "إظهار"}
                </span>{" "}
                الطالب{" "}
                <span className="font-bold text-(--brand-secondary)">
                  {pendingStudentVisibility.name}
                </span>
                ؟
              </p>
              {pendingStudentVisibility.isActive ? (
                <p className="text-sm text-amber-900/90 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  لن يظهر الطالب كطالب نشط في القوائم ذات الصلة حتى تعيد تفعيله.
                </p>
              ) : (
                <p className="text-sm text-emerald-900/90 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  سيتم اعتبار الطالب نشطاً ويظهر وفقاً لإعدادات العرض الحالية.
                </p>
              )}
            </>
          }
        />
      )}
    </div>
  );
};

export default StudentsPage;
