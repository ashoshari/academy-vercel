import { CustomCard } from "@/pages/dashboard/admin/cards/CardCustomPrice";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { CreditCard, Edit } from "lucide-react";

interface Props {
  priceCard: CustomCard;
  setShowEditModal: (s: boolean) => void;
  setSelectedCard: (s: CustomCard) => void;
}

export default function PriceCard({
  priceCard,
  setShowEditModal,
  setSelectedCard,
}: Props) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div
        className={`p-6 text-white relative overflow-hidden ${
          priceCard?.card?.is_active
            ? "bg-linear-to-br from-(--brand) to-(--brand-light)"
            : "bg-linear-to-br from-gray-400 to-gray-500"
        }`}
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
        <div className="relative z-10 text-center">
          <CreditCard className="w-8 h-8 mx-auto mb-3" />
          <div className="text-3xl font-bold mb-1">
            {priceCard?.card?.price}
          </div>
          <div className="text-sm opacity-90">دينار أردني</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              priceCard?.card?.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {priceCard?.card?.is_active ? "مفعل" : "معطل"}
          </span>
          <button
            onClick={() => {
              setSelectedCard(priceCard);
              setShowEditModal(true);
            }}
            className="cursor-pointer flex items-center justify-start gap-2 rounded-lg border border-gray-200 px-6 py-2 text-gray-600 hover:bg-gray-50"
          >
            <Edit size={16} />
            تعديل
          </button>
        </div>

        <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600 mb-1">
              السعر الافتراضي{" "}
              {priceCard.user.type?.name === "library" ? "للمكتبة" : "للمعلم"}{" "}
              قبل التخصيص
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {priceCard.user.type?.name === "library"
                ? priceCard?.card.default_library_price
                : priceCard?.card.default_teacher_price}{" "}
              &nbsp;
              <span className="text-sm text-gray-500 ml-1">د.أ</span>
            </span>
          </div>
        </div>

        <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-600 mb-1">
              السعر المخصص{" "}
              {priceCard.user.type?.name === "library" ? "للمكتبة" : "للمعلم"} (
              {priceCard.user.name})
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {priceCard?.price ?? "—"} &nbsp;
              <span className="text-sm text-gray-500 ml-1">د.أ</span>
            </span>
          </div>
        </div>

        {/* Date */}
        <div className="text-center text-xs text-gray-500 mb-4">
          تم الإنشاء: {formatDateTimeSimple(priceCard.created_at)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2">
          {/* Edit */}
          {/* <button
                  onClick={() => {
                    setSelectedCard(card);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors"
                  title="تعديل السعر"
                >
                  <Edit size={16} />
                </button> */}

          {/* Delete */}
          {/* <button
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف السعر"
                >
                  <Trash2 size={16} />
                </button> */}
        </div>
      </div>
    </div>
  );
}
