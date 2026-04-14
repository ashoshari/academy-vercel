/* SectionEditModal.tsx
   one component for sub & sub-sub */
import { useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { Save, ToggleLeft, ToggleRight, X } from "lucide-react";
import toast from "react-hot-toast";
import MultiSelectAutocomplete from "./MultiSelector";
import React from "react";

interface Props {
  /** "sub" or "subsub" */
  level: "sub" | "subsub" | "spec" | "mat";
  /** e.g. "/training/admin/subsections/" or "/training/admin/subsubsections/" */
  endpointBase: string;
  /** react-query key to invalidate, usually "subsections" */
  queryKey: string[];

  mainSections: any[]; // needed only for level="sub"
  data: any; // form state {title,description,…}
  onChange: (d: any) => void; // setFormState
  onClose: () => void; // hide modal
  type?: any;
}

const EditModal: React.FC<Props> = ({
  level,
  endpointBase,
  queryKey,
  mainSections,
  data,
  onChange,
  onClose,
  type,
}) => {
  /* ── normalise parent ids once ─────────────────────────── */
  const sectionIds = React.useMemo(
    () =>
      (data?.sections || []).map((s: any) =>
        typeof s === "string" ? s : s.id,
      ),
    [data?.sections],
  );
  /* ── mutation ──────────────────────────────────────────── */
  const mutation = useCustomUpdate(`${endpointBase}${data?.id}/`, queryKey);

  const save = async () => {
    const payload =
      type === "material-subsub"
        ? {
            name: data.material,
            material: data.material,
            is_published: data.is_published,
            subsubsections: data.specialization,
          }
        : level === "sub"
          ? {
              title: data.title,
              description: data.description,
              sections: sectionIds,
              is_published: data.is_published,
              order: Number(data.order) || 0,
            }
          : level === "subsub"
            ? {
                title: data.title,
                description: data.description,
                is_published: data.is_published,
                order: Number(data.order) || 0,
                subsection: data.subsection,
              }
            : level === "spec"
              ? {
                  name: data.name,
                  description: data.description,
                  is_published: data.is_published,
                  order: Number(data.order) || 0,
                  subsubsection: data.subsubsection,
                }
              : {
                  name: data.material,
                  // material: data.material,
                  is_published: data.is_published,
                  // specialization: data.specialization,
                };

    await mutation
      .mutateAsync(payload)
      .then((res) => {
        if (res.status) {
          toast.success(res.message ?? "تم الحفظ");
          onClose();
        } else toast.error(res.message ?? "فشل الحفظ");
      })
      .catch((e) => handleErrorAlerts(e?.response?.data?.error));
  };

  /* ── ui ────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {level === "spec"
                ? "تعديل التخصص"
                : level === "mat"
                  ? "تعديل المادة"
                  : "تعديل القسم"}
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="space-y-6 p-6">
          {level === "sub" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                الأقسام الأب
              </label>
              <MultiSelectAutocomplete
                options={mainSections}
                value={sectionIds}
                onChange={(ids) => onChange({ ...data, sections: ids })}
                placeholder={
                  sectionIds.length === 0 ? "قسم رئيسي (بدون أب)" : "أضف قسمًا"
                }
              />
            </div>
          ) : level === "subsub" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                الأقسام الأب
              </label>
              <select
                value={data?.subsection ?? ""}
                onChange={(e) => {
                  onChange({ ...data, subsection: e.target.value });
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              >
                <option value="">قسم رئيسي (بدون أب)</option>
                {mainSections.map((sec: any) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
            </div>
          ) : level === "spec" ? (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                الأقسام الأب
              </label>
              <select
                value={
                  mainSections?.find((m) => m.id === data?.subsubsection).id
                }
                onChange={(e) => {
                  onChange({ ...data, subsubsection: e.target.value });
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              >
                <option value="">قسم رئيسي (بدون أب)</option>
                {mainSections.map((sec: any) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              {/* <label className="mb-2 block text-sm font-medium text-gray-700">
                الأقسام الأب
              </label>
              <select
                value={
                  mainSections?.find((m) => m?.id === data?.specialization)?.id
                }
                onChange={(e) => {
                  onChange({ ...data, specialization: e.target.value });
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              >
                <option value="">قسم رئيسي (بدون أب)</option>
                {mainSections.map((sec: any) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select> */}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              الاسم
            </label>
            {level === "spec" ? (
              <input
                value={data?.name}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-(--brand) focus:ring-2 focus:ring-(--brand)"
              />
            ) : level === "mat" ? (
              <input
                value={data?.material}
                onChange={(e) =>
                  onChange({ ...data, material: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-(--brand) focus:ring-2 focus:ring-(--brand)"
              />
            ) : (
              <input
                value={data.title}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-(--brand) focus:ring-2 focus:ring-(--brand)"
              />
            )}
          </div>

          {level !== "mat" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  الوصف
                </label>
                <textarea
                  rows={3}
                  value={data?.description}
                  onChange={(e) =>
                    onChange({ ...data, description: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 focus:border-(--brand) focus:ring-2 focus:ring-(--brand)"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  الترتيب
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  lang="en"
                  value={data?.order}
                  onChange={(e) => onChange({ ...data, order: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 focus:border-(--brand) focus:ring-2 focus:ring-(--brand)"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">
                {data?.is_published ? "مفعل" : "معطل"}
              </p>
              <p className="text-sm text-gray-500">
                {data?.is_published ? "متاح للطلاب" : "غير متاح للطلاب"}
              </p>
            </div>
            <button
              onClick={() =>
                onChange({
                  ...data,
                  is_published: !data?.is_published,
                })
              }
              className={`p-1 rounded-full transition-colors ${
                data?.is_published ? "text-green-600" : "text-gray-400"
              }`}
            >
              {data?.is_published ? (
                <ToggleRight size={24} />
              ) : (
                <ToggleLeft size={24} />
              )}
            </button>
          </div>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-6 py-2 text-gray-600 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={save}
            className="flex items-center gap-2 rounded-lg bg-linear-to-r from-(--brand) to-(--brand-light) px-6 py-2 text-white hover:from-(--brand-light) hover:to-(--brand)"
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
