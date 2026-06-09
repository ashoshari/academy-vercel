import { Check } from "lucide-react";

interface BrandCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function BrandCheckbox({
  id,
  label,
  checked,
  onChange,
}: BrandCheckboxProps) {
  return (
    <label className="brand-checkbox" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="brand-checkbox__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="brand-checkbox__box" aria-hidden="true">
        <Check strokeWidth={3} />
      </span>
      <span className="brand-checkbox__label">{label}</span>
    </label>
  );
}
