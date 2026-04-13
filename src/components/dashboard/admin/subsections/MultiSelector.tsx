import React, { useState, useRef, useEffect } from "react";

interface Option {
  id: string;
  title: string;
}

interface Props {
  options: Option[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  single?: boolean;
  disabled?: boolean;
  big?: boolean;
  fullHeight?: boolean;
}

const MultiSelectAutocomplete: React.FC<Props> = ({
  options,
  value,
  big,
  onChange,
  placeholder = "اختر...",
  single = false,
  fullHeight = false,
  disabled = false,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const available = options
    ?.filter((o) => !value?.includes(o.id))
    .filter((o) => o.title?.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const add = (id: string) => {
    console.log("id", id);
    console.log("value", value);
    if (disabled) return;
    onChange(single ? [id] : [...value, id]);
    setQuery("");
    if (single) {
      setOpen(false);
    }
  };

  const remove = (id: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== id));
  };

  return (
    <div className={`relative ${fullHeight && "h-full"}`} ref={containerRef}>
      <div
        className={`flex flex-wrap items-center gap-2 px-3 ${
          big ? "py-4.25" : "py-2.25"
        } border rounded-lg
          ${
            open ? "border-(--brand) ring-1 ring-orange-500" : "border-gray-200"
          }
          focus-within:border-(--brand) ${fullHeight && "h-full"}`}
        onClick={() => {
          if (disabled) return;
          setOpen(true);
        }}
      >
        {value?.map((id) => {
          const opt = options.find((o) => o.id === id);
          if (!opt) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-1 bg-orange-100 text-(--brand) text-xs
                        rounded-full pl-2 pr-1 py-1"
            >
              {opt.title}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (disabled) return;
                  remove(id);
                }}
                className="w-4 h-4 flex items-center justify-center hover:text-red-600"
              >
                ×
              </button>
            </span>
          );
        })}

        <input
          value={query}
          onChange={(e) => {
            if (disabled) return;
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          readOnly={disabled}
          aria-disabled={disabled}
          className="flex-1 min-w-20 bg-transparent outline-none text-sm read-only:cursor-not-allowed"
          placeholder={placeholder}
          dir="rtl"
        />
      </div>

      {open && !disabled && available.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white
                    border border-gray-200 rounded-lg shadow-lg space-y-1 py-1"
        >
          {available.map((o) => (
            <li
              key={o.id}
              onClick={() => {
                if (disabled) return;
                add(o.id);
                if (!single) setOpen(true);
              }}
              className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm"
            >
              {o.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectAutocomplete;
