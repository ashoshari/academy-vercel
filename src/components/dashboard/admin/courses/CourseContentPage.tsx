import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  // Trash2,
  ArrowLeft,
  ArrowRight,
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
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost, useCustomUpdate } from "@/hooks/useMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const CourseContentPage = ({ course, onBack }: any) => {
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [expandedItems, setExpandedItems] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filterType, setFilterType] = useState<any>("all");
  const [showUnpublished, setShowUnpublished] = useState(true);
  // const [layer, setLayer] = useState();
  const [filteredContent, setFilteredContent] = useState<any>([]);
  const [currentView, setCurrentView] = useState<"tree" | "add" | "edit">(
    "tree"
  );
  // GET courseContent
  const { data: courseContent } = useCustomQuery(
    `/training/admin/courses/${course?.id}/`,
    ["course-content", course?.id]
  );
  // GET Exams
  const { data: exams } = useCustomQuery("/training/admin/exams/", ["exams"]);

  const examData = exams?.data;
  // GET courseContent Statistics
  const { data: contentStatistics } = useCustomQuery(
    `/training/admin/course-content-statistics/`,
    ["course-content-statistics"]
  );

  const courseContentData = courseContent?.data;
  const courseContentTree = courseContentData?.semesters;
  const contentStatisticsData = contentStatistics?.data;

  // POST Semester
  const { mutateAsync: postSemesters } = useCustomPost(
    "/training/admin/semesters/",
    ["postSemesters"]
  );
  // POST Units
  const { mutateAsync: postUnits } = useCustomPost("/training/admin/units/", [
    "postUnits",
  ]);
  // POST Topics
  const { mutateAsync: postTopics } = useCustomPost("/training/admin/topics/", [
    "postTopics",
  ]);
  // POST Lesson
  const { mutateAsync: postLessons } = useCustomPost(
    "/training/admin/lessons/",
    ["postLessons"]
  );

  // PUT Semester
  const { mutateAsync: putSemesters } = useCustomUpdate(
    `/training/admin/semesters/${selectedItem?.id}/`,
    ["putSemesters"]
  );

  // PUT Semester
  const { mutateAsync: putUnits } = useCustomUpdate(
    `/training/admin/units/${selectedItem?.id}/`,
    ["putUnits"]
  );

  // PUT Semester
  const { mutateAsync: putTopics } = useCustomUpdate(
    `/training/admin/topics/${selectedItem?.id}/`,
    ["putTopics"]
  );

  // PUT Semester
  const { mutateAsync: putLessons } = useCustomUpdate(
    `/training/admin/lessons/${selectedItem?.id}/`,
    ["putLessons"]
  );

  // تحويل بيانات الدورة إلى هيكل شجري
  // const buildContentTree = (): ContentItem[] => {
  //   const items: ContentItem[] = [];

  //   course?.semesters?.forEach((semester: any) => {
  //     const semesterItem: ContentItem = {
  //       id: semester.id,
  //       type: "semester",
  //       title: semester.title,
  //       description: semester.description,
  //       order: semester.order,
  //       isPublished: semester.isPublished,
  //       isFree: semester.isFree,
  //       estimatedDuration: semester.estimatedDuration,
  //       children: [],
  //     };

  //     semester.units.forEach((unit: any) => {
  //       const unitItem: ContentItem = {
  //         id: unit.id,
  //         type: "unit",
  //         title: unit.title,
  //         description: unit.description,
  //         order: unit.order,
  //         isPublished: unit.isPublished,
  //         isFree: unit.isFree,
  //         estimatedDuration: unit.estimatedDuration,
  //         parentId: semester.id,
  //         children: [],
  //       };

  //       unit.topics.forEach((topic: any) => {
  //         const topicItem: ContentItem = {
  //           id: topic.id,
  //           type: "topic",
  //           title: topic.title,
  //           description: topic.description,
  //           order: topic.order,
  //           isPublished: topic.isPublished,
  //           isFree: topic.isFree,
  //           estimatedDuration: topic.estimatedDuration,
  //           parentId: unit.id,
  //           children: [],
  //         };

  //         topic.lessons.forEach((lesson: any) => {
  //           const lessonItem: ContentItem = {
  //             id: lesson.id,
  //             type: "lesson",
  //             title: lesson.title,
  //             description: lesson.description,
  //             order: lesson.order,
  //             isPublished: lesson.isPublished,
  //             isFree: lesson.isFree,
  //             estimatedDuration: lesson.estimatedDuration,
  //             parentId: topic.id,
  //             lessonType: lesson.type === "video" ? "video" : "exam",
  //             videoUrl: lesson.type === "video" ? lesson.content : undefined,
  //             examId:
  //               lesson.type === "exam" ? parseInt(lesson.content) : undefined,
  //           };

  //           topicItem.children!.push(lessonItem);
  //         });

  //         unitItem.children!.push(topicItem);
  //       });

  //       semesterItem.children!.push(unitItem);
  //     });

  //     items.push(semesterItem);
  //   });

  //   return items;
  // };

  const [contentTree, setContentTree] = useState<any>();

  useEffect(() => {
    setContentTree(courseContentTree);
  }, [courseContentTree]);

  // اضافة عنصر جديد
  const [newItem, setNewItem] = useState<any>({
    type: "semester",
  });

  // فلترة المحتوى
  const filterContent = (items: any) => {
    return items
      .map((item: any) => {
        const childKey = Object.keys(item).find(
          (key) =>
            Array.isArray(item[key]) &&
            item[key].length > 0 &&
            item[key].every(
              (child: any) => typeof child === "object" && "id" in child
            )
        );

        let children = childKey ? filterContent(item[childKey]) : [];

        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPublished = showUnpublished || item?.is_published;

        // ✅ Keep parent if it matches itself or has matching children
        if ((matchesSearch && matchesPublished) || children.length > 0) {
          return {
            ...item,
            ...(childKey ? { [childKey]: children } : {}),
          };
        }
        return null;
      })
      .filter(Boolean); // remove nulls
  };
  useEffect(() => {
    const result = filterContent(contentTree ? contentTree : []);
    setFilteredContent(result);
  }, [contentTree, searchTerm, showUnpublished]);

  const toggleExpanded = (id: any) => {
    setExpandedItems((prev: any) =>
      prev.includes(id)
        ? prev.filter((itemId: any) => itemId !== id)
        : [...prev, id]
    );
  };

  const getItemIcon = (depth: any, item: any) => {
    switch (depth) {
      case 0:
        return BookOpen;
      case 1:
        return Folder;
      case 2:
        return File;
      case 3:
        return item?.type === "Video" ? Video : CheckCircle;
      default:
        return File;
    }
  };

  const getItemColor = (item: any) => {
    switch (item.type) {
      case "semester":
        return "text-orange-600";
      case "unit":
        return "text-blue-600";
      case "topic":
        return "text-green-600";
      case "lesson":
        return item.lessonType === "video" ? "text-purple-600" : "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.description) return;

    const addItem = {
      title: newItem.title,
      description: newItem.description,
      time_in_minutes: newItem.estimatedDuration,
      is_published: newItem.isPublished,
      [newItem.type === "unit"
        ? "semester"
        : newItem.type === "topic"
        ? "unit"
        : "topic"]: newItem.parentId,
      ...(newItem.type === "semester" && { course: course?.id }),
      ...(newItem.lessonType && { type: newItem.lessonType }),
      ...(newItem.videoUrl && { link: newItem.videoUrl }),
      ...(newItem.examId && { exam: newItem.examId }),
      ...(newItem.order !== undefined && { order: newItem.order }),
    };
    try {
      const response = newItem.type === "semester"
        ? await postSemesters(addItem)
        : newItem.type === "unit"
        ? await postUnits(addItem)
        : newItem.type === "topic"
        ? await postTopics(addItem)
        : await postLessons(addItem);

      queryClient.invalidateQueries({
        queryKey: ["course-content"],
      });
      toast.success(response?.message ?? "تم الحفظ بنجاح");
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
    // إعادة تعيين النموذج
    setNewItem({});
    setCurrentView("tree");
  };
  const handleEditItem = async () => {
    const editedContent = {
      title: selectedItem?.title,
      description: selectedItem?.description,
      time_in_minutes: selectedItem?.time_in_minutes,
      is_published: selectedItem?.is_published,
      // is_free: selectedItem?.is_free,
      ...(selectedItem?.link && { link: selectedItem?.link }),
      ...(selectedItem?.exam && { exam: selectedItem?.exam }),
      ...(selectedItem?.order && { exam: selectedItem?.order }),
    };
    try {
      const response = selectedItem?.course
        ? await putSemesters(editedContent)
        : selectedItem?.semester
        ? await putUnits(editedContent)
        : selectedItem?.unit
        ? await putTopics(editedContent)
        : await putLessons(editedContent);
      queryClient.invalidateQueries({
        queryKey: ["course-content"],
      });
      toast.success(response?.message ?? "تم تعديل المحتوى بنجاح");
      setCurrentView("tree");
      setSelectedItem(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.error);
    }
  };

  // const handleDeleteItem = (id: any) => {
  //   if (
  //     !confirm(
  //       "هل أنت متأكد من حذف هذا العنصر؟ سيتم حذف جميع العناصر التابعة له."
  //     )
  //   )
  //     return;

  //   const deleteFromTree = (items: any) => {
  //     return items.filter((item:any) => {
  //       if (item.id === id) return false;
  //       if (item.children) {
  //         item.children = deleteFromTree(item.children);
  //       }
  //       return true;
  //     });
  //   };

  //   setContentTree(deleteFromTree(contentTree));
  // };

  const moveItem = (id: any, direction: "up" | "down") => {
    const moveInTree = (items: any) => {
      const index = items.findIndex((item: any) => item?.id === id);
      if (index !== -1) {
        // Found the item here → move it
        const newItems = [...items];
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        if (targetIndex >= 0 && targetIndex < newItems.length) {
          [newItems[index], newItems[targetIndex]] = [
            newItems[targetIndex],
            newItems[index],
          ];

          // Update order
          newItems.forEach((item, idx) => {
            item.order = idx + 1;
          });
        }

        return newItems;
      }

      // Not found here → search in children dynamically
      return items.map((item: any) => {
        const childKey = Object.keys(item).find(
          (key) =>
            Array.isArray(item[key]) &&
            item[key].length > 0 &&
            item[key].every(
              (child: any) => typeof child === "object" && "id" in child
            )
        );

        if (childKey) {
          return {
            ...item,
            [childKey]: moveInTree(item[childKey]),
          };
        }

        return item;
      });
    };

    setContentTree(moveInTree(contentTree));
  };

  const renderTreeItem = (item: any, depth: any = 0) => {
    const childKey: any = Object.keys(item).find(
      (key) =>
        Array.isArray(item[key]) &&
        item[key].length > 0 &&
        item[key].every(
          (child: any) => typeof child === "object" && "id" in child
        )
    );
    const hasChildren = Boolean(childKey);
    const children = hasChildren ? item[childKey] : [];
    const IconComponent = getItemIcon(depth, item);
    const iconColor = getItemColor(item);
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.description}
                    </p>

                    {/* lesson Details */}
                    {item.type === "lesson" && (
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.lessonType === "video"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.lessonType === "video" ? "فيديو" : "امتحان"}
                        </span>
                        {item.lessonType === "video" && item.videoUrl && (
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
                        {item.lessonType === "exam" && item.examId && (
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
                          item?.is_published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item?.is_published ? "منشور" : "مسودة"}
                      </span>
                      {item.is_free && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          مجاني
                        </span>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {item?.time_in_minutes} دقيقة
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Move Up/Down */}
                      <button
                        onClick={() => moveItem(item?.id, "up")}
                        className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                        title="نقل لأعلى"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(item?.id, "down")}
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
                      {/* <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button> */}
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
            {children?.map((child: any) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const getAvailableParents = (type: any) => {
    const parents: any = [];
    const collectParents = (items: any) => {
      items.forEach((item: any) => {
        const childKey: any = Object.keys(item).find(
          (key) =>
            Array.isArray(item[key]) &&
            item[key].length > 0 &&
            item[key].every(
              (child: any) => typeof child === "object" && "id" in child
            )
        );
        const hasChildren = Boolean(childKey);
        const children = hasChildren ? item[childKey] : [];

        if (
          (type === "unit" && item.course) ||
          (type === "topic" && item.semester) ||
          (type === "lesson" && item.unit)
        ) {
          parents.push(item);
        }
        if (hasChildren) {
          collectParents(children);
        }
      });
    };
    collectParents(contentTree);
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
            <ArrowRight size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              إدارة محتوى الدورة
            </h1>
            <p className="text-gray-600 text-sm">{course?.name}</p>
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
                  {contentStatisticsData?.total_semesters}
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
                  {contentStatisticsData?.total_units}
                </p>
              </div>
              <Folder className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">المواضيع</p>
                <p className="text-3xl font-bold text-green-600">
                  {contentStatisticsData?.total_topics}
                </p>
              </div>
              <File className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الدروس</p>
                <p className="text-3xl font-bold text-purple-600">
                  {contentStatisticsData?.total_topics}
                </p>
              </div>
              <Video className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex justify-between  gap-4">
            {/* Search */}
            <div className="flex items-center gap-x-[20px]">
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
              {/* <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
              <option value="all">جميع الأنواع</option>
              <option value="semester">الفصول</option>
              <option value="unit">الوحدات</option>
              <option value="topic">الدروس</option>
              <option value="lesson">الحصص</option>
              <option value="video">فيديوهات</option>
              <option value="exam">امتحانات</option>
            </select> */}

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
            </div>

            {/* Expand All */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const allIds: any[] = [];
                  const collectIds = (items: any[]) => {
                    items.forEach((item: any) => {
                      const childKey: any = Object.keys(item).find(
                        (key) =>
                          Array.isArray(item[key]) &&
                          item[key].length > 0 &&
                          item[key].every(
                            (child: any) =>
                              typeof child === "object" && "id" in child
                          )
                      );

                      const hasChildren = Boolean(childKey);
                      const children = hasChildren ? item[childKey] : [];

                      allIds.push(item?.id);

                      if (hasChildren) collectIds(children);
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
            {filteredContent?.length > 0 ? (
              filteredContent?.map((item: any) => renderTreeItem(item))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  لا يوجد محتوى
                </h3>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {contentTree?.length > 0 ? "لا يوجد محتوى" : "ل يوجد محتوى"}
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
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRight size={20} />
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
                      value: "semester",
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
                      value: "topic",
                      label: "موضوع",
                      icon: File,
                      color: "green",
                    },
                    {
                      value: "lesson",
                      label: "درس",
                      icon: Video,
                      color: "purple",
                    },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        setNewItem({
                          ...newItem,
                          type: type.value,
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
              {newItem.type !== "semester" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {newItem.type === "unit"
                      ? "الفصل الأب"
                      : newItem.type === "topic"
                      ? "الوحدة الأب"
                      : "الموضوع الأب"}{" "}
                    *
                  </label>
                  <select
                    value={newItem.parentId || ""}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        parentId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر العنصر الأب</option>
                    {getAvailableParents(newItem.type).map((parent: any) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.title}
                      </option>
                    ))}
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

            {/* lesson Specific Settings */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                الإعدادات
              </h2>

              {/* lesson Type (only for lessons) */}
              {newItem.type === "lesson" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    نوع الدرس *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() =>
                        setNewItem({ ...newItem, lessonType: "video" })
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        newItem.lessonType === "video"
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
                        setNewItem({ ...newItem, lessonType: "exam" })
                      }
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                        newItem.lessonType === "exam"
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

              {/* Video URL (for video lessons) */}
              {newItem.type === "lesson" && newItem.lessonType === "video" && (
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

              {/* Exam Selection (for exam lessons) */}
              {newItem.type === "lesson" && newItem.lessonType === "exam" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الامتحان *
                  </label>
                  <select
                    value={newItem.examId || ""}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        examId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="">اختر الامتحان</option>
                    {examData.map((exam: any) => (
                      <option key={exam?.id} value={exam?.id}>
                        {exam.title}
                      </option>
                    ))}
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
                    {newItem.type === "semester" && <BookOpen size={16} />}
                    {newItem.type === "unit" && <Folder size={16} />}
                    {newItem.type === "topic" && <File size={16} />}
                    {newItem.type === "lesson" &&
                      newItem.lessonType === "video" && <Video size={16} />}
                    {newItem.type === "lesson" &&
                      newItem.lessonType === "exam" && (
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
              onClick={() => handleAddItem()}
              disabled={
                !newItem.title ||
                !newItem.description ||
                (newItem.type !== "semester" && !newItem.parentId) ||
                (newItem.type === "lesson" &&
                  newItem.lessonType === "video" &&
                  !newItem.videoUrl) ||
                (newItem.type === "lesson" &&
                  newItem.lessonType === "exam" &&
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
            <p className="text-gray-600 text-sm">{selectedItem?.title}</p>
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
                  value={selectedItem?.title}
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
                  value={selectedItem?.description}
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
                  value={selectedItem?.time_in_minutes}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      time_in_minutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="30"
                  min="0"
                />
              </div>

              {/* Video URL (for video lessons) */}
              {selectedItem?.topic &&
                selectedItem?.type.toLowerCase() === "video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الفيديو *
                    </label>
                    <input
                      type="url"
                      value={selectedItem?.link || ""}
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

              {/* Exam Selection (for exam lessons) */}
              {selectedItem?.topic &&
                selectedItem?.type.toLowerCase() === "exam" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الامتحان *
                    </label>
                    <select
                      value={selectedItem.exam || ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          exam: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      {examData.map((exam: any) => (
                        <option key={exam?.id} value={exam?.id}>
                          {exam.title}
                        </option>
                      ))}
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
                    checked={selectedItem.is_published}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        is_published: e.target.checked,
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
                    checked={selectedItem?.is_free}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        is_free: e.target.checked,
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
                  {selectedItem?.course && <BookOpen size={16} />}
                  {selectedItem?.semester && <Folder size={16} />}
                  {selectedItem?.unit && <File size={16} />}
                  {selectedItem?.topic &&
                    selectedItem?.type.toLowerCase() === "video" && (
                      <Video size={16} />
                    )}
                  {selectedItem?.topic &&
                    selectedItem?.type.toLowerCase() === "exam" && (
                      <CheckCircle size={16} />
                    )}
                  <span className="font-medium">
                    {selectedItem?.course
                      ? "فصل"
                      : selectedItem?.semester
                      ? "وحدة"
                      : selectedItem?.unit
                      ? "موضوع"
                      : selectedItem?.type.toLowerCase() === "video"
                      ? "درس فيديو"
                      : "درس امتحان"}
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
                // const updateInTree = (items: any) => {
                //   return items.map((item: any) => {
                //     if (item.id === selectedItem.id) {
                //       return selectedItem;
                //     }
                //     if (item.children) {
                //       return {
                //         ...item,
                //         children: updateInTree(item.children),
                //       };
                //     }
                //     return item;
                //   });
                // };
                // setContentTree(updateInTree(contentTree));

                handleEditItem();
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
