/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import {
  Plus,
  Save,
  X,
  CreditCard,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import Spinner from "@/components/dashboard/Spinner";
import { formatDateTimeSimple } from "@/utils/formatDateTime";

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
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [searchTerm, _] = useState("");

  const [newCard, setNewCard] = useState<Partial<CardPricing>>({
    price: 0,
    is_active: true,
  });

  const cardStatistics = useCustomQuery("/cards/statistics/", [
    "card-statistics",
  ]);

  const cards = useCustomQuery("cards/", ["cards"]);
  const addCard = useCustomPost("cards/", ["cards", "card-statistics"]);
  const updateCard = useCustomUpdate(`cards/${selectedCard}/`, [
    "cards",
    "card-statistics",
  ]);

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
          String(newCard.default_teacher_price)
        );
      if (newCard.default_library_price)
        formData.append(
          "default_library_price",
          String(newCard.default_library_price)
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
      .catch((err) => {
        handleErrorAlerts(err?.response?.data?.message || "حدث خطاء");
      });
  };

  //   const handleEditCard = () => {
  //     if (selectedCard && selectedCard.price && selectedCard.price > 0) {
  //       setCardPricing(
  //         cardPricing.map((card) =>
  //           card.id === selectedCard.id ? selectedCard : card
  //         )
  //       );
  //       setShowEditModal(false);
  //       setSelectedCard(null);
  //     }
  //   };

  //   const handleDeleteCard = (id: number) => {
  //     if (confirm("هل أنت متأكد من حذف هذا السعر؟")) {
  //       setCardPricing(cardPricing.filter((card) => card.id !== id));
  //     }
  //   };

  const toggleCardStatus = (id: number) => {
    setSelectedCard(id);
    const is_active = cards?.data?.data.filter(
      (card: any) => card.id === id
    )[0];

    updateCard
      .mutateAsync({
        is_active: !is_active.is_active,
      })
      .then((res) => {
        if (res) {
          toast.success("تم تحديث حالة البطاقة بنجاح");
        } else {
          toast.error("حدث خطأ أثناء تحديث حالة البطاقة");
        }
      })
      .catch((err) => {
        handleErrorAlerts(err?.response?.data?.message || "حدث خطأ");
      });
  };

  //   const EditCardModal = () => (
  //     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  //       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
  //         <div className="p-6 border-b border-gray-200">
  //           <div className="flex items-center justify-between">
  //             <h2 className="text-xl font-bold text-gray-800">تعديل السعر</h2>
  //             <button
  //               onClick={() => setShowEditModal(false)}
  //               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
  //             >
  //               <X size={20} />
  //             </button>
  //           </div>
  //         </div>

  //         {selectedCard && (
  //           <div className="p-6 space-y-6">
  //             {/* Price */}
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 mb-2">
  //                 السعر (دينار أردني)
  //               </label>
  //               <div className="relative">
  //                 <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
  //                 <input
  //                   type="number"
  //                   value={selectedCard.price}
  //                   onChange={(e) =>
  //                     setSelectedCard({
  //                       ...selectedCard,
  //                       price: parseFloat(e.target.value) || 0,
  //                     })
  //                   }
  //                   className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
  //                   placeholder="أدخل السعر..."
  //                   min="0"
  //                   step="0.01"
  //                 />
  //               </div>
  //             </div>

  //             {/* Status Toggle */}
  //             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //               <div>
  //                 <p className="font-medium text-gray-800">مفعل</p>
  //                 <p className="text-sm text-gray-500">متاح للاستخدام</p>
  //               </div>
  //               <button
  //                 onClick={() =>
  //                   setSelectedCard({
  //                     ...selectedCard,
  //                     isActive: !selectedCard.isActive,
  //                   })
  //                 }
  //                 className={`p-1 rounded-full transition-colors ${
  //                   selectedCard.isActive ? "text-green-600" : "text-gray-400"
  //                 }`}
  //               >
  //                 {selectedCard.isActive ? (
  //                   <ToggleRight size={24} />
  //                 ) : (
  //                   <ToggleLeft size={24} />
  //                 )}
  //               </button>
  //             </div>
  //           </div>
  //         )}

  //         <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
  //           <button
  //             onClick={() => setShowEditModal(false)}
  //             className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
  //           >
  //             إلغاء
  //           </button>
  //           <button
  //             onClick={handleEditCard}
  //             className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
  //           >
  //             <Save size={16} />
  //             حفظ التغييرات
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );

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
          className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Plus size={16} />
          إضافة سعر جديد
        </button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* <div className="lg:col-span-2">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث بالسعر..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
              />
            </div>
          </div>
        </div> */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-orange-600">
            {cardStatistics?.data?.data?.total_cards || "-"}
          </p>
          <p className="text-sm text-gray-600">إجمالي الأسعار</p>
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {cardStatistics?.data?.data?.active_cards || "-"}
          </p>
          <p className="text-sm text-gray-600"> الأسعار المفعلة</p>
        </div>{" "}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-orange-100/50 text-center">
          <p className="text-2xl font-bold text-green-600">
            {cardStatistics?.data?.data?.inactive_cards || "-"}
          </p>
          <p className="text-sm text-gray-600"> الأسعار غير المفعلة</p>
        </div>
      </div>

      {/* Cards Grid */}
      {cards?.isLoading ? (
        <div className="flex justify-center">
          <Spinner size={40} thickness={4} className="text-orange-500" />
        </div>
      ) : !cards?.data?.data || cards?.data?.data.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            لا توجد نتائج
          </h3>
          <p className="text-gray-500 mb-6">ابدأ بإضافة أسعار جديدة للمنصة</p>

          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            إضافة سعر جديد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {cards?.data?.data.map((card: any) => (
            <div
              key={card.id}
              className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header */}
              <div
                className={`p-6 text-white relative overflow-hidden ${
                  card.is_active
                    ? "bg-gradient-to-br from-orange-500 to-orange-600"
                    : "bg-gradient-to-br from-gray-400 to-gray-500"
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
                      card.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card.is_active ? "مفعل" : "معطل"}
                  </span>
                </div>

                <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 mb-1">
                      السعر الافتراضي للمكتبة
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {card.default_library_price ?? "—"}
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
                  تم الإنشاء: {formatDateTimeSimple(card.created_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-2">
                  {/* Toggle Status */}
                  <button
                    onClick={() => toggleCardStatus(card.id)}
                    className={`p-2 rounded-lg transition-colors flex gap-2 items-center cursor-pointer ${
                      card.is_active
                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                        : "text-gray-400 bg-gray-50 hover:bg-gray-100"
                    }`}
                    title={card.is_active ? "تعطيل البطاقة" : "تفعيل البطاقة"}
                  >
                    {card.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                    <span className="text-sm">
                      {" "}
                      {card.is_active ? "تعطيل البطاقة" : "تفعيل البطاقة"}
                    </span>
                  </button>

                  {/* Edit */}
                  {/* <button
                  onClick={() => {
                    setSelectedCard(card);
                    setShowEditModal(true);
                  }}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
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
          ))}

          {cards?.data?.data?.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
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
                  className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  إضافة سعر جديد
                </h2>
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
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                        default_teacher_price: Math.min(
                          value,
                          newCard.price || 0
                        ),
                      });
                    }}
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="ادخل سعر المدرس..."
                    min="0"
                    step="1"
                  />
                </div>
              </div>
              {/* teacher_price */}

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
                        default_library_price: Math.min(
                          value,
                          newCard.price || 0
                        ),
                      });
                    }}
                    className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
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
                    className="cursor-pointer px-4 py-3 bg-orange-500 text-white text-sm font-medium rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
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
                    {newCard?.image
                      ? newCard?.image?.name
                      : "لم يتم اختيار صورة"}
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
                    : "cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                }`}
              >
                <Save size={16} />
                حفظ السعر
              </button>
            </div>
          </div>
        </div>
      )}
      {/* {showEditModal && <EditCardModal />} */}
    </div>
  );
};

export default CardPricingPage;
