/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [selectedLibrary, setSelectedLibrary] = useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<string[]>([]);

  const addPrice = useCustomPost(`cards/user-card-prices/`, [
    "user-card-prices",
  ]);

  const dataLibraries = useCustomQuery(
    `account/admin/libraries/?page_size=${99999}&page=1`,
    ["libraries-custom-card"]
  );

  const dataTeachers = useCustomQuery(
    `account/admin/teachers/?page_size=${99999}&page=1`,
    ["teachers-custom-card"]
  );

  const dataCards = useCustomQuery(`cards/?page_size=${99999}&page=1`, [
    "cards-custom-card",
  ]);

  const handleSavePrice = async () => {
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
              dataLibraries?.data?.data.map((s: User) => ({
                ...s,
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
              dataTeachers?.data?.data.map((s: User) => ({
                ...s,
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
              dataCards?.data?.data.map((s: CardPricing) => ({
                ...s,
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
            className="px-3 py-2 border-gray-200 border focus:border-orange-500 outline-0 focus-within:ring-1 focus-within:ring-orange-500 rounded-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="cursor-pointer rounded-lg border border-gray-200 px-6 py-2 text-gray-600 hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              onClick={handleSavePrice}
              className="cursor-pointer flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-white hover:from-orange-600 hover:to-orange-700"
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
