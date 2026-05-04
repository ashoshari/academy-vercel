import { flushSync } from "react-dom";
import { useState } from "react";
import {
  Plus,
  Users,
  UserCheck,
  Check,
  ClipboardCopy,
  X,
  Grid,
  Rows,
  CircleX,
  Wallet,
  KeyRound,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useNavigate } from "react-router";
import Pagination from "@/components/dashboard/core/Pagination";
import LibraryCard from "@/components/dashboard/admin/libraries/LibraryCard";
import Skeleton from "@/components/dashboard/Skeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import DetailsButton from "@/components/dashboard/core/DetailsButton";
import EditButton from "@/components/dashboard/core/EditButton";
import RefreshButton from "@/components/dashboard/core/RefreshButton";

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
  const [selectedLibraryId, setSelectedLibraryId] = useState<
    string | number | null
  >(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingLibraryStatusToggle, setPendingLibraryStatusToggle] = useState<{
    id: string | number;
    isActive: boolean;
    name: string;
  } | null>(null);
  const [pendingPasswordReset, setPendingPasswordReset] = useState<Library | null>(
    null,
  );

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
  const isLoadingStatistics = Boolean((librariesStatistics as any)?.isLoading);

  const dataLibraries = useCustomQuery(
    `account/admin/libraries/?${queryParams.toString()}`,
    ["libraries", filters],
  );

  const libraryStatus = useCustomPost(
    `/account/admin/libraries/${selectedLibraryId ?? "noop"}/activate/`,
    ["libraries", "libraries-statistics"],
  );
  const resetAccountPassword = useCustomUpdate(
    `/account/admin/libraries/${selectedLibrary?.id}/reset-password/`,
    ["libraries"],
  );

  const toggleLibraryStatus = () => {
    libraryStatus
      ?.mutateAsync({})
      .then((res) => {
        if (res?.status) {
          toast.success(res?.data);
          setPendingLibraryStatusToggle(null);
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

  const requestLibraryStatusToggle = (library: Library) => {
    setSelectedLibrary(library);
    setSelectedLibraryId(library?.id ?? null);
    setPendingLibraryStatusToggle({
      id: library.id,
      isActive: Boolean(library.is_active),
      name: String(library.name ?? ""),
    });
  };

  const requestPasswordReset = (library: Library) => {
    setPendingPasswordReset(library);
  };

  const confirmPasswordReset = async () => {
    if (!pendingPasswordReset) return;
    const library = pendingPasswordReset;
    flushSync(() => {
      setSelectedLibrary(library);
    });
    try {
      const res = await resetAccountPassword.mutateAsync({});
      if (res.status) {
        toast.success(res?.data?.message);
        setNewPassword(res?.data?.new_password);
        setShowPasswordModal(true);
        setPendingPasswordReset(null);
      } else {
        toast.error(res.error);
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.message ||
          "حدث خطأ أثناء إعادة تعيين كلمة المرور",
      );
    }
  };

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
          <button
            onClick={() => navigate("/dashboard/libraries/add")}
            className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            إضافة مكتبة
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoadingStatistics ? (
        <StatsCardsSkeleton
          count={3}
          gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
        />
      ) : (
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
      )}

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand) w-full">
        {/* View Mode + Count */}
        <div className="flex justify-between items-center gap-3 mt-1 w-full">
          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-gray-100 text-(--brand)"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-100 text-(--brand)"
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
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-96 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="w-full">
            <TableSkeleton rows={10} header={false} />
          </div>
        )
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
            className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
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
                requestPasswordReset={requestPasswordReset}
                toggleLibraryStatus={() => requestLibraryStatusToggle(library)}
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
                    className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
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
                          <StatusToggleButton
                            isOn={Boolean(library?.is_active)}
                            onToggle={() => {
                              requestLibraryStatusToggle(library);
                            }}
                            titleOn="إلغاء التفعيل"
                            titleOff="تفعيل المكتبة"
                          />

                          <RefreshButton
                            onClick={() => requestPasswordReset(library)}
                            title="إعادة تعيين كلمة المرور"
                            disabled={resetAccountPassword.isPending}
                          />
                          <DetailsButton
                            onClick={() => {
                              navigate(`/dashboard/libraries/${library.id}`);
                            }}
                          />
                          <EditButton
                            onClick={() => {
                              navigate(
                                `/dashboard/libraries/edit/${library.id}`,
                              );
                            }}
                          />

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
              className="btn-brand-slide cursor-pointer w-full py-2 px-4 text-white rounded-lg font-semibold"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {pendingPasswordReset && (
        <ConfirmationModal
          open
          onClose={() =>
            !resetAccountPassword.isPending && setPendingPasswordReset(null)
          }
          onConfirm={confirmPasswordReset}
          title="تأكيد إعادة تعيين كلمة المرور"
          variant="danger"
          icon={KeyRound}
          confirmLabel="نعم، إعادة تعيين كلمة المرور"
          isPending={resetAccountPassword.isPending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد إعادة تعيين كلمة مرور المكتبة{" "}
                <span className="font-bold text-(--brand-secondary)">
                  {pendingPasswordReset.name}
                </span>
                ؟
              </p>
              <p className="text-sm text-amber-900/90 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-3">
                سيتم إنشاء كلمة مرور جديدة وعرضها لك بعد التأكيد، ولن تتمكن من
                استرجاع كلمة المرور القديمة.
              </p>
            </>
          }
        />
      )}

      {pendingLibraryStatusToggle && (
        <ConfirmationModal
          open
          onClose={() =>
            !libraryStatus.isPending && setPendingLibraryStatusToggle(null)
          }
          onConfirm={toggleLibraryStatus}
          title={
            pendingLibraryStatusToggle.isActive
              ? "إلغاء تفعيل المكتبة"
              : "تفعيل المكتبة"
          }
          variant={pendingLibraryStatusToggle.isActive ? "danger" : "success"}
          confirmLabel={
            pendingLibraryStatusToggle.isActive
              ? "نعم، إلغاء التفعيل"
              : "نعم، تفعيل"
          }
          isPending={libraryStatus.isPending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingLibraryStatusToggle.isActive
                    ? "إلغاء تفعيل"
                    : "تفعيل"}
                </span>{" "}
                المكتبة{" "}
                <span className="font-bold text-(--brand-secondary)">
                  {pendingLibraryStatusToggle.name}
                </span>
                ؟
              </p>
              {pendingLibraryStatusToggle.isActive ? (
                <p className="text-sm text-amber-900/90 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-3">
                  لن تتمكن المكتبة من استخدام المنصة حتى تقوم بإعادة تفعيلها.
                </p>
              ) : (
                <p className="text-sm text-emerald-900/90 bg-emerald-50 border border-emerald-100 rounded-xl p-3 mt-3">
                  بعد التفعيل ستتمكن المكتبة من استخدام المنصة بشكل طبيعي.
                </p>
              )}
            </>
          }
        />
      )}
    </div>
  );
};

export default LibrariesPage;
