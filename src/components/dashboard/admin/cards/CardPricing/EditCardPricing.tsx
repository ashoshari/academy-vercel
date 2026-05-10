import { X, Save, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCustomUpdate } from "@/hooks/useMutation";
import toast from "react-hot-toast";
interface EditCardPricingProps {
  selectedCard: any;
  setSelectedCard: (s: any) => void;
  setShowEditModal: (s: boolean) => void;
  setCardPricing: (s: any) => void;
}
interface FormData {
  default_library_price: number;
  default_teacher_price: number;
}
const EditCardPricing = ({
  selectedCard,
  setSelectedCard,
  setShowEditModal,
  setCardPricing,
}: EditCardPricingProps) => {
  const { mutateAsync: editPrice, isPending } = useCustomUpdate(
    `/cards/${selectedCard.id}/`,
    ["edit-cards"],
  );
  const onSubmit = async (data: FormData) => {
    try {
      await editPrice(data);
      setCardPricing((prev: any) =>
        prev.map((card: any) =>
          card.id === selectedCard.id
            ? {
                ...card,
                default_teacher_price: data.default_teacher_price.toFixed(2),
                default_library_price: data.default_library_price.toFixed(2),
              }
            : card,
        ),
      );
      setShowEditModal(false);
      setSelectedCard(null);
    } catch (error: any) {
      console.log(error?.response);
      toast.error(
        error?.response?.data?.default_library_price ||
          error?.response?.data?.default_teacher_price ||
          "حدث خطأ",
      );
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">تعديل السعر</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* library_price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البيع للمكتبة *
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                lang="en"
                {...register("default_library_price", {
                  required: "ادخل سعر المكتبة",
                  valueAsNumber: true,
                })}
                defaultValue={selectedCard.default_library_price || ""}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                placeholder="ادخل سعر المكتبة..."
                min="0.1"
              />
              {errors.default_library_price && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.default_library_price.message}
                </span>
              )}
            </div>
          </div>
          {/* teacher_price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              سعر البيع للمدرس *
            </label>
            <div className="relative">
              <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                lang="en"
                {...register("default_teacher_price", {
                  required: "ادخل سعر المدرس",
                  valueAsNumber: true,
                })}
                defaultValue={selectedCard.default_teacher_price || ""}
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                placeholder="ادخل سعر المدرس..."
                min="0.1"
                // step="0.1"
              />
              {errors.default_teacher_price && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.default_teacher_price.message}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            disabled={isPending}
            type="submit"
            className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            حفظ التغييرات
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCardPricing;
