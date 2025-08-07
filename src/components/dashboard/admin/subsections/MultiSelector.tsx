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
}

const MultiSelectAutocomplete: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = "اختر...",
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const available = options
    .filter((o) => !value?.includes(o.id))
    .filter((o) => o.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const add = (id: string) => {
    onChange([...value, id]);
    setQuery("");
  };
  const remove = (id: string) => onChange(value.filter((v) => v !== id));

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex flex-wrap items-center gap-2 px-3 py-[9px] border rounded-lg
                    ${
                      open
                        ? "border-orange-500 ring-1 ring-orange-500"
                        : "border-gray-200"
                    }
                    focus-within:border-orange-500`}
        onClick={() => setOpen(true)}
      >
        {value?.map((id) => {
          const opt = options.find((o) => o.id === id)!;
          return (
            <span
              key={id}
              className="flex items-center gap-1 bg-orange-100 text-orange-800 text-xs
                        rounded-full pl-2 pr-1 py-1"
            >
              {opt.title}
              <button
                onClick={(e) => {
                  e.stopPropagation();
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
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm"
          placeholder={placeholder}
          dir="rtl"
        />
      </div>

      {open && available.length > 0 && (
        <ul
          className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white
                    border border-gray-200 rounded-lg shadow-lg space-y-1 py-1"
        >
          {available.map((o) => (
            <li
              key={o.id}
              onClick={() => {
                add(o.id);
                setOpen(true);
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
