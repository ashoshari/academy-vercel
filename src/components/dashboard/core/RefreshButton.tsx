import type { ButtonHTMLAttributes } from "react";
import { RefreshCcw, RefreshCw } from "lucide-react";

type RefreshButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  iconSize?: number;
  direction?: "cw" | "ccw";
};

export default function RefreshButton({
  title = "تحديث",
  iconSize = 16,
  direction = "cw",
  className = "cursor-pointer p-1 text-gray-400 hover:text-purple-600 transition-colors",
  ...props
}: RefreshButtonProps) {
  const Icon = direction === "ccw" ? RefreshCcw : RefreshCw;
  return (
    <button type="button" title={title} className={className} {...props}>
      <Icon size={iconSize} />
    </button>
  );
}

