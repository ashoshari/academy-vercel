import { ArrowRight, Save } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import MultiSelectAutocomplete from "@/components/dashboard/admin/subsections/MultiSelector";

export type CourseFormMode = "create" | "clone" | "edit";

const formatDateForInput = (date?: string) => {
  if (!date) return "";
  return date.split("T")[0];
};

const idFromRef = (ref: unknown): string => {
  if (ref == null || ref === "") return "";
  if (typeof ref === "object" && ref !== null && "id" in ref) {
    const rid = (ref as { id: unknown }).id;
    if (rid == null || rid === "") return "";
    return String(rid);
  }
  return String(ref);
};

export type CourseFormProps = {
  mode: CourseFormMode;
  role: string;
  cloneSourceName?: string | null;
  newCourse: any;
  setNewCourse: Dispatch<SetStateAction<any>>;
  teacherData: any[] | undefined;
  cardsData: any[] | undefined;
  courseData: any[] | undefined;
  importOfferOptions?: { id: string; title: string }[];
  selectedSubSection: string;
  setSelectedSubSection: Dispatch<SetStateAction<string>>;
  selectedSubSub: string;
  setSelectedSubSub: Dispatch<SetStateAction<string>>;
  selectedSpec: string;
  setSelectedSpec: Dispatch<SetStateAction<string>>;

  subsectionData: any[] | undefined;
  subSection: any;
  subsub: any;
  spec: any;

  isPendingSubmit: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onBack: () => void;
};

export default function CourseForm({
  mode,
  role,
  cloneSourceName,
  newCourse,
  setNewCourse,
  teacherData,
  cardsData,
  courseData,
  importOfferOptions,
  setSelectedSubSection,
  selectedSubSub,
  setSelectedSubSub,
  selectedSpec,
  setSelectedSpec,
  subsectionData,
  subSection,
  subsub,
  spec,
  isPendingSubmit,
  onSubmit,
  onCancel,
  onBack,
}: CourseFormProps) {
  const isClone = mode === "clone";
  const isEdit = mode === "edit";

  const effectiveSubSubId =
    selectedSubSub || idFromRef(newCourse?.subsubsection) || "";
  const effectiveSpecId =
    selectedSpec || idFromRef(newCourse?.specialization) || "";
  const specializationMaterialValue =
    typeof newCourse?.specialization_material === "object" &&
    newCourse.specialization_material !== null &&
    "id" in newCourse.specialization_material
      ? String((newCourse.specialization_material as { id: unknown }).id ?? "")
      : ((newCourse?.specialization_material as string | number | undefined) ??
        "");

  const effectiveTeacherId = idFromRef(newCourse?.teacher);

  const disableSubmit =
    isPendingSubmit ||
    (!isClone &&
      (!newCourse.name ||
        !newCourse.start_date ||
        !newCourse.end_date ||
        (!newCourse.is_free && !newCourse.card_price) ||
        (role !== "teacher" && !effectiveTeacherId) ||
        !newCourse.subsection ||
        !effectiveSubSubId ||
        ((subsub?.specializations?.length ?? 0) > 0
          ? !effectiveSpecId
          : false) ||
        !specializationMaterialValue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          type="button"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isClone
              ? "نسخ الدورة"
              : isEdit
                ? "تعديل الدورة"
                : "إنشاء دورة جديدة"}
          </h1>
          <p className="text-gray-600 text-sm">
            {isClone
              ? `قم بنسخ دورة${cloneSourceName ? `: ${cloneSourceName}` : ""} (كل الحقول اختيارية)`
              : isEdit
                ? "قم بتعديل بيانات الدورة الحالية"
                : "أضف دورة تعليمية جديدة للمنصة"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-(--brand)">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
              المعلومات الأساسية
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان الدورة *
              </label>
              <input
                type="text"
                value={newCourse?.name || ""}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                placeholder="أدخل عنوان الدورة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف مختصر
              </label>
              <input
                type="text"
                value={newCourse?.short_description || ""}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    short_description: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                placeholder="وصف مختصر للدورة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف التفصيلي
              </label>
              <textarea
                value={newCourse?.long_description || ""}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    long_description: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                placeholder="وصف تفصيلي للدورة..."
              />
            </div>

            {/* Teacher */}
            {role !== "teacher" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المعلم *
                  </label>
                  <select
                    value={effectiveTeacherId}
                    onChange={(e) =>
                      setNewCourse({
                        ...newCourse,
                        teacher: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر المعلم</option>
                    {teacherData
                      ?.filter((t: any) => t?.is_active)
                      .map((teacher: any) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدة (بالساعات)
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                lang="en"
                value={newCourse?.time_in_hours || 0}
                onChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    time_in_hours: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                placeholder="40"
                min="0"
              />
            </div>

            {/* Media */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="imageUpload"
                className="block text-sm font-medium text-gray-700"
              >
                الصورة المصغرة
              </label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="imageUpload"
                  className="btn-brand-slide cursor-pointer px-4 py-3 text-white text-sm font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-(--brand) transition-all"
                >
                  اختر الصورة المصغرة
                </label>

                <input
                  id="imageUpload"
                  type="file"
                  className="invisible w-0 h-0"
                  onChange={(e) => {
                    setNewCourse({
                      ...newCourse,
                      image: e.target.files?.[0],
                    });
                  }}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                />

                <span id="fileName" className="text-sm text-gray-500">
                  {newCourse?.image
                    ? newCourse?.image?.name
                    : "لم يتم اختيار صورة"}
                </span>
                {(typeof newCourse?.image === "string" ||
                  newCourse?.image instanceof File) && (
                  <img
                    loading="lazy"
                    src={
                      newCourse?.image instanceof File
                        ? URL.createObjectURL(newCourse.image)
                        : newCourse?.image
                    }
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Settings and Targeting */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
              الإعدادات والاستهداف
            </h2>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                التسعير *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pricing"
                    checked={newCourse?.is_free === true}
                    onChange={() =>
                      setNewCourse({
                        ...newCourse,
                        is_free: true,
                        card_price: 0,
                      })
                    }
                    className="text-(--brand) focus:ring-(--brand)"
                  />
                  <span>دورة مجانية</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pricing"
                    checked={newCourse?.is_free === false}
                    onChange={() =>
                      setNewCourse({ ...newCourse, is_free: false })
                    }
                    className="text-(--brand) focus:ring-(--brand)"
                  />
                  <span>دورة مدفوعة</span>
                </label>
              </div>
              {newCourse?.is_free === false && (
                <div className="mt-3">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        البطاقة *
                      </label>
                      <select
                        value={newCourse?.card_price?.id}
                        onChange={(e) => {
                          setNewCourse({
                            ...newCourse,
                            card_price: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                      >
                        <option value="">اختر بطاقة</option>
                        {cardsData
                          ?.filter((card: any) => card?.is_active)
                          .map((card: any) => (
                            <option key={card.id} value={card.id}>
                              {card?.price} د.ا
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ البداية *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(newCourse?.start_date)}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, start_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ النهاية *
                </label>
                <input
                  type="date"
                  value={formatDateForInput(newCourse?.end_date)}
                  onChange={(e) =>
                    setNewCourse({ ...newCourse, end_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                />
              </div>
            </div>

            {/* SubSection */}
            <div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  القسم *
                </label>
                <select
                  value={newCourse?.subsection?.id}
                  onChange={(e) => {
                    setSelectedSubSection(e.target.value);
                    setSelectedSubSub("");
                    setSelectedSpec("");
                    setNewCourse({
                      ...newCourse,
                      subsection: e.target.value,
                      subsubsection: "",
                      specialization: "",
                      specialization_material: "",
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                >
                  <option value="">اختر القسم</option>
                  {subsectionData?.map((sub: any) => (
                    <option key={sub.id} value={sub.id}>
                      {sub?.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SubSubSection */}
            {(subSection?.subsubsections?.length ?? 0) > 0 && (
              <div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم الفرعي *
                  </label>
                  <select
                    value={effectiveSubSubId}
                    onChange={(e) => {
                      setSelectedSubSub(e.target.value);
                      setSelectedSpec("");
                      setNewCourse({
                        ...newCourse,
                        subsubsection: e.target.value,
                        specialization: "",
                        specialization_material: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر الصف</option>
                    {subSection?.subsubsections?.map((ss: any) => (
                      <option key={ss.id} value={ss.id}>
                        {ss?.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Specialization */}
            {(subsub?.specializations?.length ?? 0) > 0 && (
              <div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    التخصص *
                  </label>
                  <select
                    value={effectiveSpecId}
                    onChange={(e) => {
                      setSelectedSpec(e.target.value);
                      setNewCourse({
                        ...newCourse,
                        specialization: e.target.value,
                        specialization_material: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر قسم فرعي</option>
                    {subsub?.specializations?.map((sp: any) => (
                      <option key={sp.id} value={sp.id}>
                        {sp?.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Specialization Material */}
            {effectiveSubSubId &&
              (subsub?.specialization_materials?.length ?? 0) === 0 &&
              (subsub?.specializations?.length ?? 0) === 0 && (
                <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                  لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                </p>
              )}
            {((spec?.specialization_materials?.length ?? 0) > 0 ||
              ((subsub?.specializations?.length ?? 0) === 0 &&
                (subsub?.specialization_materials?.length ?? 0) > 0)) && (
              <div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مادة التخصص *
                  </label>
                  <select
                    value={specializationMaterialValue}
                    onChange={(e) => {
                      setNewCourse({
                        ...newCourse,
                        specialization_material: e.target.value,
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر مادة التخصص</option>
                    {(spec?.specialization_materials.length > 0
                      ? (spec?.specialization_materials ?? [])
                      : (subsub?.specialization_materials ?? [])
                    ).map((sm: any) => (
                      <option key={sm.id} value={sm.id}>
                        {sm?.material}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Status Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">منشور</p>
                  <p className="text-sm text-gray-500">متاح للطلاب</p>
                </div>
                <input
                  type="checkbox"
                  checked={newCourse?.is_published ?? true}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      is_published: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">مميز</p>
                  <p className="text-sm text-gray-500">يظهر في المميزة</p>
                </div>
                <input
                  type="checkbox"
                  checked={newCourse.is_special ?? false}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      is_special: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                />
              </div>

              <div className="col-span-1 lg:col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">إظهار الأسئلة</p>
                  <p className="text-sm text-gray-500">
                    إظهار صفحة الأسئلة الخاصة بالدورة
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={newCourse?.is_show_general_questions ?? true}
                  onChange={(e) =>
                    setNewCourse({
                      ...newCourse,
                      is_show_general_questions: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                />
              </div>

              <div className="col-span-1 lg:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  استيراد عرض الأسئلة من دورة أخرى (اختياري)
                </label>
                <p className="text-xs text-gray-500">
                  يمكن اختيار دورة واحدة فقط لنسخ إعدادات عرض الأسئلة المرتبطة
                  بها.
                </p>
                <MultiSelectAutocomplete
                  single
                  value={newCourse.import_offer_target_ids || []}
                  onChange={(ids) =>
                    setNewCourse({
                      ...newCourse,
                      import_offer_target_ids: ids.slice(0, 1),
                    })
                  }
                  options={
                    importOfferOptions ??
                    courseData?.map((c: any) => ({
                      id: String(c.id),
                      title: c.name ?? "—",
                    })) ??
                    []
                  }
                  placeholder="اختر الدورة المصدر..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex md:flex-row flex-col gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="cursor-pointer px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            type="button"
          >
            إلغاء
          </button>
          <button
            onClick={onSubmit}
            disabled={disableSubmit}
            className="btn-brand-slide md:justify-start justify-center px-6 py-3 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <Save size={16} />
            {isPendingSubmit
              ? isClone
                ? "جاري النسخ..."
                : isEdit
                  ? "جاري الحفظ..."
                  : "جاري الإنشاء..."
              : isClone
                ? "نسخ الدورة"
                : isEdit
                  ? "حفظ التغييرات"
                  : "إنشاء الدورة"}
          </button>
        </div>
      </div>
    </div>
  );
}
