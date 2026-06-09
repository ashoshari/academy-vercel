import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface BrandPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPageRange = (
  current: number,
  total: number,
): (number | "...")[] => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const range: (number | "...")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
};

export default function BrandPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BrandPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageRange(currentPage, totalPages);

  return (
    <nav className="brand-pagination" aria-label="التنقل بين الصفحات">
      <button
        type="button"
        className="brand-pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="الصفحة السابقة"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="brand-pagination__ellipsis"
            aria-hidden="true"
          >
            <MoreHorizontal className="w-4 h-4" />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`brand-pagination__btn${
              page === currentPage ? " brand-pagination__btn--active" : ""
            }`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        className="brand-pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="الصفحة التالية"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    </nav>
  );
}
