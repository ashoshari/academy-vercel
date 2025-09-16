import { Save, ToggleLeft, ToggleRight, X } from "lucide-react";
import MultiSelectAutocomplete from "./MultiSelector";

/* eslint-disable @typescript-eslint/no-explicit-any */
const AddSubsectionModal = ({
  onSave,
  onClose,
  onChange,
  data,
  mainSections,
  parent,
  level,
  selectedSubSubsection,
  type,
}: {
  onSave: () => void;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  onChange: React.Dispatch<React.SetStateAction<any>>;
  data: any;
  mainSections?: any;
  parent?: any;
  level: "sub" | "subsub" | "spec" | "mat";
  selectedSubSubsection?: any;
  type?: any;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {level === "spec"
              ? "اضافة تخصص جديد"
              : level === "mat"
              ? "اضافة مادة جديدة"
              : "إضافة قسم فرعي جديد"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Parent Selection */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاقسام الرئيسية
          </label>
          {level === "sub" ? (
            <MultiSelectAutocomplete
              options={mainSections}
              value={data.sections || []}
              onChange={(ids) => onChange({ ...data, sections: ids })}
              placeholder="اربطه مع قسم رئيسي او اكثر"
            />
          ) : level === "subsub" ? (
            <p>
              اضافة قسم فرعي الي القسم الفرعي ({" "}
              <strong>{parent?.title ?? ""}</strong> )
            </p>
          ) : level === "spec" ? (
            <p>
              اضافة تخصص الي القسم الفرعي ({" "}
              <strong>{parent?.title ?? ""}</strong> )
            </p>
          ) : (
            <p>
              اضافة مادة الي {type === "material-subsub" ? "القسم" : "التخصص"}
              {" ( "}
              <strong>
                {selectedSubSubsection
                  ? selectedSubSubsection.title
                  : parent?.name}
              </strong>
              {"  ) "}
            </p>
          )}
        </div>
        {/* Subsection Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {level === "spec"
              ? "اسم التخصص"
              : level === "mat"
              ? "اسم المادة"
              : "اسم القسم الفرعي"}
          </label>
          {level === "spec" ? (
            <input
              type="text"
              value={data.name || ""}
              onChange={(e) => onChange({ ...data, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="ادخل اسم التخصص..."
            />
          ) : level === "mat" ? (
            <input
              type="text"
              value={data.material || ""}
              onChange={(e) => onChange({ ...data, material: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="ادخل اسم المادة..."
            />
          ) : (
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              placeholder="ادخل اسم القسم الفرعي..."
            />
          )}
        </div>

        {/* Description */}
        {level !== "mat" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف
              </label>
              <textarea
                value={data.description || ""}
                onChange={(e) =>
                  onChange({
                    ...data,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                placeholder="أدخل الوصف..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الترتيب
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                lang="en"
                value={data.order || 0}
                onChange={(e) => onChange({ ...data, order: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="أدخل الترتيب..."
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">
              {data.is_published ? "مفعل" : "معطل"}
            </p>
            <p className="text-sm text-gray-500">
              {data.is_published ? "متاح للطلاب" : "غير متاح للطلاب"}
            </p>
          </div>
          <button
            onClick={() =>
              onChange({
                ...data,
                is_published: !data.is_published,
              })
            }
            className={`p-1 rounded-full transition-colors ${
              data.is_published ? "text-green-600" : "text-gray-400"
            }`}
          >
            {data.is_published ? (
              <ToggleRight size={24} />
            ) : (
              <ToggleLeft size={24} />
            )}
          </button>
        </div>

        {/* Linked Sections */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ربط بالأقسام الرئيسية
          </label>
          <div className="grid grid-cols-2 gap-3">
            {mainSections.map((section: any) => {
              const IconComponent = getMainSectionIcon(section.id);
              const isLinked = data.linkedSections?.includes(
                section.id
              );

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    const currentLinks = data.linkedSections || [];
                    const newLinks = isLinked
                      ? currentLinks.filter((id: any) => id !== section.id)
                      : [...currentLinks, section.id];
                    onChange({
                      ...data,
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
        </div> */}
      </div>

      <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
        <button
          onClick={() => onClose(false)}
          className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
        >
          <Save size={16} />
          {level === "spec"
            ? "حفظ التخصص"
            : level === "mat"
            ? "حفظ المادة"
            : "حفظ القسم"}
        </button>
      </div>
    </div>
  </div>
);

export default AddSubsectionModal;
