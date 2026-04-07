import handleErrorAlerts from "@/utils/showErrorMessages";
import { X, Save, DollarSign, ToggleRight, ToggleLeft } from "lucide-react";
import toast from "react-hot-toast";
import { CardPricing } from "@/pages/dashboard/admin/cards/CardPricingPage";
import { useCustomPost } from "@/hooks/useMutation";

interface AddCardPricingProps {
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  setNewCard: React.Dispatch<React.SetStateAction<Partial<CardPricing>>>;
  newCard: Partial<CardPricing>;
}
const AddCardPricing = ({
  setShowAddModal,
  setNewCard,
  newCard,
}: AddCardPricingProps) => {
  const addCard = useCustomPost("cards/", ["cards", "card-statistics"]);

  const handleAddCard = () => {
    if ((newCard.price ?? 0) <= 0) {
      toast.error("يرجى تحديد سعر البطاقة");
      return;
    }
    // If image exists → use FormData
    let payload: any;
    let options: any = {};

    if (newCard.image) {
      const formData = new FormData();
      formData.append("price", String(newCard.price));
      if (newCard.default_teacher_price)
        formData.append(
          "default_teacher_price",
          String(newCard.default_teacher_price),
        );
      if (newCard.default_library_price)
        formData.append(
          "default_library_price",
          String(newCard.default_library_price),
        );
      formData.append("is_active", String(newCard.is_active));
      formData.append("image", newCard.image); // 👈 file object

      payload = formData;
      options = { headers: { "Content-Type": "multipart/form-data" } };
    } else {
      // Fallback to JSON
      payload = {
        price: newCard.price,
        default_teacher_price: newCard.default_teacher_price,
        default_library_price: newCard.default_library_price,
        is_active: newCard.is_active,
      };
    }
    addCard
      .mutateAsync(payload, options)
      .then(() => {
        setNewCard({
          price: 0,
          is_active: true,
        });
        setShowAddModal(false);
      })
      .catch((error: any) => {
        handleErrorAlerts(error?.response?.data?.message || "حدث خطأ");
      });
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">إضافة سعر جديد</h2>
            <button
              onClick={() => {
                setNewCard({
                  price: 0,
                  is_active: true,
                });
                setShowAddModal(false);
              }}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السعر (دينار أردني) *
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={newCard.price || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setNewCard((prev) => ({
                    ...prev,
                    price: value,
                    default_teacher_price: prev.default_teacher_price
                      ? Math.min(prev.default_teacher_price, value)
                      : prev.default_teacher_price,
                    default_library_price: prev.default_library_price
                      ? Math.min(prev.default_library_price, value)
                      : prev.default_library_price,
                  }));
                }}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
                placeholder="أدخل السعر..."
                min="0"
                step="1"
              />
            </div>
          </div>
          {/* Price */}

          {/* teacher_price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البيع للمدرس *
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={newCard.default_teacher_price || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setNewCard({
                    ...newCard,
                    default_teacher_price: Math.min(value, newCard.price || 0),
                  });
                }}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
                placeholder="ادخل سعر المدرس..."
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* library_price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البيع للمكتبة *
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={newCard.default_library_price || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setNewCard({
                    ...newCard,
                    default_library_price: Math.min(value, newCard.price || 0),
                  });
                }}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
                placeholder="ادخل سعر المكتبة..."
                min="0"
                step="1"
              />
            </div>
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
                className="cursor-pointer px-4 py-3 bg-(--brand) text-white text-sm font-medium rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
              >
                اختر الصورة المصغرة
              </label>

              <input
                id="imageUpload"
                type="file"
                className="invisible w-0 h-0"
                onChange={(e) => {
                  setNewCard({
                    ...newCard,
                    image: e.target.files?.[0],
                  });
                }}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
              />

              <span id="fileName" className="text-sm text-gray-500">
                {newCard?.image ? newCard?.image?.name : "لم يتم اختيار صورة"}
              </span>
              {(typeof newCard?.image === "string" ||
                newCard?.image instanceof File) && (
                <img
                  loading="lazy"
                  src={
                    newCard?.image instanceof File
                      ? URL.createObjectURL(newCard.image)
                      : newCard?.image
                  }
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded"
                />
              )}
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">مفعل</p>
              <p className="text-sm text-gray-500">متاح للاستخدام</p>
            </div>
            <button
              onClick={() =>
                setNewCard({ ...newCard, is_active: !newCard.is_active })
              }
              className={`cursor-pointer p-1 rounded-full transition-colors ${
                newCard.is_active ? "text-green-600" : "text-gray-400"
              }`}
            >
              {newCard.is_active ? (
                <ToggleRight size={24} />
              ) : (
                <ToggleLeft size={24} />
              )}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => {
              setNewCard({
                price: 0,
                is_active: true,
              });
              setShowAddModal(false);
            }}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleAddCard}
            disabled={
              !newCard.price ||
              newCard.price <= 0 ||
              !newCard.default_teacher_price ||
              !newCard.image ||
              newCard.default_teacher_price <= 0 ||
              !newCard.default_library_price ||
              newCard.default_library_price <= 0
            }
            className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2
                ${
                  !newCard.price ||
                  newCard.price <= 0 ||
                  !newCard.default_teacher_price ||
                  !newCard.image ||
                  newCard.default_teacher_price <= 0 ||
                  !newCard.default_library_price ||
                  newCard.default_library_price <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "cursor-pointer bg-linear-to-r from-(--brand) to-(--brand-light) text-white hover:from-(--brand-light) hover:to-(--brand)"
                }`}
          >
            <Save size={16} />
            حفظ السعر
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCardPricing;
