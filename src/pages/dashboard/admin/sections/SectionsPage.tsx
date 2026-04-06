import { useState } from "react";
import {
  Plus,
  Edit,
  Save,
  X,
  BookOpen,
  Calendar,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Search,
  Rows,
  Grid,
  Users,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDate } from "@/services/date";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import Spinner from "@/components/dashboard/Spinner";
// import { formatDateTimeSimple } from "@/utils/formatDateTime";
// import Pagination from "@/components/dashboard/core/Pagination";

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

const AddSectionModal = ({
  setShowAddModal,
  setNewSection,
  newSection,
  icons,
  colors,
  handleAddSection,
}: {
  setShowAddModal: any;
  setNewSection: any;
  newSection: any;
  icons: any;
  colors: any;
  handleAddSection: any;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إضافة قسم رئيسي جديد
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم القسم
            </label>
            <input
              type="text"
              value={newSection.name || ""}
              onChange={(e) =>
                setNewSection({ ...newSection, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="أدخل اسم القسم..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              value={newSection.description || ""}
              onChange={(e) =>
                setNewSection({ ...newSection, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="أدخل وصف القسم..."
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              الأيقونة
            </label>
            <div className="grid grid-cols-2 gap-3">
              {icons?.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setNewSection({ ...newSection, icon: option.id })
                  }
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    newSection.icon === option.id
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={option.icon} className="w-5" />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اللون
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors?.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setNewSection({ ...newSection, color: option.id })
                  }
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    newSection.color === option.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    style={{ backgroundColor: option.color }}
                    className={`w-4 h-4 rounded-full  `}
                  ></div>
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">مفعل</p>
                <p className="text-sm text-gray-500">متاح للطلاب</p>
              </div>
              <button
                onClick={() =>
                  setNewSection({
                    ...newSection,
                    isEnabled: !newSection.isEnabled,
                  })
                }
                className={`cursor-pointer p-1 rounded-full transition-colors ${
                  newSection.isEnabled ? "text-green-600" : "text-gray-400"
                }`}
              >
                {newSection.isEnabled ? (
                  <ToggleRight size={24} />
                ) : (
                  <ToggleLeft size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowAddModal(false)}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleAddSection}
            className="cursor-pointer px-6 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ القسم
          </button>
        </div>
      </div>
    </div>
  );
};

const EditSectionModal = ({
  setShowEditModal,
  setSelectedSection,
  selectedSection,
  icons,
  colors,
  handleEditSection,
}: {
  setShowEditModal: any;
  setSelectedSection: any;
  selectedSection: any;
  icons: any;
  colors: any;
  handleEditSection: any;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">تعديل القسم</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {selectedSection && (
        <div className="p-6 space-y-6">
          {/* Section Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم القسم
            </label>
            <input
              type="text"
              value={selectedSection.name}
              onChange={(e) =>
                setSelectedSection({
                  ...selectedSection,
                  name: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="أدخل اسم القسم..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              value={selectedSection.description}
              onChange={(e) =>
                setSelectedSection({
                  ...selectedSection,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="أدخل وصف القسم..."
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              الأيقونة
            </label>
            <div className="grid grid-cols-2 gap-3">
              {icons.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelectedSection({
                      ...selectedSection,
                      icon: option.id,
                    })
                  }
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedSection.icon === option.id
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img src={option.icon} className="w-5" alt={option.name} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اللون
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colors.map((option: any) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setSelectedSection({
                      ...selectedSection,
                      color: option.id,
                    })
                  }
                  className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    selectedSection.color === option.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    style={{ backgroundColor: option.color }}
                    className={`w-4 h-4 rounded-full  `}
                  />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">مفعل</p>
                <p className="text-sm text-gray-500">متاح للطلاب</p>
              </div>
              <button
                onClick={() =>
                  setSelectedSection({
                    ...selectedSection,
                    isEnabled: !selectedSection.isEnabled,
                  })
                }
                className={`cursor-pointer p-1 rounded-full transition-colors ${
                  selectedSection.isEnabled ? "text-green-600" : "text-gray-400"
                }`}
              >
                {selectedSection.isEnabled ? (
                  <ToggleRight size={24} />
                ) : (
                  <ToggleLeft size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
        <button
          onClick={() => setShowEditModal(false)}
          className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handleEditSection}
          className="cursor-pointer px-6 py-2 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          حفظ التغييرات
        </button>
      </div>
    </div>
  </div>
);

const ConfirmToggleModal = ({
  onClose,
  onConfirm,
  sectionName,
  isEnabled,
}: {
  onClose: () => void;
  onConfirm: () => void;
  sectionName: string;
  isEnabled: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">تأكيد الإجراء</h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-right space-y-4">
          <p className="text-gray-700 text-base font-medium">
            هل أنت متأكد من {isEnabled ? "إخفاء" : "إظهار"} القسم
            <span className="font-bold text-orange-600"> {sectionName}</span>؟
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className={`cursor-pointer px-5 py-2 rounded-lg text-white transition ${
              isEnabled
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            نعم، {isEnabled ? "إخفاء" : "إظهار"}
          </button>
        </div>
      </div>
    </div>
  );
};

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

  // const paginationData = sections.data?.pagination;
  const icons = useCustomQuery("/core/icons/", ["icons"]);
  const colors = useCustomQuery("/core/colors/", ["colors"]);

  const addSection = useCustomPost("/training/admin/sections/", [
    "sections",
    "sections-statistics",
  ]);

  const editSection = useCustomUpdate(
    `/training/admin/sections/${selectedSection?.id}/`,
    ["sections", "sections-statistics"],
  );

  const handleAddSection = () => {
    addSection
      .mutateAsync({
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

    editSection
      .mutateAsync({
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

  // const handleDeleteSection = () => {
  //   if (
  //     confirm(
  //       "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأقسام الفرعية المرتبطة به."
  //     )
  //   ) {
  //     //   setSections(sections.filter((section) => section.id !== id));
  //   }
  // };

  const toggleSectionStatus = () => {
    if (!selectedSection) {
      return;
    }

    editSection
      .mutateAsync({
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
          className="cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة قسم رئيسي جديد
        </button>
      </div>
      <div className="flex gap-x-2.5">
        {/* Search and Stats */}
        <div className="w-full">
          <div className="flex gap-x-2.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50">
            <div className="w-full relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الأقسام..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
              />
            </div>
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
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {statistics?.data?.data?.total_sections ?? "-"}
          </p>
          <p className="text-sm text-gray-600">إجمالي الأقسام</p>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {statistics?.data?.data?.active_sections ?? "-"}
          </p>
          <p className="text-sm text-gray-600">الأقسام المفعلة</p>
        </div>{" "}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-red-600">
            {statistics?.data?.data?.inactive_sections ?? "-"}
          </p>
          <p className="text-sm text-gray-600">الأقسام الغير مفعلة</p>
        </div>
      </div>

      {sections?.isLoading ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !sections?.data?.data || sections?.data?.data?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">
            ابدأ بإضافة أقسام رئيسية جديدة للمنصة
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة قسم رئيسي جديد
          </button>
        </div>
      ) : // Sections Grid
      viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections?.data?.data?.map((section: any) => {
            // const colorClass = getColorClass(section.color.color);
            return (
              <div
                key={section.id}
                className="flex flex-col bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
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
                      {/* <div className="flex gap-2">
                      {section.isFree && (
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                          مجاني
                        </span>
                      )}
                      {!section.isFree && (
                        <span className="bg-yellow-400/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <DollarSign size={12} />
                          مدفوع
                        </span>
                      )}
                    </div> */}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{section?.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {section?.description || "-"}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats */}
                  {/* <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <Users size={14} />
                      <span className="text-xs">الطلاب</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {section.studentsCount}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                      <BookOpen size={14} />
                      <span className="text-xs">العناصر</span>
                    </div>
                    <p className="text-lg font-bold text-gray-800">
                      {section.itemsCount}
                    </p>
                  </div>
                </div> */}

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
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      {/* Toggle Status */}
                      <button
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

                          setConfirmToggleModal(true);
                        }}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          section.is_published
                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                            : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                        }`}
                        title={
                          section.is_published ? "تفعيل القسم" : "تعطيل القسم"
                        }
                      >
                        {section.is_published ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <button
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
                        className="cursor-pointer p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="تعديل القسم"
                      >
                        <Edit size={16} />
                      </button>

                      {/* Delete */}
                      {/* <button
                      onClick={() => handleDeleteSection()}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف القسم"
                    >
                      <Trash2 size={16} />
                    </button> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {sections?.data?.data.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              {/* <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm ? "لا توجد نتائج" : "لا توجد أقسام"}
            </h3> */}
              <p className="text-gray-500 mb-6">
                {/* {searchTerm
                ? "لم يتم العثور على أقسام تطابق البحث"
                :  */}
                "ابدأ بإضافة قسم رئيسي جديد للمنصة"
                {/*      } */}
              </p>
              {/* {!searchTerm && ( */}
              <button
                onClick={() => setShowAddModal(true)}
                className="cursor-pointer bg-linear-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة قسم جديد
              </button>
              {/* )} */}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Table View */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden">
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
                        <div className="flex items-center gap-5">
                          <button
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

                              setConfirmToggleModal(true);
                            }}
                            className={`rounded-lg transition-colors cursor-pointer ${
                              section.is_published
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                            title={
                              section.is_published
                                ? "تفعيل القسم"
                                : "تعطيل القسم"
                            }
                          >
                            {section.is_published ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                          <button
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
                            className="cursor-pointer text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="تعديل القسم"
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
          {/* <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          /> */}
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
        />
      )}
    </div>
  );
};

export default SectionsPage;
