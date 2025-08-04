import { Save, X } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const LinkSectionsModal = ({
  setShowLinkModal,
  getMainSectionColor,
  getMainSectionIcon,
  mainSections,
  selectedSubsection,
  setSelectedSubsection,
  updateLinkedSections,
}: {
  handleAddSubsection: () => void;
  setShowLinkModal: any;
  getMainSectionColor: any;
  getMainSectionIcon: any;
  mainSections: any[];
  selectedSubsection: any;
  setSelectedSubsection: any;
  updateLinkedSections: any;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            ربط بالأقسام الرئيسية
          </h2>
          <button
            onClick={() => setShowLinkModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {selectedSubsection && (
        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">
              {selectedSubsection.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {selectedSubsection.description}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">
              اختر الأقسام الرئيسية للربط:
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {mainSections.map((section) => {
                const IconComponent = getMainSectionIcon(section.id);
                const colorClass = getMainSectionColor(section.id);
                const isLinked = selectedSubsection.linkedSections.includes(
                  section.id
                );

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      const newLinks = isLinked
                        ? selectedSubsection.linkedSections.filter(
                            (id: any) => id !== section.id
                          )
                        : [...selectedSubsection.linkedSections, section.id];
                      setSelectedSubsection({
                        ...selectedSubsection,
                        linkedSections: newLinks,
                      });
                    }}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      isLinked
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComponent size={24} className={colorClass} />
                    <div className="flex-1 text-right">
                      <h5 className="font-medium text-gray-800">
                        {section.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.isFree && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          مجاني
                        </span>
                      )}
                      {isLinked && (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                          مرتبط
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
        <button
          onClick={() => setShowLinkModal(false)}
          className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={() => {
            if (selectedSubsection) {
              updateLinkedSections(
                selectedSubsection.id,
                selectedSubsection.linkedSections
              );
              setShowLinkModal(false);
              setSelectedSubsection(null);
            }
          }}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          حفظ الروابط
        </button>
      </div>
    </div>
  </div>
);

export default LinkSectionsModal;
