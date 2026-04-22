import type { ButtonHTMLAttributes } from "react";
import { Eye } from "lucide-react";

type DetailsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  iconSize?: number;
};

export default function DetailsButton({
  title = "عرض التفاصيل",
  iconSize = 18,
  className = "cursor-pointer p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors",
  ...props
}: DetailsButtonProps) {
  return (
    <button type="button" title={title} className={className} {...props}>
      <Eye size={iconSize} />
    </button>
  );
}
