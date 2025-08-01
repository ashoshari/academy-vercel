import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  BookOpen,
  FileText,
  GraduationCap,
  CreditCard,
  DollarSign,
  Users,
  Calendar,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";

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
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  const [newSection, setNewSection] = useState<Partial<MainSection>>({
    name: "",
    description: "",
    icon: "BookOpen",
    color: "blue",
    isFree: true,
    isEnabled: true,
  });

  const sections = useCustomQuery("/training/admin/sections/", [
    "/training/admin/sections/",
  ]);

  const iconOptions = [
    { value: "BookOpen", label: "امتحانات", icon: BookOpen },
    { value: "FileText", label: "أسئلة وزارية", icon: FileText },
    { value: "GraduationCap", label: "دورات", icon: GraduationCap },
    { value: "CreditCard", label: "بطاقات", icon: CreditCard },
  ];

  const colorOptions = [
    { value: "blue", label: "أزرق", class: "bg-blue-500" },
    { value: "green", label: "أخضر", class: "bg-green-500" },
    { value: "purple", label: "بنفسجي", class: "bg-purple-500" },
    { value: "red", label: "أحمر", class: "bg-red-500" },
    { value: "yellow", label: "أصفر", class: "bg-yellow-500" },
    { value: "pink", label: "وردي", class: "bg-pink-500" },
  ];

  // Filter sections based on search term
  //   const filteredSections = sections.filter(
  //     (section) =>
  //       section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       section.description.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((option) => option.value === iconName);
    return iconOption ? iconOption.icon : BookOpen;
  };

  const getColorClass = (color: string) => {
    const colorOption = colorOptions.find((option) => option.value === color);
    return colorOption ? colorOption.class : "bg-blue-500";
  };

  const handleAddSection = () => {
    if (newSection.name && newSection.description) {
      //   setSections([...sections, section]);
      setNewSection({
        name: "",
        description: "",
        icon: "BookOpen",
        color: "blue",
        isFree: true,
        isEnabled: true,
      });
      setShowAddModal(false);
    }
  };

  const handleEditSection = () => {
    if (
      selectedSection &&
      selectedSection.name &&
      selectedSection.description
    ) {
      //   setSections(
      //     sections.map((section) =>
      //       section.id === selectedSection.id ? selectedSection : section
      //     )
      //   );
      setShowEditModal(false);
      setSelectedSection(null);
    }
  };

  const handleDeleteSection = () => {
    if (
      confirm(
        "هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأقسام الفرعية المرتبطة به."
      )
    ) {
      //   setSections(sections.filter((section) => section.id !== id));
    }
  };

  const toggleSectionStatus = () => {
    // setSections(
    //   sections.map((section) =>
    //     section.id === id ? { ...section, [field]: !section[field] } : section
    //   )
    // );
  };

  const AddSectionModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إضافة قسم رئيسي جديد
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
              {iconOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setNewSection({ ...newSection, icon: option.value })
                  }
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    newSection.icon === option.value
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <option.icon size={20} />
                  <span>{option.label}</span>
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
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setNewSection({ ...newSection, color: option.value })
                  }
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    newSection.color === option.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${option.class}`}></div>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">مجاني</p>
                <p className="text-sm text-gray-500">متاح بدون رسوم</p>
              </div>
              <button
                onClick={() =>
                  setNewSection({ ...newSection, isFree: !newSection.isFree })
                }
                className={`p-1 rounded-full transition-colors ${
                  newSection.isFree ? "text-green-600" : "text-gray-400"
                }`}
              >
                {newSection.isFree ? (
                  <ToggleRight size={24} />
                ) : (
                  <ToggleLeft size={24} />
                )}
              </button>
            </div>

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
                className={`p-1 rounded-full transition-colors ${
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
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleAddSection}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ القسم
          </button>
        </div>
      </div>
    </div>
  );

  const EditSectionModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">تعديل القسم</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                {iconOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSelectedSection({
                        ...selectedSection,
                        icon: option.value,
                      })
                    }
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedSection.icon === option.value
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <option.icon size={20} />
                    <span>{option.label}</span>
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
                {colorOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setSelectedSection({
                        ...selectedSection,
                        color: option.value,
                      })
                    }
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      selectedSection.color === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${option.class}`}
                    ></div>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">مجاني</p>
                  <p className="text-sm text-gray-500">متاح بدون رسوم</p>
                </div>
                <button
                  onClick={() =>
                    setSelectedSection({
                      ...selectedSection,
                      isFree: !selectedSection.isFree,
                    })
                  }
                  className={`p-1 rounded-full transition-colors ${
                    selectedSection.isFree ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {selectedSection.isFree ? (
                    <ToggleRight size={24} />
                  ) : (
                    <ToggleLeft size={24} />
                  )}
                </button>
              </div>

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
                  className={`p-1 rounded-full transition-colors ${
                    selectedSection.isEnabled
                      ? "text-green-600"
                      : "text-gray-400"
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
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleEditSection}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">الأقسام الرئيسية</h1>
          <p className="text-gray-600 text-sm">
            إدارة أقسام المنصة التعليمية الرئيسية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة قسم جديد
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في الأقسام..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {/* {sections.length} */}1
          </p>
          <p className="text-sm text-gray-600">إجمالي الأقسام</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {/* {sections.filter((s) => s.isEnabled).length} */}1
          </p>
          <p className="text-sm text-gray-600">الأقسام المفعلة</p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections?.data?.data?.map((section: any) => {
          const IconComponent = getIconComponent(section.icon);
          const colorClass = getColorClass(section.color);

          return (
            <div
              key={section.id}
              className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header */}
              <div
                className={`${colorClass} p-6 text-white relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <div className="flex gap-2">
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
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{section.name}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">
                    {section.description}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
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
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        section.isEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {section.isEnabled ? "مفعل" : "معطل"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    <span>{section.createdAt}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {/* Toggle Status */}
                    <button
                      onClick={() => toggleSectionStatus()}
                      className={`p-2 rounded-lg transition-colors ${
                        section.isEnabled
                          ? "text-green-600 bg-green-50 hover:bg-green-100"
                          : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                      }`}
                      title={section.isEnabled ? "تعطيل القسم" : "تفعيل القسم"}
                    >
                      {section.isEnabled ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>

                    {/* Toggle Free/Paid */}
                    <button
                      onClick={() => toggleSectionStatus()}
                      className={`p-2 rounded-lg transition-colors ${
                        section.isFree
                          ? "text-green-600 bg-green-50 hover:bg-green-100"
                          : "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                      }`}
                      title={
                        section.isFree ? "جعل القسم مدفوع" : "جعل القسم مجاني"
                      }
                    >
                      <DollarSign size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedSection(section);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="تعديل القسم"
                    >
                      <Edit size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSection()}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف القسم"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {sections?.data?.count === 0 && (
          <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm ? "لا توجد نتائج" : "لا توجد أقسام"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "لم يتم العثور على أقسام تطابق البحث"
                : "ابدأ بإضافة قسم رئيسي جديد للمنصة"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة قسم جديد
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && <AddSectionModal />}
      {showEditModal && <EditSectionModal />}
    </div>
  );
};

export default SectionsPage;
