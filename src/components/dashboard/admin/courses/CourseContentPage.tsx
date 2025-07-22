import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Folder,
  File,
  Video,
  Link,
  Clock,
  Save,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Target,
} from "lucide-react";

interface CourseContentPageProps {
  course: any;
  onBack: () => void;
  onUpdateCourse: (course: any) => void;
}

type ContentType = "chapter" | "unit" | "lesson" | "session";
type SessionType = "video" | "exam";

interface ContentItem {
  id: number;
  type: ContentType;
  title: string;
  description: string;
  order: number;
  isPublished: boolean;
  isFree: boolean;
  estimatedDuration: number;
  parentId?: number;
  sessionType?: SessionType;
  videoUrl?: string;
  examId?: number;
  children?: ContentItem[];
}

const CourseContentPage: React.FC<CourseContentPageProps> = ({
  course,
  onBack,
}) => {
  const [currentView, setCurrentView] = useState<"tree" | "add" | "edit">(
    "tree"
  );
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | ContentType | SessionType
  >("all");
  const [showUnpublished, setShowUnpublished] = useState(true);

  // تحويل بيانات الدورة إلى هيكل شجري
  const buildContentTree = (): ContentItem[] => {
    const items: ContentItem[] = [];

    course.chapters.forEach((chapter: any) => {
      const chapterItem: ContentItem = {
        id: chapter.id,
        type: "chapter",
        title: chapter.title,
        description: chapter.description,
        order: chapter.order,
        isPublished: chapter.isPublished,
        isFree: chapter.isFree,
        estimatedDuration: chapter.estimatedDuration,
        children: [],
      };

      chapter.units.forEach((unit: any) => {
        const unitItem: ContentItem = {
          id: unit.id,
          type: "unit",
          title: unit.title,
          description: unit.description,
          order: unit.order,
          isPublished: unit.isPublished,
          isFree: unit.isFree,
          estimatedDuration: unit.estimatedDuration,
          parentId: chapter.id,
          children: [],
        };

        unit.lessons.forEach((lesson: any) => {
          const lessonItem: ContentItem = {
            id: lesson.id,
            type: "lesson",
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            isPublished: lesson.isPublished,
            isFree: lesson.isFree,
            estimatedDuration: lesson.estimatedDuration,
            parentId: unit.id,
            children: [],
          };

          lesson.sessions.forEach((session: any) => {
            const sessionItem: ContentItem = {
              id: session.id,
              type: "session",
              title: session.title,
              description: session.description,
              order: session.order,
              isPublished: session.isPublished,
              isFree: session.isFree,
              estimatedDuration: session.estimatedDuration,
              parentId: lesson.id,
              sessionType: session.type === "video" ? "video" : "exam",
              videoUrl: session.type === "video" ? session.content : undefined,
              examId:
                session.type === "exam" ? parseInt(session.content) : undefined,
            };

            lessonItem.children!.push(sessionItem);
          });

          unitItem.children!.push(lessonItem);
        });

        chapterItem.children!.push(unitItem);
      });

      items.push(chapterItem);
    });

    return items;
  };

  const [contentTree, setContentTree] = useState<ContentItem[]>(
    buildContentTree()
  );

  const [newItem, setNewItem] = useState<Partial<ContentItem>>({
    type: "chapter",
    title: "",
    description: "",
    isPublished: false,
    isFree: false,
    estimatedDuration: 0,
    sessionType: "video",
    videoUrl: "",
    examId: undefined,
  });

  // فلترة المحتوى
  const filterContent = (items: ContentItem[]): ContentItem[] => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        item.type === filterType ||
        (item.type === "session" && item.sessionType === filterType);

      const matchesPublished = showUnpublished || item.isPublished;

      if (item.children && item.children.length > 0) {
        item.children = filterContent(item.children);
      }

      return matchesSearch && matchesType && matchesPublished;
    });
  };

  const filteredContent = filterContent([...contentTree]);

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const getItemIcon = (item: ContentItem) => {
    switch (item.type) {
      case "chapter":
        return BookOpen;
      case "unit":
        return Folder;
      case "lesson":
        return File;
      case "session":
        return item.sessionType === "video" ? Video : CheckCircle;
      default:
        return File;
    }
  };

  const getItemColor = (item: ContentItem) => {
    switch (item.type) {
      case "chapter":
        return "text-orange-600";
      case "unit":
        return "text-blue-600";
      case "lesson":
        return "text-green-600";
      case "session":
        return item.sessionType === "video"
          ? "text-purple-600"
          : "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.description) return;

    const item: ContentItem = {
      id: Date.now(),
      type: newItem.type as ContentType,
      title: newItem.title,
      description: newItem.description,
      order: 1,
      isPublished: newItem.isPublished || false,
      isFree: newItem.isFree || false,
      estimatedDuration: newItem.estimatedDuration || 0,
      parentId: newItem.parentId,
      sessionType: newItem.type === "session" ? newItem.sessionType : undefined,
      videoUrl:
        newItem.type === "session" && newItem.sessionType === "video"
          ? newItem.videoUrl
          : undefined,
      examId:
        newItem.type === "session" && newItem.sessionType === "exam"
          ? newItem.examId
          : undefined,
      children: newItem.type !== "session" ? [] : undefined,
    };

    // إضافة العنصر للشجرة
    const addToTree = (items: ContentItem[]): ContentItem[] => {
      if (!newItem.parentId) {
        return [...items, item];
      }

      return items.map((treeItem) => {
        if (treeItem.id === newItem.parentId) {
          return {
            ...treeItem,
            children: [...(treeItem.children || []), item],
          };
        }
        if (treeItem.children) {
          return {
            ...treeItem,
            children: addToTree(treeItem.children),
          };
        }
        return treeItem;
      });
    };

    setContentTree(addToTree(contentTree));

    // إعادة تعيين النموذج
    setNewItem({
      type: "chapter",
      title: "",
      description: "",
      isPublished: false,
      isFree: false,
      estimatedDuration: 0,
      sessionType: "video",
      videoUrl: "",
      examId: undefined,
    });

    setCurrentView("tree");
  };

  const handleDeleteItem = (id: number) => {
    if (
      !confirm(
        "هل أنت متأكد من حذف هذا العنصر؟ سيتم حذف جميع العناصر التابعة له."
      )
    )
      return;

    const deleteFromTree = (items: ContentItem[]): ContentItem[] => {
      return items.filter((item) => {
        if (item.id === id) return false;
        if (item.children) {
          item.children = deleteFromTree(item.children);
        }
        return true;
      });
    };

    setContentTree(deleteFromTree(contentTree));
  };

  const moveItem = (id: number, direction: "up" | "down") => {
    const moveInTree = (items: ContentItem[]): ContentItem[] => {
      const index = items.findIndex((item) => item.id === id);
      if (index === -1) {
        return items.map((item) => ({
          ...item,
          children: item.children ? moveInTree(item.children) : undefined,
        }));
      }

      const newItems = [...items];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < newItems.length) {
        [newItems[index], newItems[targetIndex]] = [
          newItems[targetIndex],
          newItems[index],
        ];

        // تحديث ترقيم الترتيب
        newItems.forEach((item, idx) => {
          item.order = idx + 1;
        });
      }

      return newItems;
    };

    setContentTree(moveInTree(contentTree));
  };

  const renderTreeItem = (item: ContentItem, depth: number = 0) => {
    const IconComponent = getItemIcon(item);
    const iconColor = getItemColor(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    return (
      <div key={item.id} className="space-y-2">
        <div
          className={`bg-white/95 backdrop-blur-xl rounded-lg shadow-sm border border-orange-100/50 hover:shadow-md transition-all duration-300`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          <div className="p-4">
            <div className="flex items-center gap-3">
              {/* Expand/Collapse Button */}
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="p-1 hover:bg-orange-50 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-orange-600" />
                  ) : (
                    <ChevronRight size={16} className="text-orange-600" />
                  )}
                </button>
              )}

              {/* Icon */}
              <IconComponent size={20} className={iconColor} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    {/* Session Details */}
                    {item.type === "session" && (
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.sessionType === "video"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.sessionType === "video" ? "فيديو" : "امتحان"}
                        </span>
                        {item.sessionType === "video" && item.videoUrl && (
                          <a
                            href={item.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                          >
                            <Link size={12} />
                            رابط الفيديو
                          </a>
                        )}
                        {item.sessionType === "exam" && item.examId && (
                          <span className="text-red-600 text-xs flex items-center gap-1">
                            <Target size={12} />
                            امتحان #{item.examId}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {/* Status Badges */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isPublished ? "منشور" : "مسودة"}
                      </span>
                      {item.isFree && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          مجاني
                        </span>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {item.estimatedDuration} دقيقة
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Move Up/Down */}
                      <button
                        onClick={() => moveItem(item.id, "up")}
                        className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="نقل لأعلى"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(item.id, "down")}
                        className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="نقل لأسفل"
                      >
                        <ArrowDown size={14} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setCurrentView("edit");
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="تعديل"
                      >
                        <Edit size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {hasChildren && isExpanded && (
          <div className="space-y-2">
            {item.children!.map((child) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getAvailableParents = (type: ContentType): ContentItem[] => {
    const parents: ContentItem[] = [];

    const collectParents = (items: ContentItem[], targetType: ContentType) => {
      items.forEach((item) => {
        if (
          (type === "unit" && item.type === "chapter") ||
          (type === "lesson" && item.type === "unit") ||
          (type === "session" && item.type === "lesson")
        ) {
          parents.push(item);
        }
        if (item.children) {
          collectParents(item.children, targetType);
        }
      });
    };

    collectParents(contentTree, type);
    return parents;
  };

  // Tree View
  if (currentView === "tree") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              إدارة محتوى الدورة
            </h1>
            <p className="text-gray-600 text-sm">{course.title}</p>
          </div>
          <button
            onClick={() => setCurrentView("add")}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة محتوى
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الفصول</p>
                <p className="text-3xl font-bold text-orange-600">
                  {course.chapters.length}
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الوحدات</p>
                <p className="text-3xl font-bold text-blue-600">
                  {course.chapters.reduce(
                    (sum: any, chapter: any) => sum + chapter.units.length,
                    0
                  )}
                </p>
              </div>
              <Folder className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الدروس</p>
                <p className="text-3xl font-bold text-green-600">
                  {course.chapters.reduce(
                    (sum: any, chapter: any) =>
                      sum +
                      chapter.units.reduce(
                        (unitSum: any, unit: any) =>
                          unitSum + unit.lessons.length,
                        0
                      ),
                    0
                  )}
                </p>
              </div>
              <File className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الحصص</p>
                <p className="text-3xl font-bold text-purple-600">
                  {course.chapters.reduce(
                    (sum: any, chapter: any) =>
                      sum +
                      chapter.units.reduce(
                        (unitSum: any, unit: any) =>
                          unitSum +
                          unit.lessons.reduce(
                            (lessonSum: any, lesson: any) =>
                              lessonSum + lesson.sessions.length,
                            0
                          ),
                        0
                      ),
                    0
                  )}
                </p>
              </div>
              <Video className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="البحث في المحتوى..."
                className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            >
              <option value="all">جميع الأنواع</option>
              <option value="chapter">الفصول</option>
              <option value="unit">الوحدات</option>
              <option value="lesson">الدروس</option>
              <option value="session">الحصص</option>
              <option value="video">فيديوهات</option>
              <option value="exam">امتحانات</option>
            </select>

            {/* Published Filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showUnpublished"
                checked={showUnpublished}
                onChange={(e) => setShowUnpublished(e.target.checked)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label
                htmlFor="showUnpublished"
                className="text-sm text-gray-700"
              >
                إظهار المسودات
              </label>
            </div>

            {/* Expand All */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const allIds: number[] = [];
                  const collectIds = (items: ContentItem[]) => {
                    items.forEach((item) => {
                      allIds.push(item.id);
                      if (item.children) collectIds(item.children);
                    });
                  };
                  collectIds(contentTree);
                  setExpandedItems(allIds);
                }}
                className="px-3 py-1 text-sm bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
              >
                توسيع الكل
              </button>
              <button
                onClick={() => setExpandedItems([])}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
              >
                طي الكل
              </button>
            </div>
          </div>
        </div>

        {/* Content Tree */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="space-y-4">
            {filteredContent.length > 0 ? (
              filteredContent.map((item) => renderTreeItem(item))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  لا يوجد محتوى
                </h3>
                <p className="text-gray-500 mb-6">
                  ابدأ بإضافة فصول ووحدات ودروس للدورة
                </p>
                <button
                  onClick={() => setCurrentView("add")}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  إضافة محتوى جديد
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Add Content View
  if (currentView === "add") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("tree")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              إضافة محتوى جديد
            </h1>
            <p className="text-gray-600 text-sm">{course.title}</p>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-orange-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h2>

              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  نوع المحتوى *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "chapter",
                      label: "فصل",
                      icon: BookOpen,
                      color: "orange",
                    },
                    {
                      value: "unit",
                      label: "وحدة",
                      icon: Folder,
                      color: "blue",
                    },
                    {
                      value: "lesson",
                      label: "درس",
                      icon: File,
                      color: "green",
                    },
                    {
                      value: "session",
                      label: "حصة",
                      icon: Video,
                      color: "purple",
                    },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setNewItem({
                          ...newItem,
                          type: type.value as ContentType,
                        })
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        newItem.type === type.value
                          ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <type.icon size={20} />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parent Selection */}
              {newItem.type !== "chapter" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newItem.type === "unit"
                      ? "الفصل الأب"
                      : newItem.type === "lesson"
                      ? "الوحدة الأب"
                      : "الدرس الأب"}{" "}
                    *
                  </label>
                  <select
                    value={newItem.parentId || ""}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        parentId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر العنصر الأب</option>
                    {getAvailableParents(newItem.type as ContentType).map(
                      (parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.title}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  value={newItem.title || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان المحتوى..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  value={newItem.description || ""}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للمحتوى..."
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة المقدرة (بالدقائق)
                </label>
                <input
                  type="number"
                  value={newItem.estimatedDuration || ""}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      estimatedDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="30"
                  min="0"
                />
              </div>
            </div>

            {/* Session Specific Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                الإعدادات
              </h2>

              {/* Session Type (only for sessions) */}
              {newItem.type === "session" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    نوع الحصة *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setNewItem({ ...newItem, sessionType: "video" })
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        newItem.sessionType === "video"
                          ? "border-purple-500 bg-purple-50 text-purple-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Video size={20} />
                      <div className="text-right">
                        <div className="font-medium">فيديو</div>
                        <div className="text-sm text-gray-500">
                          محاضرة مرئية
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        setNewItem({ ...newItem, sessionType: "exam" })
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        newItem.sessionType === "exam"
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CheckCircle size={20} />
                      <div className="text-right">
                        <div className="font-medium">امتحان</div>
                        <div className="text-sm text-gray-500">
                          اختبار تقييمي
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Video URL (for video sessions) */}
              {newItem.type === "session" &&
                newItem.sessionType === "video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الفيديو *
                    </label>
                    <input
                      type="url"
                      value={newItem.videoUrl || ""}
                      onChange={(e) =>
                        setNewItem({ ...newItem, videoUrl: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                )}

              {/* Exam Selection (for exam sessions) */}
              {newItem.type === "session" && newItem.sessionType === "exam" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الامتحان *
                  </label>
                  <select
                    value={newItem.examId || ""}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        examId: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر الامتحان</option>
                    <option value="1">امتحان الرياضيات - الفصل الأول</option>
                    <option value="2">اختبار سريع - الفيزياء</option>
                    <option value="3">امتحان اللغة العربية النهائي</option>
                  </select>
                </div>
              )}

              {/* Status Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">منشور</p>
                    <p className="text-sm text-gray-500">متاح للطلاب</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newItem.isPublished || false}
                    onChange={(e) =>
                      setNewItem({ ...newItem, isPublished: e.target.checked })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مجاني</p>
                    <p className="text-sm text-gray-500">متاح بدون رسوم</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newItem.isFree || false}
                    onChange={(e) =>
                      setNewItem({ ...newItem, isFree: e.target.checked })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Preview */}
              {newItem.title && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">معاينة</h4>
                  <div className="flex items-center gap-2 text-blue-700">
                    {newItem.type === "chapter" && <BookOpen size={16} />}
                    {newItem.type === "unit" && <Folder size={16} />}
                    {newItem.type === "lesson" && <File size={16} />}
                    {newItem.type === "session" &&
                      newItem.sessionType === "video" && <Video size={16} />}
                    {newItem.type === "session" &&
                      newItem.sessionType === "exam" && (
                        <CheckCircle size={16} />
                      )}
                    <span className="font-medium">{newItem.title}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {newItem.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentView("tree")}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleAddItem}
              disabled={
                !newItem.title ||
                !newItem.description ||
                (newItem.type !== "chapter" && !newItem.parentId) ||
                (newItem.type === "session" &&
                  newItem.sessionType === "video" &&
                  !newItem.videoUrl) ||
                (newItem.type === "session" &&
                  newItem.sessionType === "exam" &&
                  !newItem.examId)
              }
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              إضافة المحتوى
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Edit Content View (similar to add but with existing data)
  if (currentView === "edit" && selectedItem) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView("tree")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">تعديل المحتوى</h1>
            <p className="text-gray-600 text-sm">{selectedItem.title}</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-8 border border-orange-100/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                المعلومات الأساسية
              </h2>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  value={selectedItem.title}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="أدخل عنوان المحتوى..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  value={selectedItem.description}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف تفصيلي للمحتوى..."
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة المقدرة (بالدقائق)
                </label>
                <input
                  type="number"
                  value={selectedItem.estimatedDuration}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      estimatedDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="30"
                  min="0"
                />
              </div>

              {/* Video URL (for video sessions) */}
              {selectedItem.type === "session" &&
                selectedItem.sessionType === "video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الفيديو *
                    </label>
                    <input
                      type="url"
                      value={selectedItem.videoUrl || ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          videoUrl: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="https://example.com/video.mp4"
                    />
                  </div>
                )}

              {/* Exam Selection (for exam sessions) */}
              {selectedItem.type === "session" &&
                selectedItem.sessionType === "exam" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الامتحان *
                    </label>
                    <select
                      value={selectedItem.examId || ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          examId: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="">اختر الامتحان</option>
                      <option value="1">امتحان الرياضيات - الفصل الأول</option>
                      <option value="2">اختبار سريع - الفيزياء</option>
                      <option value="3">امتحان اللغة العربية النهائي</option>
                    </select>
                  </div>
                )}
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                الإعدادات
              </h2>

              {/* Status Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">منشور</p>
                    <p className="text-sm text-gray-500">متاح للطلاب</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedItem.isPublished}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        isPublished: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">مجاني</p>
                    <p className="text-sm text-gray-500">متاح بدون رسوم</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedItem.isFree}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        isFree: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Type Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  معلومات النوع
                </h4>
                <div className="flex items-center gap-2 text-blue-700">
                  {selectedItem.type === "chapter" && <BookOpen size={16} />}
                  {selectedItem.type === "unit" && <Folder size={16} />}
                  {selectedItem.type === "lesson" && <File size={16} />}
                  {selectedItem.type === "session" &&
                    selectedItem.sessionType === "video" && <Video size={16} />}
                  {selectedItem.type === "session" &&
                    selectedItem.sessionType === "exam" && (
                      <CheckCircle size={16} />
                    )}
                  <span className="font-medium">
                    {selectedItem.type === "chapter"
                      ? "فصل"
                      : selectedItem.type === "unit"
                      ? "وحدة"
                      : selectedItem.type === "lesson"
                      ? "درس"
                      : selectedItem.sessionType === "video"
                      ? "حصة فيديو"
                      : "حصة امتحان"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => setCurrentView("tree")}
              className="px-6 py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                // Update the item in the tree
                const updateInTree = (items: ContentItem[]): ContentItem[] => {
                  return items.map((item) => {
                    if (item.id === selectedItem.id) {
                      return selectedItem;
                    }
                    if (item.children) {
                      return {
                        ...item,
                        children: updateInTree(item.children),
                      };
                    }
                    return item;
                  });
                };

                setContentTree(updateInTree(contentTree));
                setCurrentView("tree");
                setSelectedItem(null);
              }}
              disabled={!selectedItem.title || !selectedItem.description}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              حفظ التغييرات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CourseContentPage;
