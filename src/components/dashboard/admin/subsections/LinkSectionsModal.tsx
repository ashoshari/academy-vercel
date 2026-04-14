import { useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { Save, X } from "lucide-react";
import toast from "react-hot-toast";
import React from "react";

interface LinkSectionsModalProps {
  setShowLinkModal: (s: boolean) => void;
  getMainSectionColor: (id: string) => string;
  getMainSectionIcon: (id: string) => React.ElementType;
  mainSections: any[];
  selectedSubsection: any;
  setSelectedSubsection: (s: any) => void;
}

const LinkSectionsModal: React.FC<LinkSectionsModalProps> = ({
  setShowLinkModal,
  // getMainSectionColor,
  // getMainSectionIcon,
  mainSections,
  selectedSubsection,
  setSelectedSubsection,
}) => {
  const linkedIds: string[] = React.useMemo(
    () =>
      (selectedSubsection.sections || []).map((s: any) =>
        typeof s === "string" || typeof s === "number" ? String(s) : s.id,
      ),
    [selectedSubsection.sections],
  );

  const editSubSection = useCustomUpdate(
    `/training/admin/subsections/${selectedSubsection.id}/`,
    ["subsections"],
  );

  const handleSave = async () => {
    await editSubSection
      .mutateAsync({ sections: linkedIds })
      .then((res) => {
        if (res.status) {
          toast.success(res.message ?? "تم الحفظ بنجاح");
          setShowLinkModal(false);
        } else {
          toast.error(res.message ?? "حدث خطأ");
        }
      })
      .catch((err) => handleErrorAlerts(err?.response?.data?.error));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              ربط بالأقسام الرئيسية
            </h2>
            <button
              onClick={() => setShowLinkModal(false)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {selectedSubsection && (
          <div className="p-6">
            {/* Subsection info */}
            <div className="mb-6">
              <h3 className="mb-2 font-bold text-gray-800">
                {selectedSubsection.title}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedSubsection.description}
              </p>
            </div>

            {/* Sections picker */}
            <h4 className="mb-4 font-medium text-gray-700">
              اختر الأقسام الرئيسية للربط:
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {mainSections.map((section) => {
                // const IconComponent = getMainSectionIcon(section.id);
                // const colorClass = getMainSectionColor(section.id);
                const isLinked = linkedIds.includes(section.id);

                const toggleLink = () => {
                  const newLinks = isLinked
                    ? linkedIds.filter((id) => id !== section.id)
                    : [...linkedIds, section.id];

                  setSelectedSubsection({
                    ...selectedSubsection,
                    sections: newLinks,
                  });
                };

                return (
                  <button
                    key={section.id}
                    onClick={toggleLink}
                    className={`flex items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                      isLinked
                        ? "border-(--brand) bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* <IconComponent size={24} className={colorClass} /> */}

                    <img
                      src={section.icon.icon}
                      alt="icon"
                      width={24}
                      height={24}
                    />

                    <div className="flex-1 text-right">
                      <h5
                        className="font-medium text-gray-800"
                        style={{ color: section?.color.color }}
                      >
                        {section.title}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {section.description}
                      </p>
                    </div>

                    {isLinked && (
                      <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-(--brand)">
                        مرتبط
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={() => setShowLinkModal(false)}
            className="rounded-lg border border-gray-200 px-6 py-2 text-gray-600 transition-colors hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="btn-brand-slide flex items-center gap-2 rounded-lg px-6 py-2 text-white transition-all"
          >
            <Save size={16} />
            حفظ الروابط
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkSectionsModal;
