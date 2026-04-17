/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Plus, CreditCard, Users } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import EditCardPricing from "@/components/dashboard/admin/cards/CardPricing/EditCardPricing";
import AddCardPricing from "@/components/dashboard/admin/cards/CardPricing/AddCardPricing";
import PricingCardsSkeleton from "@/components/dashboard/skeletons/PricingCardsSkeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import EditButton from "@/components/dashboard/core/EditButton";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";

export interface CardPricing {
  id: string;
  price: number;
  image: File;
  default_teacher_price: number;
  default_library_price: number;
  is_active: boolean;
  createdAt: string;
}

const CardPricingPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [searchTerm, _] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingCardStatusToggle, setPendingCardStatusToggle] = useState<{
    id: string;
    isActive: boolean;
    price: number;
  } | null>(null);

  const [newCard, setNewCard] = useState<Partial<CardPricing>>({
    price: 0,
    is_active: true,
  });
  const [cardPricing, setCardPricing] = useState<CardPricing[]>([]);
  const cards = useCustomQuery("cards/", ["cards"]);
  useEffect(() => {
    setCardPricing(
      cards?.data?.data.map((card: any) => ({
        id: card.id,
        price: card.price,
        image: card.image,
        default_teacher_price: card.default_teacher_price,
        default_library_price: card.default_library_price,
        is_active: card.is_active,
        createdAt: card.created_at,
      })),
    );
  }, [cards?.data?.data]);
  const cardStatistics = useCustomQuery("/cards/statistics/", [
    "card-statistics",
  ]);
  const isLoadingStatistics = Boolean((cardStatistics as any)?.isLoading);

  const { mutateAsync: updateCard, isPending: isUpdatingCard } =
    useCustomUpdate(
      () => `cards/${selectedCardId ?? "noop"}/`,
      ["cards", "card-statistics"],
    );

  const requestCardStatusToggle = (card: any) => {
    const id = String(card?.id ?? "");
    if (!id) return;
    setSelectedCardId(id);
    setPendingCardStatusToggle({
      id,
      isActive: Boolean(card?.is_active),
      price: Number(card?.price ?? 0),
    });
  };

  const confirmCardStatusToggle = async () => {
    if (!pendingCardStatusToggle) return;
    try {
      const res = await updateCard({
        is_active: !pendingCardStatusToggle.isActive,
      });
      if (res) {
        toast.success("تم تحديث حالة البطاقة بنجاح");
        setPendingCardStatusToggle(null);
      } else {
        toast.error("حدث خطأ أثناء تحديث حالة البطاقة");
      }
    } catch (err: any) {
      handleErrorAlerts(err?.response?.data?.message || "حدث خطأ");
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">أسعار البطاقات</h1>
          <p className="text-gray-600 text-sm">إدارة أسعار البطاقات المتاحة</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة سعر جديد
        </button>
      </div>

      {/* Search and Stats */}
      {/* <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث بالسعر..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div> */}
      {isLoadingStatistics ? (
        <StatsCardsSkeleton
          count={3}
          gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-4"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-(--brand)">
              {cardStatistics?.data?.data?.total_cards ?? "-"}
            </p>
            <p className="text-sm text-gray-600">إجمالي الأسعار</p>
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-green-600">
              {cardStatistics?.data?.data?.active_cards ?? "-"}
            </p>
            <p className="text-sm text-gray-600"> الأسعار المفعلة</p>
          </div>{" "}
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand) text-center">
            <p className="text-2xl font-bold text-green-600">
              {cardStatistics?.data?.data?.inactive_cards ?? "-"}
            </p>
            <p className="text-sm text-gray-600"> الأسعار غير المفعلة</p>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {cards?.isLoading ? (
        <PricingCardsSkeleton />
      ) : !cards?.data?.data || cards?.data?.data.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة أسعار جديدة للمنصة</p>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة سعر جديد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {cardPricing?.map((card: any) => (
            <div
              key={card.id}
              className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header */}
              <div
                className={`p-6 text-white relative overflow-hidden ${
                  card.is_active
                    ? "bg-linear-to-br from-(--brand) to-(--brand-light)"
                    : "bg-linear-to-br from-gray-400 to-gray-500"
                }`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                <div className="relative z-10 text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{card.price}</div>
                  <div className="text-sm opacity-90">دينار أردني</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Status */}
                <div className="flex items-center justify-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      card?.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card?.is_active ? "مفعل" : "معطل"}
                  </span>
                </div>

                <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">
                      السعر الافتراضي للمكتبة
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {card?.default_library_price ?? "—"}
                      <span className="text-sm text-gray-500 ml-1"> د.أ</span>
                    </span>
                  </div>
                </div>

                <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">
                      السعر الافتراضي للمعلم
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {card.default_teacher_price ?? "—"}
                      <span className="text-sm text-gray-500 ml-1"> د.أ</span>
                    </span>
                  </div>
                </div>

                {/* Date */}
                <div className="text-center text-xs text-gray-500 mb-4">
                  تم الإنشاء:{" "}
                  {formatDateTimeSimple(card?.createdAt || card?.created_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2">
                  {/* Toggle Status */}
                  <div
                    className={`p-2 rounded-lg transition-colors flex gap-2 items-center ${
                      card.is_active
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <StatusToggleButton
                      isOn={Boolean(card.is_active)}
                      onToggle={() => requestCardStatusToggle(card)}
                      titleOn="تعطيل البطاقة"
                      titleOff="تفعيل البطاقة"
                      className="p-0"
                    />
                    <span className="text-sm">
                      {card.is_active ? "تعطيل البطاقة" : "تفعيل البطاقة"}
                    </span>
                  </div>

                  {/* Edit */}
                  <EditButton
                    onClick={() => {
                      setSelectedCard(card);
                      setShowEditModal(true);
                    }}
                    className="cursor-pointer p-2 text-gray-400 hover:text-(--brand) hover:bg-gray-50 rounded-lg transition-colors"
                    title="تعديل السعر"
                  />

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
          ))}

          {cards?.data?.data?.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ? "لا توجد نتائج" : "لا توجد أسعار"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "لم يتم العثور على أسعار تطابق البحث"
                  : "ابدأ بإضافة سعر جديد للبطاقات"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  إضافة سعر جديد
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showAddModal && (
        <AddCardPricing
          setShowAddModal={setShowAddModal}
          setNewCard={setNewCard}
          newCard={newCard}
        />
      )}
      {showEditModal && (
        <EditCardPricing
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          setShowEditModal={setShowEditModal}
          setCardPricing={setCardPricing}
        />
      )}

      {pendingCardStatusToggle && (
        <ConfirmationModal
          open
          onClose={() => !isUpdatingCard && setPendingCardStatusToggle(null)}
          onConfirm={confirmCardStatusToggle}
          title={
            pendingCardStatusToggle.isActive ? "تعطيل البطاقة" : "تفعيل البطاقة"
          }
          variant={pendingCardStatusToggle.isActive ? "danger" : "success"}
          confirmLabel={
            pendingCardStatusToggle.isActive ? "نعم، تعطيل" : "نعم، تفعيل"
          }
          isPending={isUpdatingCard}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingCardStatusToggle.isActive ? "تعطيل" : "تفعيل"}
                </span>{" "}
                هذه البطاقة؟
              </p>
              <p className="text-sm text-gray-600">
                السعر:{" "}
                <span
                  className="font-semibold text-(--brand-secondary)"
                  dir="ltr"
                >
                  {pendingCardStatusToggle.price}
                </span>
              </p>
            </>
          }
        />
      )}
    </div>
  );
};

export default CardPricingPage;
