import { Save, X } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const AddSubsectionModal = ({
  handleAddSubsection,
  setShowAddModal,
  newSubsection,
  setNewSubsection,
  subsections,
  mainSections,
  getMainSectionIcon,
}: {
  handleAddSubsection: () => void;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  newSubsection: Partial<any>;
  setNewSubsection: React.Dispatch<React.SetStateAction<Partial<any>>>;
  subsections: any;
  mainSections: any;
  getMainSectionIcon: any;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            إضافة قسم فرعي جديد
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
        {/* Parent Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            القسم الأب
          </label>
          <select
            value={newSubsection.parentId || ""}
            onChange={(e) =>
              setNewSubsection({
                ...newSubsection,
                parentId: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          >
            <option value="">قسم رئيسي (بدون أب)</option>
            {subsections
              .filter((s: any) => s.level < 3)
              .map((subsection: any) => (
                <option key={subsection.id} value={subsection.id}>
                  {"  ".repeat(subsection.level - 1)}└ {subsection.name}
                </option>
              ))}
          </select>
        </div>

        {/* Subsection Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم القسم الفرعي
          </label>
          <input
            type="text"
            value={newSubsection.name || ""}
            onChange={(e) =>
              setNewSubsection({ ...newSubsection, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="أدخل اسم القسم الفرعي..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الوصف
          </label>
          <textarea
            value={newSubsection.description || ""}
            onChange={(e) =>
              setNewSubsection({
                ...newSubsection,
                description: e.target.value,
              })
            }
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
            placeholder="أدخل وصف القسم الفرعي..."
          />
        </div>

        {/* Linked Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ربط بالأقسام الرئيسية
          </label>
          <div className="grid grid-cols-2 gap-3">
            {mainSections.map((section: any) => {
              const IconComponent = getMainSectionIcon(section.id);
              const isLinked = newSubsection.linkedSections?.includes(
                section.id
              );

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    const currentLinks = newSubsection.linkedSections || [];
                    const newLinks = isLinked
                      ? currentLinks.filter((id: any) => id !== section.id)
                      : [...currentLinks, section.id];
                    setNewSubsection({
                      ...newSubsection,
                      linkedSections: newLinks,
                    });
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    isLinked
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{section.name}</span>
                </button>
              );
            })}
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
          onClick={handleAddSubsection}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          حفظ القسم
        </button>
      </div>
    </div>
  </div>
);

export default AddSubsectionModal;
