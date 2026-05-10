import { useState } from "react";
import { Plus, BookOpen, Calendar, Search, Rows, Grid } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import Skeleton from "@/components/dashboard/Skeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import EmptyState from "@/components/core/EmptyState";
import { AddSectionModal } from "./AddSectionModal";
import { EditSectionModal } from "./EditSectionModal";
import { ConfirmToggleModal } from "./ConfirmToggleModal";
import EditButton from "@/components/dashboard/core/EditButton";

export interface MainSection {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  isFree: boolean;
  isEnabled: boolean;
  studentsCount: number;
  itemsCount: number;
  createdAt: string;
}

const SectionsPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState<MainSection | null>(
    null,
  );
  const [confirmToggleModal, setConfirmToggleModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  // const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [newSection, setNewSection] = useState<Partial<MainSection>>({
    name: "",
    description: "",
    icon: "",
    color: "",
    isEnabled: true,
  });

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("title", searchTerm);
  // if (page) queryParams.append("page", page.toString());

  const queryString = queryParams.toString();
  const sections = useCustomQuery(`/training/admin/sections/?${queryString}`, [
    "sections",
    searchTerm,
    // page,
  ]);
  const statistics = useCustomQuery("/training/admin/sections-statistics/", [
    "sections-statistics",
  ]);
  const isLoadingStatistics = Boolean((statistics as any)?.isLoading);

  // const paginationData = sections.data?.pagination;
  const icons = useCustomQuery("/core/icons/", ["icons"]);
  const colors = useCustomQuery("/core/colors/", ["colors"]);

  const { mutateAsync: addSection, isPending } = useCustomPost(
    "/training/admin/sections/",
    ["sections", "sections-statistics"],
  );

  const { mutateAsync: editSection, isPending: isEditPending } =
    useCustomUpdate(`/training/admin/sections/${selectedSection?.id}/`, [
      "sections",
      "sections-statistics",
    ]);

  const handleAddSection = () => {
    addSection({
      title: newSection.name,
      description: newSection.description,
      icon: newSection.icon,
      color: newSection.color,
      is_published: newSection.isEnabled,
      // order: 2,
    })
      .then((res) => {
        if (res.status) {
          setNewSection({
            name: "",
            description: "",
            icon: " ",
            color: " ",
            isFree: true,
            isEnabled: true,
          });
          setShowAddModal(false);
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      })
      .catch((error) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطاء في اضافة القسم",
        );
      });
  };

  const handleEditSection = () => {
    if (!selectedSection) {
      return;
    }

    editSection({
      title: selectedSection.name,
      description: selectedSection.description,
      icon: selectedSection.icon,
      color: selectedSection.color,
      is_published: selectedSection.isEnabled,
      // order: 2,
    })
      .then((res) => {
        if (res.status) {
          setShowEditModal(false);
          setSelectedSection(null);
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      })
      .catch((error) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطاء في اضافة القسم",
        );
      });
  };

  const toggleSectionStatus = () => {
    if (!selectedSection) {
      return;
    }

    editSection({
      is_published: !selectedSection.isEnabled,
    })
      .then((res) => {
        if (res.status) {
          setSelectedSection(null);
          setConfirmToggleModal(false);
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      })
      .catch((error) => {
        handleErrorAlerts(
          error?.response?.data?.error || "حدث خطاء في اضافة القسم",
        );
      });
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الأقسام الرئيسية</h1>
          <p className="text-gray-600 text-sm">
            إدارة أقسام المنصة التعليمية الرئيسية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة قسم رئيسي جديد
        </button>
      </div>
      <div className="flex gap-x-2.5">
        {/* Search and Stats */}
        <div className="w-full">
          <div className="flex gap-x-2.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
            <div className="w-full relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الأقسام..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
              />
            </div>
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
          </div>
        </div>
      </div>
      {isLoadingStatistics ? (
        <StatsCardsSkeleton
          count={3}
          gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-4"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-(--brand)">
              {statistics?.data?.data?.total_sections ?? "-"}
            </p>
            <p className="text-sm text-gray-600">إجمالي الأقسام</p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-green-600">
              {statistics?.data?.data?.active_sections ?? "-"}
            </p>
            <p className="text-sm text-gray-600">الأقسام المفعلة</p>
          </div>{" "}
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-red-600">
              {statistics?.data?.data?.inactive_sections ?? "-"}
            </p>
            <p className="text-sm text-gray-600">الأقسام الغير مفعلة</p>
          </div>
        </div>
      )}

      {sections?.isLoading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-96 rounded-xl" />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={10} header={false} />
        )
      ) : !sections?.data?.data || sections?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <EmptyState
            title="لا توجد نتائج"
            description="ابدأ بإضافة أقسام رئيسية جديدة للمنصة"
            size="md"
            action={
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة قسم رئيسي جديد
              </button>
            }
          />
        </div>
      ) : // Sections Grid
      viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections?.data?.data?.map((section: any) => {
            // const colorClass = getColorClass(section.color.color);
            return (
              <div
                key={section.id}
                className="flex flex-col bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group"
              >
                {/* Header */}
                <div
                  style={{ backgroundColor: section.color.color }}
                  className={`h-[60%] p-6 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                  <div className="relative z-10 h-[60%]">
                    <div className="flex items-center justify-between mb-4">
                      {section.icon.icon ? (
                        <img
                          src={section.icon.icon}
                          alt={section.icon.name}
                          className="w-8 h-8"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{section?.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {section?.description || "-"}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          section.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {section.is_published ? "مفعل" : "معطل"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{formatDate(section.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-end gap-1">
                      <StatusToggleButton
                        isOn={Boolean(section.is_published)}
                        onToggle={() => {
                          setSelectedSection({
                            id: section.id,
                            name: section.title,
                            description: section.description,
                            icon: section.icon.id,
                            color: section.color.id,
                            isFree: section.isFree ?? false,
                            isEnabled: section.is_published,
                            studentsCount: section.studentsCount ?? 0,
                            itemsCount: section.itemsCount ?? 0,
                            createdAt: section.created_at,
                          });

                          setConfirmToggleModal(true);
                        }}
                        titleOn="تعطيل القسم"
                        titleOff="تفعيل القسم"
                      />
                      {/* Edit */}

                      <EditButton
                        onClick={() => {
                          setSelectedSection({
                            id: section.id,
                            name: section.title,
                            description: section.description,
                            icon: section.icon.id,
                            color: section.color.id,
                            isFree: section.isFree ?? false,
                            isEnabled: section.is_published,
                            studentsCount: section.studentsCount ?? 0,
                            itemsCount: section.itemsCount ?? 0,
                            createdAt: section.created_at,
                          });
                          setShowEditModal(true);
                        }}
                        title="تعديل القسم"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {sections?.data?.data.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />

              <p className="text-gray-500 mb-6">
                "ابدأ بإضافة قسم رئيسي جديد للمنصة"
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة قسم جديد
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Table View */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الأيقونة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الوصف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الإنشاء
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 overflow-x-auto">
                  {sections?.data?.data?.map((section: any) => (
                    <tr key={section?.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {section?.icon && (
                            <img
                              loading="lazy"
                              src={section?.icon?.icon}
                              alt={section?.icon?.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {section?.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {section?.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(section?.created_at) || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              section?.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {section?.is_published ? "منشور" : "مسودة"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <StatusToggleButton
                            isOn={Boolean(section.is_published)}
                            onToggle={() => {
                              setSelectedSection({
                                id: section.id,
                                name: section.title,
                                description: section.description,
                                icon: section.icon.id,
                                color: section.color.id,
                                isFree: section.isFree ?? false,
                                isEnabled: section.is_published,
                                studentsCount: section.studentsCount ?? 0,
                                itemsCount: section.itemsCount ?? 0,
                                createdAt: section.created_at,
                              });

                              setConfirmToggleModal(true);
                            }}
                            titleOn="تعطيل القسم"
                            titleOff="تفعيل القسم"
                          />
                          <EditButton
                            onClick={() => {
                              setSelectedSection({
                                id: section.id,
                                name: section.title,
                                description: section.description,
                                icon: section.icon.id,
                                color: section.color.id,
                                isFree: section.isFree ?? false,
                                isEnabled: section.is_published,
                                studentsCount: section.studentsCount ?? 0,
                                itemsCount: section.itemsCount ?? 0,
                                createdAt: section.created_at,
                              });
                              setShowEditModal(true);
                            }}
                            title="تعديل القسم"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddSectionModal
          colors={colors?.data?.data}
          icons={icons?.data?.data}
          handleAddSection={handleAddSection}
          newSection={newSection}
          setNewSection={setNewSection}
          setShowAddModal={setShowAddModal}
          isPending={isPending}
        />
      )}
      {showEditModal && (
        <EditSectionModal
          colors={colors?.data?.data}
          icons={icons?.data?.data}
          handleEditSection={handleEditSection}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          setShowEditModal={setShowEditModal}
          isPending={isEditPending}
        />
      )}

      {confirmToggleModal && (
        <ConfirmToggleModal
          onClose={() => setConfirmToggleModal(false)}
          onConfirm={async () => {
            toggleSectionStatus();
          }}
          sectionName={selectedSection?.name ?? ""}
          isEnabled={selectedSection?.isEnabled ?? false}
          isPending={isEditPending}
        />
      )}
    </div>
  );
};

export default SectionsPage;
