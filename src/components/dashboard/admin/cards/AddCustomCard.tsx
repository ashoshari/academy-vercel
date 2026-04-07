import { useCustomPost } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import { CardPricing } from "@/pages/dashboard/admin/cards/CardPricingPage";
import { User } from "@/services/auth";
import { Save, X } from "lucide-react";
import { useState } from "react";
import MultiSelectAutocomplete from "../subsections/MultiSelector";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";

interface Props {
  setShowAddModal: (s: boolean) => void;
}

export default function AddCustomCard({ setShowAddModal }: Props) {
  const [amount, setAmount] = useState<number | "">("");
  // const [image, setImage] = useState<any>();
  const [selectedLibrary, setSelectedLibrary] = useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string[]>([]);

  const addPrice = useCustomPost(`cards/user-card-prices/`, [
    "user-card-prices",
  ]);

  const dataLibraries = useCustomQuery(
    `account/admin/libraries/?page_size=${99999}&page=1`,
    ["libraries-custom-card"],
  );

  const dataTeachers = useCustomQuery(
    `account/admin/teachers/?page_size=${99999}&page=1`,
    ["teachers-custom-card"],
  );

  const dataCards = useCustomQuery(`cards/?page_size=${99999}&page=1`, [
    "cards-custom-card",
  ]);

  const filteredLibraries: User[] = dataLibraries?.data?.data?.filter(
    (u: User) => u.is_active,
  );
  const filteredTeachers: User[] = dataTeachers?.data?.data?.filter(
    (u: User) => u.is_active,
  );
  const filteredCards: CardPricing[] = dataCards?.data?.data?.filter(
    (c: CardPricing) => c.is_active,
  );
  const targetCard: CardPricing = dataCards?.data?.data?.find(
    (c: CardPricing) => c.id === selectedCard[0],
  );

  const handleSavePrice = async () => {
    if (Number(amount) >= targetCard.price) {
      toast.error("لا يمكن تخصيص سعر أعلي من السعر الأصلي للبطاقة");
      return;
    }
    // const formData = new FormData();
    // image && formData.append("image", image);
    // amount && formData.append("price", String(amount ?? 0));
    // selectedCard[0] && formData.append("card", String(selectedCard[0]));
    // selectedLibrary[0] && formData.append("user", String(selectedLibrary[0]));
    // selectedTeacher[0] && formData.append("user", String(selectedTeacher[0]));

    const body = {
      user:
        selectedLibrary.length > 0 ? selectedLibrary[0] : selectedTeacher[0],
      card: selectedCard[0],
      price: amount ?? 0,
    };
    try {
      const res = await addPrice.mutateAsync(body);
      if (res?.status) {
        toast.success("تم اضافة السعر");
        setShowAddModal(false);
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setShowAddModal(false)}
          className="cursor-pointer absolute top-4 left-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          اضافة سعر مخصص جديد
        </h2>

        <div className="flex items-stretch w-full justify-start gap-4 flex-col">
          <MultiSelectAutocomplete
            onChange={setSelectedLibrary}
            options={
              filteredLibraries?.map((s: User) => ({
                id: String(s.id),
                title: `${s.name} (${s.mobile_number})`,
              })) || []
            }
            value={selectedLibrary}
            placeholder="اختر مكتبة ..."
            single={true}
            disabled={selectedTeacher.length > 0}
          />

          <MultiSelectAutocomplete
            onChange={setSelectedTeacher}
            options={
              filteredTeachers?.map((s: User) => ({
                id: String(s.id),
                title: `${s.name} (${s.mobile_number})`,
              })) || []
            }
            value={selectedTeacher}
            placeholder="اختر معلم ..."
            single={true}
            disabled={selectedLibrary.length > 0}
          />

          <MultiSelectAutocomplete
            onChange={setSelectedCard}
            options={
              filteredCards?.map((s: CardPricing) => ({
                id: String(s.id),
                title: `بطاقة ${s.price} دينار أردني`,
              })) || []
            }
            value={selectedCard}
            placeholder="اختر بطاقة ..."
            single={true}
          />

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value ? Number(e.target.value) : "")
            }
            placeholder="أدخل المبلغ"
            className="px-3 py-2 border-gray-200 border focus:border-(--brand) outline-0 focus-within:ring-1 focus-within:ring-orange-500 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
              }
              if (e.key === "Enter") {
                e.preventDefault();
                handleSavePrice();
              }
            }}
          />
          {/* Media */}
          {/* <div className="flex flex-col gap-2">
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
                  setImage(e.target.files?.[0]);
                }}
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
              />

              <span id="fileName" className="text-sm text-gray-500">
                {image ? image?.name : "لم يتم اختيار صورة"}
              </span>
              {(typeof image === "string" || image instanceof File) && (
                <img
                  loading="lazy"
                  src={
                    image instanceof File ? URL.createObjectURL(image) : image
                  }
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded"
                />
              )}
            </div>
          </div> */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="cursor-pointer rounded-lg border border-gray-200 px-6 py-2 text-gray-600 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleSavePrice}
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-linear-to-r from-(--brand) to-(--brand-light) px-6 py-2 text-white hover:from-(--brand-light) hover:to-(--brand)"
            >
              <Save size={16} />
              حفظ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
