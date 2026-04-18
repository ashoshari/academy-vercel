/* eslint-disable react-hooks/exhaustive-deps */
import { useCustomQuery } from "@/hooks/useQuery";
import {
  Clock,
  Globe,
  MapPin,
  Save,
  Shield,
  Smartphone,
  Target,
  User,
  X,
} from "lucide-react";
import MultiSelectAutocomplete from "../dashboard/admin/subsections/MultiSelector";
import { useEffect, useMemo, useState } from "react";
import { readUserFromStorage, roleOf } from "@/services/auth";

type CardRow = { id: string; price: number; is_active?: boolean };

function activeCards(cardsQuery: { data?: { data?: CardRow[] } } | undefined) {
  return cardsQuery?.data?.data?.filter((c) => c.is_active) ?? [];
}

function cardMultiOptions(rows: CardRow[]) {
  return rows.map((c) => ({
    id: String(c.id),
    title: `${c.price} دينار أردني`,
  }));
}

const GenerateModal = ({
  generateForm,
  setShowGenerateModal,
  setGenerateForm,
  cards,
  handleGenerateCodes,
  cardPricing,
  loading,
}: {
  generateForm: any;
  setShowGenerateModal: any;
  setGenerateForm: any;
  cards: any;
  handleGenerateCodes: any;
  cardPricing: any;
  loading: any;
}) => {
  const [selectedSubsections, setSelectedSubsections] = useState<string[]>([]);
  const [selectedSubSubsections, setSelectedSubSubsections] = useState<
    string[]
  >([]);
  const [selectedSpecializations, setSelectedSpecializations] = useState<
    string[]
  >([]);
  const [selectedSpecializationMaterial, setSelectedSpecializationMaterial] =
    useState<string[]>([]);
  const [allSubsections, setAllSubstections] = useState(true);

  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";

  const subsections = useCustomQuery(
    "/training/admin/subsections/",
    ["subsections"],
    undefined,
    role !== "library",
  );

  // Find all subsubsections of selected subsections
  const subsubOptions =
    subsections?.data?.data
      ?.filter((s: any) => selectedSubsections.includes(s.id))
      ?.flatMap((s: any) =>
        (s.subsubsections || []).map((ss: any) => ({
          id: ss.id,
          title: ss.title,
          specializations: ss.specializations || [],
          specialization_materials: ss.specialization_materials || [],
        })),
      ) || [];

  // Find all specializations of selected subsubsections
  const specializationOptions =
    subsubOptions
      ?.filter((ss: any) => selectedSubSubsections.includes(ss.id))
      ?.flatMap((ss: any) =>
        (ss.specializations || []).map((sp: any) => ({
          id: sp.id,
          title: sp.name,
          specialization_materials: sp.specialization_materials || [],
        })),
      ) || [];

  // Find specialization materials
  const specializationMaterialOptions = [
    // from selected specializations
    ...(specializationOptions
      ?.filter((sp: any) => selectedSpecializations.includes(sp.id))
      ?.flatMap((sp: any) =>
        (sp.specialization_materials || []).map((sm: any) => ({
          id: sm.id,
          title: sm.material,
        })),
      ) || []),

    // from selected subsubsections directly
    ...(subsubOptions
      ?.filter((ss: any) => selectedSubSubsections.includes(ss.id))
      ?.flatMap((ss: any) =>
        (ss.specialization_materials || []).map((sm: any) => ({
          id: sm.id,
          title: sm.material,
        })),
      ) || []),
  ];

  useEffect(() => {
    setGenerateForm((prev: any) => ({
      ...prev,
      subsections: selectedSubsections,
    }));
  }, [selectedSubsections]);

  useEffect(() => {
    setGenerateForm((prev: any) => ({
      ...prev,
      subsubsections: selectedSubSubsections,
    }));
  }, [selectedSubSubsections]);

  useEffect(() => {
    setGenerateForm((prev: any) => ({
      ...prev,
      specializations: selectedSpecializations,
    }));
  }, [selectedSpecializations]);

  useEffect(() => {
    setGenerateForm((prev: any) => ({
      ...prev,
      specialization_material: selectedSpecializationMaterial,
    }));
  }, [selectedSpecializationMaterial]);

  const activeCardRows = useMemo(() => activeCards(cards), [cards?.data?.data]);
  const offerCardOptions = useMemo(
    () =>
      cardMultiOptions(
        activeCardRows.filter(
          (c) => String(c.id) !== String(generateForm.card || ""),
        ),
      ),
    [activeCardRows, generateForm.card],
  );

  const submitDisabled =
    loading ||
    !generateForm.card ||
    generateForm.quantity <= 0 ||
    (generateForm.is_offer &&
      !(generateForm.offer_activation_cards?.length > 0)) ||
    (generateForm.targetingType === "specific" &&
      generateForm.targetedSubsections?.length === 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إنشاء كودات جديدة
            </h2>
            <button
              onClick={() => setShowGenerateModal(false)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البطاقة
            </label>
            <select
              value={generateForm?.card}
              onChange={(e) => {
                const card = e.target.value;
                setGenerateForm((prev: any) => ({
                  ...prev,
                  card,
                  offer_activation_cards: (
                    prev.offer_activation_cards || []
                  ).filter((id: string) => String(id) !== String(card)),
                }));
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
            >
              <option value={0}>اختر سعر البطاقة</option>
              {activeCardRows.map((price) => (
                <option key={price.id} value={price.id}>
                  {price.price} دينار أردني
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عدد الكودات
            </label>
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              lang="en"
              value={generateForm.quantity}
              onChange={(e) =>
                setGenerateForm({
                  ...generateForm,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              placeholder="أدخل عدد الكودات..."
              min="1"
              max="10000"
            />
          </div>

          {role !== "library" && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">
                  تفعيل البطاقات على جميع الأقسام
                </p>
                <p className="text-sm text-gray-500">
                  البطاقات ستصبح فعّالة في كل الأقسام تلقائيًا.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allSubsections}
                onChange={(e) => {
                  setSelectedSubsections([]);
                  setSelectedSubSubsections([]);
                  setSelectedSpecializations([]);
                  setSelectedSpecializationMaterial([]);
                  setAllSubstections(e.target.checked);
                }}
                className="rounded border-gray-300 text-(--brand) focus:ring-(--brand-light)"
              />
            </div>
          )}
          {role !== "teacher" && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">
                  تفعيل خيار الدفع بالتقسيط
                </p>
                <p className="text-sm text-gray-500">
                  يمكنك تفعيل أو إلغاء خيار الدفع بالتقسيط لهذه الكودات يدويًا.
                </p>
              </div>
              <input
                type="checkbox"
                checked={generateForm.is_installment}
                onChange={(e) => {
                  setGenerateForm({
                    ...generateForm,
                    is_installment: e.target.checked,
                  });
                }}
                className="rounded border-gray-300 text-(--brand) focus:ring-(--brand-light)"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">كود عرض</p>
              <p className="text-sm text-gray-500">
                تحديد ما إذا كانت هذه الكودات مرتبطة بعرض ترويجي.
              </p>
            </div>
            <input
              type="checkbox"
              checked={Boolean(generateForm.is_offer)}
              onChange={(e) => {
                const checked = e.target.checked;
                setGenerateForm((prev: any) => ({
                  ...prev,
                  is_offer: checked,
                  ...(!checked ? { offer_activation_cards: [] } : {}),
                }));
              }}
              className="rounded border-gray-300 text-(--brand) focus:ring-(--brand-light)"
            />
          </div>

          {generateForm.is_offer && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                بطاقات إضافية ضمن العرض
              </label>

              <div className="space-y-3">
                <MultiSelectAutocomplete
                  value={generateForm.offer_activation_cards || []}
                  onChange={(ids) =>
                    setGenerateForm((prev: any) => ({
                      ...prev,
                      offer_activation_cards: ids,
                    }))
                  }
                  options={offerCardOptions}
                  placeholder="اختر بطاقات العرض الإضافية..."
                />
              </div>
            </div>
          )}

          {!allSubsections && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  اختر قسم
                </label>
                <div className="space-y-3">
                  <MultiSelectAutocomplete
                    value={selectedSubsections}
                    onChange={(ids) => {
                      setSelectedSubsections(ids);
                      setSelectedSubSubsections([]); // reset children
                      setSelectedSpecializations([]);
                      setSelectedSpecializationMaterial([]);
                    }}
                    options={
                      subsections?.data?.data?.map((s: any) => ({
                        id: s.id,
                        title: s.title,
                      })) || []
                    }
                    placeholder="اختر الأقسام..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  اختر الاقسام الفرعية
                </label>
                <div className="space-y-3">
                  <MultiSelectAutocomplete
                    value={selectedSubSubsections}
                    onChange={(ids) => {
                      setSelectedSubSubsections(ids);
                      setSelectedSpecializations([]);
                      setSelectedSpecializationMaterial([]);
                    }}
                    options={subsubOptions}
                    placeholder="اختر الأقسام الفرعية..."
                  />
                </div>
              </div>

              {specializationOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    اختر تخصص
                  </label>
                  <MultiSelectAutocomplete
                    value={selectedSpecializations}
                    onChange={(ids) => {
                      setSelectedSpecializations(ids);
                      setSelectedSpecializationMaterial([]);
                    }}
                    options={specializationOptions}
                    placeholder="اختر تخصص..."
                  />
                </div>
              )}

              {specializationMaterialOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    اختر المواد
                  </label>
                  <MultiSelectAutocomplete
                    value={selectedSpecializationMaterial}
                    onChange={setSelectedSpecializationMaterial}
                    options={specializationMaterialOptions}
                    placeholder="اختر المواد..."
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات (اختياري)
            </label>
            <textarea
              value={generateForm.notes}
              onChange={(e) =>
                setGenerateForm({ ...generateForm, notes: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
              placeholder="أدخل ملاحظات حول هذه المجموعة..."
            />
          </div>

          {generateForm.priceId > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">مثال على الكود:</p>
              <p className="font-mono text-lg font-bold text-(--brand) mb-3">
                {generateForm.prefix}-
                {
                  cardPricing.find((p: any) => p.id === generateForm.priceId)
                    ?.price
                }
                -ABC123
              </p>

              <div className="flex items-center gap-2 text-sm">
                {generateForm.targetingType === "all" ? (
                  <>
                    <Globe size={16} className="text-(--brand-secondary)" />
                    <span className="text-(--brand-secondary) font-medium">
                      يعمل على جميع الأقسام
                    </span>
                  </>
                ) : (
                  <>
                    <Target size={16} className="text-(--brand)" />
                    <span className="text-(--brand) font-medium">
                      {generateForm.targetedSubsections.length === 0
                        ? "لم يتم اختيار أقسام بعد"
                        : `يعمل على ${generateForm.targetedSubsections.length} قسم محدد`}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-(--brand-secondary) mb-2 flex items-center gap-2">
              <Shield size={16} />
              معلومات الأمان
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div className="flex items-center gap-2">
                <User size={12} />
                <span>المنشئ: المدير الحالي (مدير النظام)</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={12} />
                <span>IP: 192.168.1.100</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={12} />
                <span>الجهاز: Windows 11 - Chrome</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>التاريخ: {new Date().toLocaleDateString("ar-JO")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowGenerateModal(false)}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleGenerateCodes}
            disabled={submitDisabled}
            className="btn-brand-slide cursor-pointer px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {loading ? "جارى التحميل..." : "إنشاء الكودات"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateModal;
