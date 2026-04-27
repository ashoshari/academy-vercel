import { X, Save, BookOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type MaterialFormModalProps = {
  open: boolean;
  title: string;
  initialName?: string;
  submitLabel: string;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (payload: { name: string }) => void | Promise<void>;
};

export default function MaterialFormModal({
  open,
  title,
  initialName = "",
  submitLabel,
  isPending = false,
  onClose,
  onSubmit,
}: MaterialFormModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (!open) return;
    setName(initialName ?? "");
  }, [open, initialName]);

  const trimmed = useMemo(() => name.trim(), [name]);
  const isValid = trimmed.length > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-(--brand) overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-linear-to-l from-white to-orange-50/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                <BookOpen className="h-5 w-5 text-(--brand)" strokeWidth={2} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                <p className="text-xs text-gray-500">إدارة المواد داخل المنصة</p>
              </div>
            </div>

            <button
              onClick={() => !isPending && onClose()}
              disabled={isPending}
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60 disabled:pointer-events-none"
              title="إغلاق"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المادة *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: Math"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end bg-gray-50/80">
          <button
            type="button"
            onClick={() => !isPending && onClose()}
            disabled={isPending}
            className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:pointer-events-none"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={() => void onSubmit({ name: trimmed })}
            disabled={isPending || !isValid}
            className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isPending ? "جاري الحفظ…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

