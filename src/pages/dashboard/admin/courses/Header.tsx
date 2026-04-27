import { Plus } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type CourseView = "list" | "create" | "clone" | "edit" | "content" | "activate";

function Header({
  setCurrentView,
}: {
  setCurrentView: Dispatch<SetStateAction<CourseView>>;
}) {
  return (
    <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">إدارة الدورات</h1>
        <p className="text-gray-600 text-sm">
          إدارة شاملة لجميع الدورات التعليمية في المنصة
        </p>
      </div>
      <button
        onClick={() => setCurrentView("create")}
        className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
      >
        <Plus size={16} />
        إنشاء دورة جديدة
      </button>
    </div>
  );
}

export default Header;
