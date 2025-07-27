import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  count: number;
  onPageChange: (page: number) => void;
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
  currentPage,
  count,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(count / 20);

  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-10 rtl:flex-row-reverse">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-white border rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight className="rtl:hidden" />
        <ChevronLeft className="hidden rtl:inline" />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={index}
            className="px-3 py-2 text-gray-400 select-none pointer-events-none"
          >
            <MoreHorizontal size={16} />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            className={`px-4 py-2 rounded-xl border font-medium ${
              page === currentPage
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-white border rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft className="rtl:hidden" />
        <ChevronRight className="hidden rtl:inline" />
      </button>
    </div>
  );
}
