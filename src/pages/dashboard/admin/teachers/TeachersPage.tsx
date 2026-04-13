import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Eye,
  Users,
  Phone,
  Mail,
  UserCheck,
  RefreshCw,
  Check,
  ClipboardCopy,
  X,
  Grid,
  Rows,
  CircleX,
  Book,
  EyeOff,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useNavigate } from "react-router";
import Pagination from "@/components/dashboard/core/Pagination";
import Spinner from "@/components/dashboard/Spinner";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  specialization: string;
  experience: number;
  qualification: string;
  bio: string;
  location: string;
  isActive: boolean;
  isVerified: boolean;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  joinDate: string;
  lastLogin: string;
  subjects: string[];
  certifications: string[];
  lastPasswordChange: string;
}

const TeachersPage = () => {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();
  // filter
  const [filters, setFilters] = useState({
    search: "",
    material: "",
    status: "all" as "all" | "active" | "inactive",
    page: 1,
  });

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // filters
  const queryParams = new URLSearchParams();
  if (filters.search) queryParams.append("name", filters.search);
  if (filters.status) queryParams.append("is_active", filters.status);
  if (filters.material) queryParams.append("materials", filters.material);
  queryParams.append("page", filters.page?.toString());

  const teachersStatistics = useCustomQuery(
    "account/admin/teachers-statistics/",
    ["teachers-statistics"],
  );

  const dataTeachers = useCustomQuery(
    `account/admin/teachers/?${queryParams.toString()}`,
    ["teachers", filters],
  );
  const dataMaterials = useCustomQuery("core/materials/", ["materials"]);

  const teacherStatus = useCustomPost(
    `/account/admin/teachers/${selectedTeacher?.id}/activate/`,
    ["teachers", "teachers-statistics"],
  );
  const resetAccountPassword = useCustomUpdate(
    `/account/admin/teachers/${selectedTeacher?.id}/reset-password/`,
  );

  // const handleDeleteTeacher = () => {
  //   if (
  //     confirm(
  //       "هل أنت متأكد من حذف هذا المعلم؟ سيتم حذف جميع الدورات المرتبطة به."
  //     )
  //   ) {
  //     // setTeachers(teachers.filter((teacher) => teacher.id !== id));
  //   }
  // };

  const toggleTeacherStatus = () => {
    teacherStatus
      ?.mutateAsync({})
      .then((res) => {
        if (res?.status) {
          toast.success(res?.data);
        } else {
          toast.error("فشل تحديث حالة المعلم");
        }
      })
      .catch((error) => {
        handleErrorAlerts(
          error?.response?.data?.message || "حدث خطأ أثناء تحديث الحالة",
        );
      });
  };

  const resetPassword = () => {
    resetAccountPassword.mutateAsync({}).then((res) => {
      if (res.status) {
        toast.success(res?.data?.message);
        setNewPassword(res?.data?.new_password);
        setShowPasswordModal(true);
      } else {
        toast.error(res.error);
      }
    });
  };

  // const exportToExcel = () => {
  //   const csvContent = [
  //     [
  //       "الاسم",
  //       "البريد الإلكتروني",
  //       "الهاتف",
  //       "التخصص",
  //       "المؤهل",
  //       "الحالة",
  //       "الطلاب",
  //       "الدورات",
  //     ],
  //     dataTeachers?.data?.data?.map((teacher: any) => [
  //       teacher.name,
  //       teacher.email,
  //       teacher.mobile_number,
  //       teacher?.materials?.map((el: any) => el?.name).join(", "),
  //       teacher.is_active ? "نشط" : "غير نشط",
  //       teacher.number_of_students_enrolled,
  //       teacher.number_of_courses_has,
  //     ]),
  //   ]
  //     .map((row) => row.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `teachers-${new Date().toISOString().split("T")[0]}.csv`;
  //   link.click();
  // };

  const TeacherCard = ({ teacher }: { teacher: any }) => (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-(--brand) to-(--brand-light) text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                teacher?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  teacher?.name,
                )}&background=ffffff&color=f97316&size=64`
              }
              alt={teacher?.name}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
            {/* <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                student.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div> */}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{teacher.name}</h3>

            <p className="text-(--brand) text-sm">
              {teacher?.material?.name || "-"}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  teacher.is_active
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {teacher.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-(--brand-secondary)">
              {teacher?.number_of_courses_has}
            </div>
            <div className="text-xs text-gray-500">دورة</div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>{teacher.mobile_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} />
            <span className="truncate">{teacher.email || "-"}</span>
          </div>
        </div>

        {/* Subjects */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">المواد التي يدرسها</h4>
          <div className="flex flex-wrap gap-1">
            {teacher?.tags?.length > 0 ? (
              teacher?.tags?.slice(0, 3)?.map((subject: any) => (
                <span
                  key={subject.id}
                  className="px-2 py-1 bg-blue-100 text-(--brand-secondary) rounded-full text-xs font-medium"
                >
                  {subject.name}
                </span>
              ))
            ) : (
              <div className="text-xs text-gray-500">لا يوجد مواد مسجلة</div>
            )}
            {teacher?.tags?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{teacher.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                navigate(`/dashboard/teachers/${teacher.id}`);
              }}
              className="p-2 text-gray-400 hover:text-(--brand-secondary) hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="عرض التفاصيل"
            >
              <Book size={16} />
            </button>

            <button
              onClick={() => {
                setSelectedTeacher(teacher);
                resetPassword();
              }}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="إعادة تعيين كلمة المرور"
              disabled={resetAccountPassword.isPending}
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedTeacher(teacher);
                toggleTeacherStatus();
              }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                teacher.is_active
                  ? "text-(--brand-secondary) bg-blue-50 hover:bg-blue-100"
                  : "text-gray-400 bg-gray-50 hover:bg-gray-100"
              }`}
              title={teacher.is_active ? "إلغاء التفعيل" : "تفعيل المعلم"}
            >
              {teacher.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => {
                navigate(`/dashboard/teachers/edit/${teacher.id}`);
              }}
              className="p-2 text-gray-400 hover:text-(--brand) hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
              title="تعديل المعلم"
            >
              <Edit size={16} />
            </button>

            {/* Delete Teacher */}
            {/* <button
              onClick={() => handleDeleteTeacher()}
              className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="حذف المعلم"
            >
              <Trash2 size={16} />
            </button> */}
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
          <h1 className="text-2xl font-bold text-gray-800">إدارة المعلمين</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع المعلمين في المنصة
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard/teachers/add")}
            className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة معلم
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المعلمين</p>
              <p className="text-3xl font-bold text-gray-800">
                {teachersStatistics?.data?.data?.total_teachers || "-"}
              </p>
            </div>
            <Users className="w-12 h-12 text-(--brand)" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المعلمين النشطون</p>
              <p className="text-3xl font-bold text-green-600">
                {teachersStatistics?.data?.data?.active_teachers || "-"}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المعلمين غير النشطين</p>
              <p className="text-3xl font-bold text-(--brand-secondary)">
                {teachersStatistics?.data?.data?.inactive_teachers ?? "-"}
              </p>
            </div>
            <CircleX className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="grid grid-cols-5 gap-4">
          {/* Search */}
          <div className="col-span-2 relative min-w-0">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="البحث في المعلمين..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
            />
          </div>

          {/* Specialization Filter */}
          <div className="min-w-0">
            <select
              value={filters.material}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, material: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
            >
              <option value="">جميع التخصصات</option>
              {dataMaterials?.data?.data?.map((el: any) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-0">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status: e.target.value as "all" | "active" | "inactive",
                }))
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
            >
              <option value="all">جميع الحالات</option>
              <option value="true">نشط</option>
              <option value="false">غير نشط</option>
            </select>
          </div>

          {/* View Mode + Count */}
          <div className="flex flex-wrap justify-between items-center gap-3 mt-1 w-full">
            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === "table"
                    ? "bg-orange-100 text-(--brand)"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <Rows size={16} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`cursor-pointer p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-orange-100 text-(--brand)"
                    : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                <Grid size={16} />
              </button>
            </div>

            {/* Results Count */}
            {/* <div className="bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {dataTeachers?.data?.data.length} معلم
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Teachers Grid/Table */}
      {dataTeachers?.isLoading ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-(--brand)" />
        </div>
      ) : !dataTeachers?.data?.data ||
        dataTeachers?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة معلمين جدد للمنصة</p>

          <button
            onClick={() => navigate("/dashboard/teachers/add")}
            className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة معلم جديد
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataTeachers?.data?.data.map((teacher: any) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}

            {dataTeachers?.data?.data.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  لا يوجد معلمين
                </h3>

                {
                  <button
                    onClick={() => navigate("/dashboard/teachers/add")}
                    className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إضافة معلم جديد
                  </button>
                }
              </div>
            )}
          </div>
          <Pagination
            currentPage={filters.page}
            onPageChange={(page: any) =>
              setFilters((prev) => ({ ...prev, page }))
            }
            count={dataTeachers?.data?.pagination?.count}
          />
        </>
      ) : (
        <>
          {/* Table View */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المعلم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التخصص
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الطلاب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدورات
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
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataTeachers?.data?.data?.map((teacher: any) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">
                            {teacher.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher?.materials?.map(
                          (material: any, index: number, array: any) =>
                            `${material.name} ${
                              index + 1 !== array.length ? " ، " : ""
                            }`,
                        ) || "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher?.number_of_students_enrolled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher?.number_of_courses_has}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              teacher.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {teacher.is_active ? "نشط" : "غير نشط"}
                          </span>
                          {/* {teacher.isVerified && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-(--brand-secondary)">
                            مؤكد
                          </span>
                        )} */}
                          {/* ??? */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher?.mobile_number || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {teacher?.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              toggleTeacherStatus();
                            }}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              teacher.is_active
                                ? "text-(--brand-secondary) hover:bg-blue-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={
                              teacher?.is_active
                                ? "إلغاء التفعيل"
                                : "تفعيل المعلم"
                            }
                          >
                            {teacher?.is_active ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedTeacher(teacher);
                              resetPassword();
                            }}
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                            title="إعادة تعيين كلمة المرور"
                            disabled={resetAccountPassword.isPending}
                          >
                            <RefreshCw size={16} />
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/dashboard/teachers/${teacher.id}`);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Book size={16} />
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/dashboard/teachers/edit/${teacher.id}`,
                              );
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-(--brand) transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>
                          {/* <button
                          onClick={() => handleDeleteTeacher()}
                          className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={filters.page}
            onPageChange={(page: any) =>
              setFilters((prev) => ({ ...prev, page }))
            }
            count={dataTeachers?.data?.pagination?.count}
          />
        </>
      )}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="cursor-pointer absolute top-4 left-4 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              تم تعيين كلمة مرور جديدة
            </h2>

            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between mb-6">
              <span className="font-mono text-lg text-gray-700" dir="ltr">
                <div dangerouslySetInnerHTML={{ __html: newPassword }} />
              </span>
              <button
                onClick={handleCopy}
                className="cursor-pointer ml-2 p-2 rounded hover:bg-gray-200 transition"
                title="نسخ"
              >
                {copied ? (
                  <Check size={20} className="text-green-600" />
                ) : (
                  <ClipboardCopy size={20} className="text-gray-600" />
                )}
              </button>
            </div>

            <button
              onClick={() => setShowPasswordModal(false)}
              className="cursor-pointer w-full py-2 px-4 bg-(--brand) hover:bg-orange-600 text-white rounded-lg font-semibold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
