import { useState } from "react";
import {
  Plus,
  // Search,
  Edit,
  Eye,
  Users,
  UserCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Check,
  ClipboardCopy,
  X,
  Grid,
  Rows,
  CircleX,
  Wallet,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useNavigate } from "react-router";
import Pagination from "@/components/dashboard/core/Pagination";
import Spinner from "@/components/dashboard/Spinner";
import LibraryCard from "@/components/dashboard/admin/libraries/LibraryCard";

export interface Library {
  id: string;
  name: string;
  mobile_number: string;
  email: string;
  about_me: string;
  image: string | null;
  is_active: boolean;
  wallet_balance: string;
  last_password_change: string;
  last_login: string;
  created_at: string;
  updated_at: string;
}
const LibrariesPage = () => {
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();
  // filter
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 5,
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
  queryParams.append("page", filters.page?.toString());
  queryParams.append("page_size", String(filters.page_size));

  const librariesStatistics = useCustomQuery(
    "account/admin/libraries-statistics/",
    ["libraries-statistics"],
  );

  const dataLibraries = useCustomQuery(
    `account/admin/libraries/?${queryParams.toString()}`,
    ["libraries", filters],
  );

  const libraryStatus = useCustomPost(
    `/account/admin/libraries/${selectedLibrary?.id}/activate/`,
    ["libraries", "libraries-statistics"],
  );
  const resetAccountPassword = useCustomUpdate(
    `/account/admin/libraries/${selectedLibrary?.id}/reset-password/`,
    ["libraries"],
  );

  // const handleDeletelibrary = () => {
  //   if (
  //     confirm(
  //       "هل أنت متأكد من حذف هذا المكتبة؟ سيتم حذف جميع الدورات المرتبطة به."
  //     )
  //   ) {
  //     // setlibraries(libraries.filter((library) => library.id !== id));
  //   }
  // };

  const toggleLibraryStatus = () => {
    libraryStatus
      ?.mutateAsync({})
      .then((res) => {
        if (res?.status) {
          toast.success(res?.data);
        } else {
          toast.error("فشل تحديث حالة المكتبة");
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
  //     dataLibraries?.data?.data?.map((library: any) => [
  //       library.name,
  //       library.email,
  //       library.mobile_number,
  //       library?.materials?.map((el: any) => el?.name).join(", "),
  //       library.is_active ? "نشط" : "غير نشط",
  //       library.number_of_students_enrolled,
  //       library.number_of_courses_has,
  //     ]),
  //   ]
  //     .map((row) => row.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `libraries-${new Date().toISOString().split("T")[0]}.csv`;
  //   link.click();
  // };

  return (
    <div
      className="space-y-6 flex flex-col items-start justify-start w-full"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة المكتبات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع المكتبات في المنصة
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={exportToExcel}
            className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Download size={16} />
            تصدير Excel
          </button> */}
          <button
            onClick={() => navigate("/dashboard/libraries/add")}
            className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة مكتبة
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي المكتبات</p>
              <p className="text-3xl font-bold text-gray-800">
                {librariesStatistics?.data?.data?.total_libraries ?? "-"}
              </p>
            </div>
            <Users className="w-12 h-12 text-(--brand)" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المكتبات النشطون</p>
              <p className="text-3xl font-bold text-green-600">
                {librariesStatistics?.data?.data?.active_libraries ?? "-"}
              </p>
            </div>
            <UserCheck className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المكتبات غير النشطين</p>
              <p className="text-3xl font-bold text-(--brand-secondary)">
                {librariesStatistics?.data?.data?.inactive_libraries ?? "-"}
              </p>
            </div>
            <CircleX className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand) w-full">
        {/* Search
          <div className="col-span-2 relative min-w-0">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="البحث في المكتبات..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
            />
          </div> */}

        {/* View Mode + Count */}
        <div className="flex justify-between items-center gap-3 mt-1 w-full">
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
          <div className="bg-gray-50 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              {dataLibraries?.data?.pagination.count} مكتبة
            </span>
          </div>
        </div>
      </div>

      {/* libraries Grid/Table */}
      {dataLibraries?.isLoading ? (
        <div className="flex justify-center w-full">
          <Spinner size={40} thickness={4} className="text-(--brand)" />
        </div>
      ) : !dataLibraries?.data?.data ||
        dataLibraries?.data?.data?.length === 0 ? (
        <div className="col-span-full w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة مكتبات جدد للمنصة</p>

          <button
            onClick={() => navigate("/dashboard/libraries/add")}
            className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة مكتبة جديد
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {dataLibraries?.data?.data.map((library: any) => (
              <LibraryCard
                key={library.id}
                library={library}
                resetAccountPassword={resetAccountPassword}
                resetPassword={resetPassword}
                setSelectedLibrary={setSelectedLibrary}
                toggleLibraryStatus={toggleLibraryStatus}
              />
            ))}

            {dataLibraries?.data?.data.length === 0 && (
              <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  لا يوجد مكتبات
                </h3>

                {
                  <button
                    onClick={() => navigate("/dashboard/libraries/add")}
                    className="cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Plus size={16} />
                    إضافة مكتبة جديد
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
            count={dataLibraries?.data?.pagination?.count}
            pageSize={filters.page_size}
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
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      المكتبة
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      رصيد المكتبة الحالي
                    </th>
                    <th className="px-6 py-3 text-right text-xs whitespace-nowrap font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dataLibraries?.data?.data?.map((library: Library) => (
                    <tr key={library.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-900">
                            {library.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              library.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {library.is_active ? "نشط" : "غير نشط"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {library?.mobile_number || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {library?.email || "-"}
                      </td>{" "}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {library?.wallet_balance || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedLibrary(library);
                              toggleLibraryStatus();
                            }}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              library.is_active
                                ? "text-(--brand-secondary) hover:bg-blue-100"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={
                              library?.is_active
                                ? "إلغاء التفعيل"
                                : "تفعيل المكتبة"
                            }
                          >
                            {library?.is_active ? (
                              <CheckCircle size={16} />
                            ) : (
                              <XCircle size={16} />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedLibrary(library);
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
                              navigate(`/dashboard/libraries/${library.id}`);
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/dashboard/libraries/edit/${library.id}`,
                              );
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-(--brand) transition-colors"
                            title="تعديل"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => {
                              navigate(
                                `/dashboard/libraries/wallet/${library.id}`,
                              );
                            }}
                            className="cursor-pointer p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="المحفظة"
                          >
                            <Wallet size={16} />
                          </button>
                          {/* <button
                          onClick={() => handleDeletelibrary()}
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
            count={dataLibraries?.data?.pagination?.count}
            pageSize={filters.page_size}
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

export default LibrariesPage;
