import type { ButtonHTMLAttributes } from "react";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  iconSize?: number;
};

export default function DeleteButton({
  title = "حذف",
  iconSize = 16,
  className = "cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors",
  ...props
}: DeleteButtonProps) {
  return (
    <button type="button" title={title} className={className} {...props}>
      <Trash2 size={iconSize} />
    </button>
  );
}

