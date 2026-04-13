import { ReactNode } from "react";

const TABLE_CARD =
  "w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden";

type SalesTableSectionProps = {
  title: string;
  count: number;
  countLabel: string;
  children: ReactNode;
};

function SalesTableSection({
  title,
  count,
  countLabel,
  children,
}: SalesTableSectionProps) {
  return (
    <div className={TABLE_CARD}>
      <div className="p-6 border-b border-gray-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <div className="bg-gray-50 rounded-lg px-4 py-2 shrink-0">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {count} {countLabel}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto w-full min-w-0">{children}</div>
    </div>
  );
}

export default SalesTableSection;
