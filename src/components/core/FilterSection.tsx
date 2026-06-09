import { ChevronDown } from "lucide-react";
import { useState } from "react";
import BrandCheckbox from "./BrandCheckbox";

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  defaultOpen?: boolean;
}

export default function FilterSection({
  title,
  options,
  selected,
  onToggle,
  defaultOpen = true,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <button
        type="button"
        className="filter-section__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="filter-section__title">{title}</span>
        <ChevronDown
          className={`filter-section__chevron w-4 h-4${
            open ? " filter-section__chevron--open" : ""
          }`}
        />
      </button>

      {open && (
        <div className="filter-section__content">
          {options.map((option) => (
            <BrandCheckbox
              key={option.id}
              id={`filter-${option.id}`}
              label={option.label}
              checked={selected.has(option.id)}
              onChange={() => onToggle(option.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
