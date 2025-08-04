/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Hash,
  Link,
} from "lucide-react";

export default function TreeItem({
  getMainSectionIcon,
  getMainSectionColor,
  item,
  isExpanded,
  toggleExpanded,
  type,
  index,
}: // showSubsub,
// setShowSubsub,
// setExpand,
{
  getMainSectionIcon: (id: any) => any;
  getMainSectionColor: (id: any) => any;
  item: any;
  index: number;
  isExpanded?: boolean;
  toggleExpanded?: (id: any) => any;
  // showSubsub?: { id: string; state: boolean };
  // setShowSubsub?: (showSubsub: { id: string; state: boolean }) => any;
  type: any;
}) {
  const hasChildren =
    (type === "subsections" && item?.subsubsections?.length > 0) ||
    (type === "subsubsections" && item?.specializations?.length > 0) ||
    (type === "specializations" && item?.specialization_materials?.length > 0);
  return (
    <div
      className={`bg-white/95 backdrop-blur-xl rounded-lg shadow-sm border border-orange-100/50 hover:shadow-md transition-all duration-300`}
      style={{
        marginRight: `${(index - 1) * 26}px`,
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Expand/Collapse Button */}
          <div className="flex items-center gap-2 shrink-0">
            {hasChildren ? (
              <button
                onClick={() => {
                  toggleExpanded?.(item.id);
                }}
                className="p-1 hover:bg-orange-50 rounded transition-colors"
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
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2 ml-4">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Hash size={12} />
                  المستوى
                  {index}
                </span>
              </div>
            </div>

            {/* Linked Sections */}
            {item?.sections?.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Link size={14} className="text-gray-400" />
                <div className="flex gap-1 flex-wrap">
                  {item?.sections?.map((sec: any) => {
                    const section = item?.sections?.find(
                      (s: any) => s.id === sec.id
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

            {/* Stats and Actions */}
            {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{item.studentsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} />
                      <span>{item.itemsCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{item.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedSubsection(item);
                        setShowLinkModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="ربط بالأقسام الرئيسية"
                    >
                      <Link size={16} />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedSubsection(item);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      title="تعديل القسم"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDeleteSubsection(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف القسم"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
