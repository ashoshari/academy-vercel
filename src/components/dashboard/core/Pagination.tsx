import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

interface PaginationProps {
  small?: boolean;
  currentPage: number;
  count: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}

const getPageRange = (current: number, total: number): (number | "...")[] => {
  const delta = 1;
  const range: (number | "...")[] = [];

  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  if (left > 2) range.push(1, "...");
  else range.push(1);

  for (let i = left; i <= right; i++) range.push(i);

  if (right < total - 1) range.push("...", total);
  else if (right === total - 1) range.push(total);

  return range;
};

export default function Pagination({
  small,
  currentPage,
  count,
  onPageChange,
  pageSize = 20,
}: PaginationProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Detect small screens dynamically
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(count / pageSize);
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  // Combine conditions (screen small OR prop small)
  const compact = small || isSmallScreen;

  return (
    <div className="flex justify-center items-center gap-1.5 sm:gap-2 self-center mt-8 rtl:flex-row-reverse">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`cursor-pointer flex items-center justify-center ${
          compact
            ? "px-2 py-1.5 text-xs rounded-lg"
            : "px-3 py-2 text-sm rounded-xl"
        } bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors`}
      >
        <ChevronRight className="rtl:hidden w-4 h-4" />
        <ChevronLeft className="hidden rtl:inline w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className={`flex items-center justify-center text-gray-400 ${
              compact ? "px-2 py-1.5" : "px-3 py-2"
            }`}
          >
            <MoreHorizontal size={compact ? 14 : 16} />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`cursor-pointer border font-medium transition-all ${
              compact
                ? "px-2.5 py-1.5 text-xs rounded-lg"
                : "px-4 py-2 text-sm rounded-xl"
            } ${
              page === currentPage
                ? "bg-(--brand) text-white border-(--brand)"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`cursor-pointer flex items-center justify-center ${
          compact
            ? "px-2 py-1.5 text-xs rounded-lg"
            : "px-3 py-2 text-sm rounded-xl"
        } bg-white border text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors`}
      >
        <ChevronLeft className="rtl:hidden w-4 h-4" />
        <ChevronRight className="hidden rtl:inline w-4 h-4" />
      </button>
    </div>
  );
}
