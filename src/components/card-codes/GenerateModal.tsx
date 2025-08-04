import {
  Clock,
  Folder,
  Globe,
  MapPin,
  Save,
  Shield,
  Smartphone,
  Target,
  User,
  X,
} from "lucide-react";

const GenerateModal = ({
  generateForm,
  setShowGenerateModal,
  setGenerateForm,
  cards,
  renderSubsectionTree,
  subsectionTree,
  getSubsectionName,
  handleGenerateCodes,
  cardPricing,
  loading,
}: {
  generateForm: any;
  setShowGenerateModal: any;
  setGenerateForm: any;
  cards: any;
  renderSubsectionTree: any;
  subsectionTree: any;
  getSubsectionName: any;
  handleGenerateCodes: any;
  cardPricing: any;
  loading: any;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">إنشاء كودات جديدة</h2>
          <button
            onClick={() => setShowGenerateModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Price Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سعر البطاقة
          </label>
          <select
            value={generateForm.priceId}
            onChange={(e) =>
              setGenerateForm({
                ...generateForm,
                priceId: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          >
            <option value={0}>اختر سعر البطاقة</option>
            {cards?.data?.data
              .filter((p: any) => p.is_active)
              .map((price: any) => (
                <option key={price.id} value={price.id}>
                  {price.price} دينار أردني
                </option>
              ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            عدد الكودات
          </label>
          <input
            type="number"
            value={generateForm.quantity}
            onChange={(e) =>
              setGenerateForm({
                ...generateForm,
                quantity: parseInt(e.target.value) || 0,
              })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="أدخل عدد الكودات..."
            min="1"
            max="10000"
          />
        </div>

        {/* Prefix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            بادئة الكود
          </label>
          <input
            type="text"
            value={generateForm.prefix}
            onChange={(e) =>
              setGenerateForm({ ...generateForm, prefix: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            placeholder="CARD"
          />
        </div>

        {/* NEW: Targeting Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            استهداف الأقسام
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
              <input
                type="radio"
                name="targetingType"
                value="all"
                checked={generateForm.targetingType === "all"}
                onChange={(e) =>
                  setGenerateForm({
                    ...generateForm,
                    targetingType: e.target.value as "all" | "specific",
                    targetedSubsections: [],
                  })
                }
                className="text-orange-600 focus:ring-orange-500"
              />
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-gray-800">جميع الأقسام</div>
                <div className="text-sm text-gray-500">
                  الكودات تعمل على كامل الأجيال والأقسام
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-orange-300 transition-colors">
              <input
                type="radio"
                name="targetingType"
                value="specific"
                checked={generateForm.targetingType === "specific"}
                onChange={(e) =>
                  setGenerateForm({
                    ...generateForm,
                    targetingType: e.target.value as "all" | "specific",
                  })
                }
                className="text-orange-600 focus:ring-orange-500"
              />
              <Target className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-gray-800">أقسام محددة</div>
                <div className="text-sm text-gray-500">
                  اختيار أقسام فرعية معينة
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* NEW: Subsection Selection */}
        {generateForm.targetingType === "specific" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اختيار الأقسام الفرعية ({generateForm.targetedSubsections.length}{" "}
              محدد)
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
              {subsectionTree?.length > 0 ? (
                renderSubsectionTree(subsectionTree)
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  لا توجد أقسام فرعية متاحة
                </p>
              )}
            </div>
            {generateForm.targetedSubsections.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-2">الأقسام المحددة:</p>
                <div className="flex flex-wrap gap-1">
                  {generateForm.targetedSubsections.map((id: any) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs"
                    >
                      <Folder size={12} />
                      {getSubsectionName(id)}
                      <button
                        onClick={() =>
                          setGenerateForm({
                            ...generateForm,
                            targetedSubsections:
                              generateForm.targetedSubsections.filter(
                                (sid: any) => sid !== id
                              ),
                          })
                        }
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
            placeholder="أدخل ملاحظات حول هذه المجموعة..."
          />
        </div>

        {/* Preview */}
        {generateForm.priceId > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">مثال على الكود:</p>
            <p className="font-mono text-lg font-bold text-orange-600 mb-3">
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
                  <Globe size={16} className="text-blue-600" />
                  <span className="text-blue-600 font-medium">
                    يعمل على جميع الأقسام
                  </span>
                </>
              ) : (
                <>
                  <Target size={16} className="text-orange-600" />
                  <span className="text-orange-600 font-medium">
                    {generateForm.targetedSubsections.length === 0
                      ? "لم يتم اختيار أقسام بعد"
                      : `يعمل على ${generateForm.targetedSubsections.length} قسم محدد`}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Security Info Preview */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
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
          className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء
        </button>
        <button
          onClick={handleGenerateCodes}
          disabled={
            loading
              ? true
              : !generateForm.priceId ||
                generateForm.quantity <= 0 ||
                (generateForm.targetingType === "specific" &&
                  generateForm.targetedSubsections.length === 0)
          }
          className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {loading ? "جارى التحميل..." : "     إنشاء الكودات"}
        </button>
      </div>
    </div>
  </div>
);

export default GenerateModal;
