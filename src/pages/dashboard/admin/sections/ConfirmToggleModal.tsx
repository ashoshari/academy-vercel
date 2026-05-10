import { X } from "lucide-react";

export const ConfirmToggleModal = ({
  onClose,
  onConfirm,
  sectionName,
  isEnabled,
  isPending,
}: {
  onClose: () => void;
  onConfirm: () => void;
  sectionName: string;
  isEnabled: boolean;
  isPending: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">تأكيد الإجراء</h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-right space-y-4">
          <p className="text-gray-700 text-base font-medium">
            هل أنت متأكد من {isEnabled ? "إخفاء" : "إظهار"} القسم
            <span className="font-bold text-(--brand)"> {sectionName}</span>؟
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`cursor-pointer px-5 py-2 rounded-lg text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isEnabled
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            نعم، {isEnabled ? "إخفاء" : "إظهار"}
          </button>
        </div>
      </div>
    </div>
  );
};
