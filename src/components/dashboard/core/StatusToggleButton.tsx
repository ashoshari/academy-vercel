import { ToggleLeft, ToggleRight } from "lucide-react";

export default function StatusToggleButton({
  isOn,
  onToggle,
  titleOn = "إلغاء التفعيل",
  titleOff = "تفعيل",
  disabled = false,
  className = "",
}: {
  isOn: boolean;
  onToggle: () => void;
  titleOn?: string;
  titleOff?: string;
  disabled?: boolean;
  className?: string;
}) {
  const title = isOn ? titleOn : titleOff;
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={[
        "cursor-pointer p-1 rounded-full transition-colors",
        isOn ? "text-green-600" : "text-gray-400",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {isOn ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
    </button>
  );
}
