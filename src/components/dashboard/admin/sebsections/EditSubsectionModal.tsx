/* eslint-disable @typescript-eslint/no-explicit-any */
import { Save, X } from "lucide-react";

const EditSubsectionModal = ({
  subsections,
  handleEditSubsection,
  setShowEditModal,
  setSelectedSubsection,
  selectedSubsection,
}: {
  subsections: any;
  handleEditSubsection: () => void;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSubsection: any;
  selectedSubsection: any;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            تعديل القسم الفرعي
          </h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {selectedSubsection && (
        <div className="p-6 space-y-6">
          {/* Parent Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              القسم الأب
            </label>
            <select
              value={selectedSubsection.parentId || ""}
              onChange={(e) =>
                setSelectedSubsection({
                  ...selectedSubsection,
                  parentId: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="">قسم رئيسي (بدون أب)</option>
              {subsections
                .filter(
                  (s: any) => s.level < 3 && s.id !== selectedSubsection.id
                )
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
              value={selectedSubsection.name}
              onChange={(e) =>
                setSelectedSubsection({
                  ...selectedSubsection,
                  name: e.target.value,
                })
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
              value={selectedSubsection?.description}
              onChange={(e) =>
                setSelectedSubsection({
                  ...selectedSubsection,
                  description: e.target.value,
                })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="أدخل وصف القسم الفرعي..."
            />
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
          onClick={handleEditSubsection}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          حفظ التغييرات
        </button>
      </div>
    </div>
  </div>
);

export default EditSubsectionModal;
