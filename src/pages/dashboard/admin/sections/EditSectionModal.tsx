import { Save, ToggleLeft, ToggleRight, X } from "lucide-react";

export const EditSectionModal = ({
  setShowEditModal,
  setSelectedSection,
  selectedSection,
  icons,
  colors,
  handleEditSection,
  isPending,
}: {
  setShowEditModal: any;
  setSelectedSection: any;
  selectedSection: any;
  icons: any;
  colors: any;
  handleEditSection: any;
  isPending: boolean;
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
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
                      ? "border-(--brand) bg-gray-50 text-(--brand)"
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
                      ? "border-(--brand) bg-gray-50"
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
          disabled={isPending}
          className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          حفظ التغييرات
        </button>
      </div>
    </div>
  </div>
);
