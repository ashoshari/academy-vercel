import { X, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ConfirmationModalVariant = "danger" | "success" | "neutral";

export type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: ConfirmationModalVariant;
  icon?: LucideIcon;
  isPending?: boolean;
};

const variantClass: Record<
  ConfirmationModalVariant,
  { confirm: string; ring: string; iconWrap: string; icon: string }
> = {
  danger: {
    confirm:
      "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
    ring: "ring-red-500/20",
    iconWrap: "bg-red-50",
    icon: "text-red-600",
  },
  success: {
    confirm:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
    ring: "ring-emerald-500/20",
    iconWrap: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  neutral: {
    confirm:
      "btn-brand-slide text-white hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand) focus-visible:ring-offset-2",
    ring: "ring-(--brand)/20",
    iconWrap: "bg-gray-50",
    icon: "text-(--brand)",
  },
};

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title = "تأكيد الإجراء",
  description,
  confirmLabel,
  cancelLabel = "إلغاء",
  variant = "neutral",
  icon: Icon,
  isPending = false,
}: ConfirmationModalProps) {
  const styles = variantClass[variant];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isPending) onClose();
    },
    [isPending, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, handleKeyDown]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="إغلاق"
        disabled={isPending}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer disabled:pointer-events-none"
        onClick={() => !isPending && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
        className={`relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ${styles.ring} border border-(--brand) overflow-hidden`}
      >
        <div
          dir="rtl"
          className="flex items-start justify-between gap-3 border-b border-gray-100 bg-linear-to-l from-white to-orange-50/40 px-5 py-4"
        >
          <div className="flex items-center gap-3 min-w-0 text-right">
            {Icon ? (
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.iconWrap}`}
              >
                <Icon className={`h-5 w-5 ${styles.icon}`} strokeWidth={2} />
              </span>
            ) : null}
            <div className="min-w-0 pt-0.5">
              <h2
                id="confirmation-modal-title"
                className="text-lg font-bold text-gray-900 leading-snug"
              >
                {title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => !isPending && onClose()}
            disabled={isPending}
            className="cursor-pointer shrink-0 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:pointer-events-none"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <div className="px-5 py-5 text-right text-gray-700 leading-relaxed space-y-3">
          {description}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 bg-gray-50/80 px-5 py-4">
          <button
            type="button"
            onClick={() => !isPending && onClose()}
            disabled={isPending}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => void onConfirm()}
            disabled={isPending}
            className={`cursor-pointer min-w-28 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-60 disabled:pointer-events-none ${styles.confirm}`}
          >
            {isPending ? "جاري التنفيذ…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
