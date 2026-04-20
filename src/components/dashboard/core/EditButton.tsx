import type { ButtonHTMLAttributes } from "react";
import { Edit } from "lucide-react";

type EditButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title?: string;
  iconSize?: number;
};

export default function EditButton({
  title = "تعديل",
  iconSize = 16,
  className = "cursor-pointer p-1 text-gray-400 hover:text-(--brand) transition-colors",
  ...props
}: EditButtonProps) {
  return (
    <button type="button" title={title} className={className} {...props}>
      <Edit size={iconSize} />
    </button>
  );
}

