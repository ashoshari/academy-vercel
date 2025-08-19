import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  // BarChart3,
  // PieChart,
  // Star,
  X,
  UploadCloud,
  Folder,
  Upload,
  Files,
  Download,
  // ExternalLink,
  Trash2,
  // Share,
  // Unlock,
  // Lock,
  FolderOpen,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  File,
  Pen,
  EyeOff,
  // Table,
  Grid,
  Rows,
  XSquare,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  useCustomRemove,
  // , useCustomUpdate
} from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { formatDate } from "@/services/date";
import Pagination from "@/components/dashboard/core/Pagination";
// import Loader from "@/components/core/Loader";
import { useQueryClient } from "@tanstack/react-query";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import Loader from "@/components/core/Loader";

const ResourcessPage = () => {
  // const [currentView, setCurrentView] = useState<
  //   "list" | "create" | "edit" | "content"
  // >("list");
  // const [currentPath, setCurrentPath] = useState<any>(null);
  // const [selectedresources, setSelectedresources] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // const [resourcesTypeFilter, setResourcesTypeFilter] = useState<
  //   "all" | "folder" | "document" | "image" | "video" | "audio" | "archive"
  // >("all");
  // const [accessFilter, setAccessFilter] = useState<
  //   "all" | "public" | "students" | "teachers" | "admin"
  // >("all");

  // Filter
  const [searchTerm, setSearchTerm] = useState("");
  // const [teacherFilter, setTeacherFilter] = useState<any>(null);
  // const [lessonFilter, setLessonFilter] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState<any>(null);
  // const [specializationFilter, setSpecializationFilter] = useState<string>("");
  // const [specializationMaterialFilter, setSpecializationMaterialFilter] =
  //   useState<string>("");
  const [statusFilter, setStatusFilter] = useState<any>("all");
  // const [levelFilter] = useState<
  //   "all" | "beginner" | "intermediate" | "advanced"
  // >("all");

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const types = ["resources", "bookses", "ministerial_questions", "files"];

  const [uploadResources, setUploadResources] = useState<any>({});
  const [resourseId, setResourceId] = useState<string>("");

  // const [resourcesId, setResourcesId] = useState<any>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  console.log("typeFilter", typeFilter);
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("title", searchTerm);
  if (typeFilter) queryParams.append("type", typeFilter);
  // if (typeFilter) queryParams.append("type", typeFilter);
  if (statusFilter) queryParams.append("is_published", statusFilter);
  if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();
  console.log(queryString);
  // GET resourcess
  const { data, isLoading } = useCustomQuery(
    `/training/admin/resources/?${queryString}`,
    [
      "resources",
      searchTerm,
      typeFilter,
      // teacherFilter,
      statusFilter,
      page,
    ]
  );
  const resourcesData = data?.data;
  const paginationData = data?.pagination;
  // GET resourcess stats
  const { data: resourcesStats } = useCustomQuery(
    "/training/admin/resource-statistics/",
    ["resources-stats"]
  );
  console.log("resourcesData", resourcesData);
  // GET teachers
  const { data: teachers } = useCustomQuery("/account/admin/teachers/", [
    "teachers",
  ]);

  const teacherData = teachers?.data;

  // GET Lessons
  const { data: lessons } = useCustomQuery("/training/admin/lessons/", [
    "lessons",
  ]);
  const lessonData = lessons?.data;
  // GET Specializations
  const { data: specializations } = useCustomQuery(
    "/training/admin/specializations/",
    ["specializations"]
  );

  // GET Specializations_material
  // const { data: specialization_material } = useCustomQuery(
  //   "/training/admin/specialization-materials/",
  //   ["specializations_material"]
  // );

  const specializationData = specializations?.data;
  // const specialization_materialData = specialization_material?.data;

  const [resources, setResources] = useState<any>();
  useEffect(() => {
    setResources(resourcesData);
  }, [resourcesData]);
  const resourcesStatsData = resourcesStats?.data;
  // const [newresources, setNewresources] = useState<any>({});
  // const [editresourcesData, setEditresourcesData] = useState<any>({});
  // PUT resources
  // const { mutateAsync: putResources } = useCustomUpdate(
  //   `/training/admin/resources/${resourcesId}/`,
  //   ["putResources", resourcesId]
  // );
  // POST New resources
  const { mutateAsync: postResources } = useCustomPost(
    "/training/admin/resources/",
    ["postResources"]
  );

  // DELETE Resources
  const { mutateAsync: deleteResources } = useCustomRemove(
    `/training/admin/resources/${resourseId}/`,
    ["deleteResources", resourseId]
  );
  // const getAccessLevelColor = (level: any) => {
  //   switch (level) {
  //     case "public":
  //       return "bg-green-100 text-green-800";
  //     case "students":
  //       return "bg-blue-100 text-blue-800";
  //     case "teachers":
  //       return "bg-purple-100 text-purple-800";
  //     case "admin":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const handleDeleteFile = async (id: any) => {
    setResourceId(id);
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      // Delete file and all its children if it's a folder
      try {
        const response = await deleteResources(id);
        toast.success(response?.message);
        queryClient.invalidateQueries({ queryKey: ["resources"] });
      } catch (err: any) {
        toast.error(err?.response?.data?.message);
      }
    }
  };
  const toggleFileFavorite = (id: number) => {
    setResources(
      resources.map((file: any) =>
        file.id === id ? { ...file, isFavorite: !file.isFavorite } : file
      )
    );
  };
  const getFileTypeColor = (file: any) => {
    if (file.type === "folder") {
      return "text-orange-600";
    }

    switch (file.fileType) {
      case "document":
        return "text-blue-600";
      case "image":
        return "text-green-600";
      case "video":
        return "text-purple-600";
      case "audio":
        return "text-pink-600";
      case "archive":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };
  // const navigateToFolder = (folderId: any) => {
  //   setCurrentPath(folderId);
  //   setSelectedresources([]);
  // };
  const getFileIcon = (file: any) => {
    if (file.type === "folder") {
      return file.isShared ? FolderOpen : Folder;
    }

    switch (file.fileType) {
      case "document":
        return FileText;
      case "image":
        return FileImage;
      case "video":
        return FileVideo;
      case "audio":
        return FileAudio;
      case "archive":
        return Archive;
      default:
        return File;
    }
  };
  const handleResourseUpload = async () => {
    console.log("uploadResources", uploadResources);
    const formData = new FormData();
    uploadResources.title && formData.append("title", uploadResources.title);
    uploadResources.description &&
      formData.append("description", uploadResources.description);
    uploadResources.teacher &&
      formData.append("teacher", uploadResources.teacher);
    uploadResources.expiry_date &&
      formData.append("expiry_date", uploadResources.expiry_date);
    uploadResources.specialization &&
      formData.append("specialization", uploadResources.specialization);
    uploadResources.specialization_material &&
      formData.append(
        "specialization_material",
        uploadResources.specialization_material
      );
    uploadResources.lesson && formData.append("lesson", uploadResources.lesson);
    uploadResources.type &&
      formData.append("type", uploadResources.type || null);
    uploadResources.is_free &&
      formData.append("is_free", uploadResources.is_free || false);
    uploadResources.is_published &&
      formData.append("is_published", uploadResources.is_published || false);
    if (
      uploadResources.image &&
      typeof (uploadResources.image as any).name === "string" &&
      typeof (uploadResources.image as any).size === "number"
    ) {
      formData.append("image", uploadResources.image as File);
    }
    if (
      uploadResources.file &&
      typeof (uploadResources.file as any).name === "string" &&
      typeof (uploadResources.file as any).size === "number"
    ) {
      formData.append("file", uploadResources.file as File);
    }
    // const addResource = {
    //   ...uploadResources,
    //   ...(uploadResources?.expiry_date && {
    //     expiry_date: uploadResources?.expiry_date,
    //   }),
    //   ...(!uploadResources?.is_free && { is_free: false }),
    //   ...(!uploadResources?.is_published && { is_published: false }),
    // };
    try {
      const response = await postResources(formData);
      toast.success(response?.message ?? "تم اضافة المحتوى بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
      queryClient.invalidateQueries({
        queryKey: ["resources-stats"],
      });
      setUploadResources({});
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
    // console.log("addResource", addResource);
    // setuploadResources({
    //   files: [],
    //   description: "",
    //   accessLevel: "students",
    //   targetedSections: [],
    //   targetedSubsections: [],
    //   tags: [],
    //   expiryDate: "",
    // });
    // setShowCreateModal(false);
  };
  const ResourseCard = ({ resource }: { resource: any }) => {
    const IconComponent = getFileIcon(resource);
    const iconColor = getFileTypeColor(resource);
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Thumbnail/Icon */}
        <div className="relative h-32 bg-gray-50 flex items-center justify-center">
          {resource?.image ? (
            <img
              loading="lazy"
              src={resource?.image}
              alt={resource?.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent size={48} className={iconColor} />
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {/* <a
              href={resource?.file}
              download
              target="_blank"
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
              title="عرض الملف"
            >
              <ExternalLink size={16} />
            </a> */}

            <button
              onClick={() => toggleFileFavorite(resource?.id)}
              className={`p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-blue-500/80 transition-colors`}
              title={"تعديل الملف"}
            >
              <Pen size={16} />
            </button>

            <button
              onClick={() => handleDeleteFile(resource?.id)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/80 transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex gap-1  p-1 rounded-full">
            {resource?.is_published ? (
              <Eye size={16} className="text-blue-500" />
            ) : (
              <EyeOff size={16} className="text-red-500" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-3">
            <h3
              className="font-medium text-gray-800 truncate"
              title={resource?.title}
            >
              {resource?.title || "اسم الملف"}
            </h3>
            {resource?.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {resource?.description}
              </p>
            )}
          </div>

          {/* File Info */}
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>الحجم</span>
              <span className="font-medium">
                {formatFileSize(resource?.file_size) || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>التحميلات</span>
              <span className="font-medium">
                {resource?.number_of_downloads || 0}
              </span>
            </div>
            {resource?.expiry_date && (
              <div className="flex items-center justify-between">
                <span>تاريخ الانشاء</span>
                <span className="font-medium">
                  {formatDateTimeSimple(resource?.expiry_date)}
                </span>
              </div>
            )}
          </div>

          {/* Access Level */}
          {/* <div className="mt-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(
                resource.accessLevel
              )}`}
            >
              {resource.accessLevel === "public"
                ? "عام"
                : resource.accessLevel === "students"
                ? "طلاب"
                : resource.accessLevel === "teachers"
                ? "معلمين"
                : "إداريين"}
            </span>
          </div> */}

          {/* Tags */}
          {resource?.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {resource?.tags?.map((tag: any) => (
                <span
                  key={tag?.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag?.name}
                </span>
              ))}
              {resource?.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{resource?.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  const CreateModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                رفع ملفات جديدة
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* File Upload Area */}
            <div className="lg:flex gap-4">
              {/* Upload File */}
              <div className="w-full">
                <div className="relative flex flex-col justify-center items-center h-full">
                  <h2 className="text-lg font-bold text-gray-800 text-center mb-[5px]">
                    {!uploadResources?.file ? "رفع الملف" : "تم رفع الملف"}
                  </h2>
                  <div
                    className={`border-2 border-dashed w-full ${
                      uploadResources?.file && "hidden"
                    } border-gray-300 rounded-lg p-8 text-center hover:border-orange-300 transition-colors`}
                  >
                    <UploadCloud
                      size={48}
                      className="text-gray-400 mx-auto mb-4"
                    />
                    <p className="text-gray-600 mb-4">
                      اسحب الملف هنا أو انقر للاختيار
                    </p>
                    <input
                      type="file"
                      // multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadResources({
                            ...uploadResources,
                            file: e.target.files[0],
                          });
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer inline-block"
                    >
                      اختيار الملف
                    </label>
                  </div>
                </div>
              </div>
              {/* Upload Image */}
              <div className="w-full">
                {uploadResources?.image ? (
                  <div className="relative flex flex-col justify-center items-center h-full">
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-[5px]">
                      صورة الملف
                    </h2>
                    <XSquare
                      size={20}
                      className="absolute top-6 left-14 cursor-pointer text-red-500"
                      onClick={() => {
                        setUploadResources({
                          ...uploadResources,
                          image: null,
                        });
                      }}
                    />
                    <img
                      loading="lazy"
                      src={URL.createObjectURL(uploadResources?.image)}
                      className="h-[200px] w-[250px] object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-[5px]">
                      رفع صورة الملف
                    </h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-300 transition-colors">
                      <UploadCloud
                        size={48}
                        className="text-gray-400 mx-auto mb-4"
                      />
                      <p className="text-gray-600 mb-4">
                        اسحب صورة هنا أو انقر للاختيار
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        // multiple
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setUploadResources({
                              ...uploadResources,
                              image: e.target.files?.[0],
                            });
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />

                      <label
                        htmlFor="image-upload"
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer inline-block"
                      >
                        اختيار صورة الملف
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Selected Files */}
            <div>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadResources?.file && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-800">
                        {uploadResources.file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(uploadResources.file.size)})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setUploadResources({
                          ...uploadResources,
                          file: null, // Clear the single file
                        });
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* File Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Title */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الملف *
                </label>
                <textarea
                  value={uploadResources?.title}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      title: e.target.value,
                    })
                  }
                  rows={1}
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="عنوان الملف..."
                />
              </div>
              {/* Description */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الملف *
                </label>
                <textarea
                  value={uploadResources?.description}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="وصف مختصر للملف..."
                />
              </div>
              {/* File Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الملف *
                </label>
                <select
                  value={uploadResources?.type || ""}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">اختر نوع الملف</option>
                  <option value="resources">مصادر</option>
                  <option value="files">ملفات</option>
                  <option value="bookses">دوسيهات</option>
                  <option value="ministerial_questions">أسئلة وزارية</option>
                </select>
              </div>
              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصص
                </label>
                <select
                  value={uploadResources?.specialization || ""}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      specialization: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">اختر التخصص</option>
                  {specializationData?.map((specialization: any) => (
                    <option key={specialization?.id} value={specialization?.id}>
                      {specialization?.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialization Material */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مادة التخصص
                </label>
                <select
                  value={uploadResources?.specialization_material || ""}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      specialization_material: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">اختر مادة التخصص</option>
                  {specialization_materialData?.map(
                    (specialization_material: any) => (
                      <option
                        key={specialization_material?.id}
                        value={specialization_material?.id}
                      >
                        {specialization_material?.name}
                      </option>
                    )
                  )}
                </select>
              </div> */}
              {/* Teacher */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المعلم *
                </label>
                <select
                  value={uploadResources?.teacher || ""}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      teacher: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">اختر معلم</option>
                  {teacherData?.map((teacher: any) => (
                    <option key={teacher?.id} value={teacher?.id}>
                      {teacher?.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Lesson */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدرس *
                </label>
                <select
                  value={uploadResources?.lesson || ""}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      lesson: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">اختر الدرس</option>
                  {lessonData?.map((lesson: any) => (
                    <option
                      className="text-black"
                      key={lesson?.id}
                      value={lesson?.id}
                    >
                      {lesson?.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col justify-end gap-4">
                {/* Published */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={uploadResources?.is_published || false}
                    onChange={(e) =>
                      setUploadResources({
                        ...uploadResources,
                        is_published: e.target.checked as any,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label
                    htmlFor="isPublished"
                    className="text-sm text-gray-700"
                  >
                    منشور
                  </label>
                </div>
                {/* Free */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFree"
                    disabled={uploadResources?.type === "resources"}
                    checked={
                      uploadResources?.type == "resources"
                        ? true
                        : uploadResources?.is_free || false
                    }
                    onChange={(e) =>
                      setUploadResources({
                        ...uploadResources,
                        is_free: e.target.checked as any,
                      })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor="isFree" className="text-sm text-gray-700">
                    مجانا
                  </label>
                </div>
              </div>
            </div>
            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ انتهاء الصلاحية (اختياري)
              </label>
              <input
                type="date"
                value={uploadResources?.expiry_date || ""}
                onChange={(e) =>
                  setUploadResources({
                    ...uploadResources,
                    expiry_date: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleResourseUpload}
              disabled={
                !uploadResources?.title ||
                !uploadResources?.description ||
                !uploadResources?.file ||
                !uploadResources?.teacher ||
                !uploadResources?.specialization ||
                // !uploadResources?.specialization_material ||
                !uploadResources?.type ||
                !uploadResources?.image
              }
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              رفع الملفات
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الملفات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الملفات التعليمية في المنصة
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Upload size={16} />
          رفع ملفات{" "}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الملفات</p>
              <p className="text-3xl font-bold text-gray-800">
                {resourcesStatsData?.total_resources || 0}
              </p>
            </div>
            <Files className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الملفات النشطة</p>
              <p className="text-3xl font-bold text-green-600">
                {resourcesStatsData?.total_published || 0}
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي التحميلات</p>
              <p className="text-3xl font-bold text-blue-600">
                {resourcesStatsData?.total_downloads || 0}
              </p>
            </div>
            <Download className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        {/* <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">متوسط التقييم</p>
              <p className="text-3xl font-bold text-orange-600">
                2
              </p>
            </div>
            <Star className="w-12 h-12 text-orange-500" />
          </div>
        </div> */}
      </div>

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الملفات..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
            />
          </div>

          {/* Teacher Filter */}
          {/* <select
            value={teacherFilter || ""}
            onChange={(e) =>
              setTeacherFilter(e.target.value ? e.target.value : null)
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع المعلمين</option>
            {teacherData?.map((teacher: any) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select> */}
          {/* Lesson Filter */}
          {/* <select
            value={lessonFilter || ""}
            onChange={(e) =>
              setLessonFilter(e.target.value ? e.target.value : null)
            }
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع الدروس</option>
            {lessonData?.map((lesson: any) => (
              <option key={lesson?.id} value={lesson?.id}>
                {lesson?.title}
              </option>
            ))}
          </select> */}

          {/* Type Filter */}
          <select
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع الأنواع</option>
            {types?.map((type: any, index: any) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* specialization Filter */}
          {/* <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع التخصصات</option>
            {specializationData?.map((specialization: any) => (
              <option key={specialization?.id} value={specialization?.name}>
                {specialization?.name}
              </option>
            ))}
          </select> */}

          {/* specialization_material Filter */}
          {/* <select
            value={specializationMaterialFilter}
            onChange={(e) => setSpecializationMaterialFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="">جميع مواد التخصص</option>
            {specialization_materialData?.map(
              (specialization_material: any) => (
                <option
                  key={specialization_material?.id}
                  value={specialization_material?.name}
                >
                  {specialization_material?.name}
                </option>
              )
            )}
          </select> */}

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 text-sm"
          >
            <option value="all">جميع الحالات</option>
            <option value="true">منشور</option>
            <option value="false">غير منشور</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* resourcess Grid/Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resourcesData?.map((resource: any) => (
            <ResourseCard key={resource.id} resource={resource} />
          ))}

          {/* {filteredresources?.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-orange-100/50">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ||
                resourcesTypeFilter !== "all" ||
                accessFilter !== "all"
                  ? "لا توجد نتائج"
                  : "المجلد فارغ"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                resourcesTypeFilter !== "all" ||
                accessFilter !== "all"
                  ? "لم يتم العثور على ملفات تطابق المعايير المحددة"
                  : "ابدأ برفع ملفات أو إنشاء مجلدات جديدة"}
              </p>
              {!searchTerm &&
                resourcesTypeFilter === "all" &&
                accessFilter === "all" && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      رفع ملفات
                    </button>
                  </div>
                )}
            </div>
          )} */}
        </div>
      ) : isLoading ? (
        <Loader />
      ) : (
        <>
          {/* List View */}
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحجم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التحميلات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الانتهاء
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الشارات
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      حالة النشر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التحكم
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resourcesData?.map((resource: any) => {
                    return (
                      <tr key={resource?.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="font-medium text-gray-900">
                                {resource?.title || "اسم الملف"}
                              </div>
                              {resource.description && (
                                <div className="text-sm text-gray-500">
                                  {resource.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {resource?.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatFileSize(resource?.file_size)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {resource?.number_of_downloads || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(resource?.expiry_date) || "لا يوجد"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {resource?.tags
                            .map((tag: any) => tag?.name)
                            .join(", ") || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {resource?.is_published ? "منشور" : "غير منشور"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* <a
                            href={resource?.url}
                            onClick={() => window.open(resource.url, "_blank")}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="عرض الملف"
                          >
                            <ExternalLink size={16} />
                          </a> */}

                            <button
                              // onClick={() => toggleEditFile(resource.id)}
                              className={`p-1 transition-colors ${
                                resource.isFavorite
                                  ? "text-blue-500"
                                  : "text-gray-400 hover:text-blue-500"
                              }`}
                              title="تعديل الملف"
                            >
                              <Pen size={16} />
                            </button>

                            <button
                              onClick={() => handleDeleteFile(resource.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="حذف الملف"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <Pagination
        currentPage={page}
        count={paginationData?.count}
        onPageChange={setPage}
      />
      {/* Modals */}
      {showCreateModal && CreateModal()}
      {/* {showCreateFolderModal && <CreateFolderModal />} */}
    </div>
  );
};
export default ResourcessPage;
