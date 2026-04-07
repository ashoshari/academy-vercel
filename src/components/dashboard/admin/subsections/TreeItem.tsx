import { formatDate } from "@/services/date";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit,
  File,
  Folder,
  FolderOpen,
  Hash,
  Link,
  Plus,
} from "lucide-react";

export default function TreeItem({
  specialization,
  subsubSectionId,
  subSectionId,
  item,
  isExpanded,
  type,
  // index,
  getMainSectionIcon,
  getMainSectionColor,
  toggleExpanded,
  setShowEditModal,
  setSelectedSubsection,
  setShowLinkModal,
  setShowAddSubSubsectionModal,
  setShowEditSubSubsectionModal,
  setSelectedSubSubsection,
  setShowAddSpecializationsModal,
  setShowEditSpecializationsModal,
  setSelectedSpecialization,
  setShowEditMaterialModal,
  setSelectedMaterial,
  setShowAddMaterialModal,
}: {
  specialization?: string;
  subsubSectionId?: string;
  subSectionId?: string;
  item: any;
  index: number;
  isExpanded?: boolean;
  type: any;
  getMainSectionIcon: (id: any) => any;
  getMainSectionColor: (id: any) => any;
  toggleExpanded?: (id: any) => any;
  setShowEditModal?: (s: boolean) => any;
  setSelectedSubsection?: (s: any) => any;
  setShowLinkModal?: (s: boolean) => any;
  setShowAddSubSubsectionModal?: (s: boolean) => any;
  setShowEditSubSubsectionModal?: (s: boolean) => any;
  setSelectedSubSubsection?: (s: any) => any;
  setShowAddSpecializationsModal?: (s: boolean) => any;
  setShowEditSpecializationsModal?: (s: boolean) => any;
  setSelectedSpecialization?: (s: any) => any;
  setShowEditMaterialModal?: (s: boolean) => any;
  setSelectedMaterial?: (s: any) => any;
  setShowAddMaterialModal?: (s: boolean) => any;
}) {
  const hasChildren =
    (type === "subsections" && item?.subsubsections?.length > 0) ||
    (type === "subsubsections" && item?.specializations?.length > 0) ||
    (type === "specializations" && item?.specialization_materials?.length > 0);
  return (
    <div
      className={`bg-white/95 backdrop-blur-xl rounded-lg shadow-sm border border-orange-100/50 hover:shadow-md transition-all duration-300`}
      style={{
        marginRight: `${(type === "subsections" ? 0 : type === "subsubsections" ? 1 : 2) * 26}px`,
      }}
    >
      <div className="p-4">
        <div className="flex md:flex-row flex-col items-start gap-4">
          {/* Expand/Collapse Button */}
          <div className="flex items-center gap-2 shrink-0">
            {hasChildren ? (
              <button
                onClick={() => {
                  toggleExpanded?.(item.id);
                }}
                className="cursor-pointer p-1 hover:bg-orange-50 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown size={16} className="text-orange-600" />
                ) : (
                  <ChevronRight size={16} className="text-orange-600" />
                )}
              </button>
            ) : (
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
              </div>
            )}

            {/* Folder/File Icon */}
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen size={20} className="text-orange-500" />
              ) : (
                <Folder size={20} className="text-orange-500" />
              )
            ) : (
              <File size={20} className="text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-1">
                  {item.title || item.name || item.material}
                </h3>
                {item?.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {item?.description ?? ""}
                  </p>
                )}
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2 ml-4">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Hash size={12} />
                  المستوى
                  {type === "subsections"
                    ? " 1"
                    : type === "subsubsections"
                      ? " 2"
                      : " 3"}
                </span>
              </div>
            </div>

            {/* Linked Sections */}
            <div className="flex items-center gap-2 mb-3 justify-between">
              {item?.sections && item?.sections?.length > 0 && (
                <div className="flex items-center gap-2">
                  <Link size={14} className="text-gray-400" />
                  <div className="flex gap-1 flex-wrap">
                    {item?.sections?.map((sec: any) => {
                      const section = item?.sections?.find(
                        (s: any) => s.id === sec.id,
                      );
                      if (!section) return null;

                      const IconComponent = getMainSectionIcon(sec.id);
                      const colorClass = getMainSectionColor(sec.id);

                      return (
                        <span
                          key={sec.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs font-medium"
                        >
                          <IconComponent size={12} className={colorClass} />
                          {section.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {(type === "subsections" ||
                type === "subsubsections" ||
                type === "specializations") && (
                <button
                  onClick={() => {
                    if (type === "subsections") {
                      setSelectedSubsection?.(item);
                      setShowAddSubSubsectionModal?.(true);
                    } else if (type === "subsubsections") {
                      setSelectedSubSubsection?.(item);
                      setShowAddSpecializationsModal?.(true);
                    } else if (type === "specializations") {
                      setSelectedSpecialization?.(item);
                      setShowAddMaterialModal?.(true);
                    }
                  }}
                  className="cursor-pointer mr-auto p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  {type === "subsections"
                    ? "إضافة قسم فرعي"
                    : type === "subsubsections"
                      ? "إضافة تخصص"
                      : type === "specializations"
                        ? "إضافة مواد"
                        : ""}
                </button>
              )}
              {type === "subsubsections" && (
                <button
                  onClick={() => {
                    setSelectedSubSubsection?.(item);
                    // setSelectedSpecialization?.(item);
                    setShowAddMaterialModal?.(true);
                  }}
                  className=" p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  title=" إضافة مادة  "
                >
                  <Plus size={16} />
                  إضافة مادة
                </button>
              )}
            </div>

            {/* Stats and Actions */}
            <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {/* <div className="flex items-center gap-1">
                  <Users size={14} />
                  <span>{item.studentsCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen size={14} />
                  <span>{item.itemsCount}</span>
                </div> */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.is_published
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.is_published ? "مفعل" : "معطل"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {item?.created_at
                      ? formatDate(item.created_at)
                      : formatDate(new Date().toLocaleDateString())}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {type === "subsections" && (
                  <button
                    onClick={() => {
                      setSelectedSubsection?.(item);
                      setShowLinkModal?.(true);
                    }}
                    className="cursor-pointer p-2 text-gray-400 hover:text-(--brand-secondary) hover:bg-blue-50 rounded-lg transition-colors"
                    title="ربط بالأقسام الرئيسية"
                  >
                    <Link size={16} />
                  </button>
                )}

                <button
                  onClick={() => {
                    if (type === "subsections") {
                      setSelectedSubsection?.(item);
                      setShowEditModal?.(true);
                    } else if (type === "subsubsections") {
                      setSelectedSubSubsection?.({
                        ...item,
                        subsection: subSectionId,
                      });
                      setShowEditSubSubsectionModal?.(true);
                    } else if (type === "specializations") {
                      setSelectedSpecialization?.({
                        ...item,
                        subsubsection: subsubSectionId,
                      });
                      setShowEditSpecializationsModal?.(true);
                    } else {
                      setSelectedMaterial?.({
                        ...item,
                        specialization: specialization,
                      });
                      setShowEditMaterialModal?.(true);
                    }
                  }}
                  className="cursor-pointer p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  title="تعديل القسم"
                >
                  <Edit size={16} />
                </button>

                {/* <button
                  onClick={() => handleDeleteSubsection(item.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف القسم"
                >
                  <Trash2 size={16} />
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
