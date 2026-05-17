import { useState } from "react";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { X, Save, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCustomPost } from "@/hooks/useMutation";

interface InstallmentLine {
  name: string;
  amount: string;
  due_after_days: number;
  order: number;
}

interface AddInstallmentPlanProps {
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddInstallmentPlan = ({ setShowAddModal }: AddInstallmentPlanProps) => {
  const [name, setName] = useState("");
  const [lines, setLines] = useState<InstallmentLine[]>([
    { name: "", amount: "", due_after_days: 0, order: 0 },
  ]);

  const addPlan = useCustomPost("/cards/installments/", ["installments"]);

  const handleAddLine = () => {
    setLines([
      ...lines,
      { name: "", amount: "", due_after_days: 0, order: lines.length },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length > 1) {
      const newLines = lines.filter((_, i) => i !== index);
      // Re-adjust order
      const adjustedLines = newLines.map((line, i) => ({ ...line, order: i }));
      setLines(adjustedLines);
    }
  };

  const handleLineChange = (
    index: number,
    field: keyof InstallmentLine,
    value: any,
  ) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const handleAddPlan = () => {
    if (!name.trim()) {
      toast.error("يرجى إدخال اسم الخطة");
      return;
    }

    if (lines.some((line) => !line.name.trim() || !line.amount)) {
      toast.error("يرجى تعبئة جميع حقول الدفعات بشكل صحيح");
      return;
    }

    const payload = {
      name,
      lines,
    };

    addPlan
      .mutateAsync(payload)
      .then(() => {
        toast.success("تم إضافة خطة التقسيط بنجاح");
        setShowAddModal(false);
      })
      .catch((error: any) => {
        handleErrorAlerts(error?.response?.data?.message || "حدث خطأ");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              إضافة خطة تقسيط جديدة
            </h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الخطة *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              placeholder="مثال: خطة 3 دفعات ميسرة"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                الدفعات *
              </label>
              <button
                onClick={handleAddLine}
                className="btn-brand-slide px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Plus size={14} />
                إضافة دفعة
              </button>
            </div>

            <div className="space-y-4">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg relative"
                >
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      اسم الدفعة
                    </label>
                    <input
                      type="text"
                      value={line.name}
                      onChange={(e) =>
                        handleLineChange(index, "name", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-(--brand)"
                      placeholder="مثال: الدفعة الأولى"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      المبلغ
                    </label>
                    <input
                      type="number"
                      value={line.amount}
                      onChange={(e) =>
                        handleLineChange(index, "amount", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-(--brand)"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      الاستحقاق (بالأيام)
                    </label>
                    <input
                      type="number"
                      value={line.due_after_days}
                      onChange={(e) =>
                        handleLineChange(
                          index,
                          "due_after_days",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-(--brand)"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  {lines.length > 1 && (
                    <button
                      onClick={() => handleRemoveLine(index)}
                      className="absolute top-2 left-2 md:static md:mt-5 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="حذف الدفعة"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white flex gap-3 justify-end z-10">
          <button
            onClick={() => setShowAddModal(false)}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleAddPlan}
            disabled={!name.trim() || addPlan.isPending}
            className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2
                ${
                  !name.trim() || addPlan.isPending
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-brand-slide text-white"
                }`}
          >
            <Save size={16} />
            {addPlan.isPending ? "جاري الحفظ..." : "حفظ الخطة"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddInstallmentPlan;
