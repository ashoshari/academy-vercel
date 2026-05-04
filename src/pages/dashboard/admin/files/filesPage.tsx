import { useState } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  X,
  UploadCloud,
  Folder,
  Upload,
  Files,
  Download,
  Plus,
  FolderOpen,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  File,
  EyeOff,
  Grid,
  Rows,
  XSquare,
} from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/useMutation";
import toast from "react-hot-toast";
import { formatDate } from "@/services/date";
import Pagination from "@/components/dashboard/core/Pagination";
import { useQueryClient } from "@tanstack/react-query";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import { readUserFromStorage, roleOf } from "@/services/auth";
import Skeleton from "@/components/dashboard/Skeleton";
import StatsCardsSkeleton from "@/components/dashboard/skeletons/StatsCardsSkeleton";
import TableSkeleton from "@/components/dashboard/skeletons/TableSkeleton";
import { ConfirmationModal } from "@/components/dashboard/core/ConfirmationModal";
import EditButton from "@/components/dashboard/core/EditButton";
import DeleteButton from "@/components/dashboard/core/DeleteButton";
import EmptyState from "@/components/core/EmptyState";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import { edit } from "@/api";

const ResourcesPage = () => {
  const user = readUserFromStorage();
  const role = roleOf(user) ?? "";
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<any>("all");

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const types = [
    {
      label: "مصادر",
      value: "resources",
    },
    { label: "دوسيهات", value: "bookses" },
    { label: "أسئلة الوزارية", value: "ministerial_questions" },
    { label: "ملفات", value: "files" },
  ];

  const [uploadResources, setUploadResources] = useState<any>({
    is_published: true,
  });
  const [selectedResources, setSelectedResources] = useState<any>({});
  const [resourceId, setResourceId] = useState<string>("");
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append("title", searchTerm);
  if (typeFilter) queryParams.append("type", typeFilter);
  // if (typeFilter) queryParams.append("type", typeFilter);
  if (statusFilter) queryParams.append("is_published", statusFilter);
  if (page) queryParams.append("page", page.toString());
  const queryString = queryParams.toString();
  // GET resourcess
  const { data, isLoading } = useCustomQuery(
    `/training/admin/resources/?${queryString}`,
    ["resources", searchTerm, typeFilter, statusFilter, page],
  );
  const resourcesData = data?.data;
  const paginationData = data?.pagination;
  // GET resourcess stats
  const { data: resourcesStats, isLoading: isLoadingStats } = useCustomQuery(
    "/training/admin/resource-statistics/",
    ["resources-stats"],
  );
  // GET teachers
  const { data: teachers } = useCustomQuery(
    "/account/admin/teachers/?page_size=9999",
    ["teachers"],
  );

  const teacherData = teachers?.data;

  // GET SubSection
  const { data: subsections } = useCustomQuery(
    "/training/admin/subsections-ids/",
    ["subsections"],
  );
  const subsectionData = subsections?.data;

  // const lessonData = lessons?.data;
  // GET Specializations
  // const { data: specializations } = useCustomQuery(
  //   "/training/admin/specializations/",
  //   ["specializations"]
  // );

  // GET Specializations_material
  // const { data: specialization_material } = useCustomQuery(
  //   "/training/admin/specialization-materials/",
  //   ["specializations_material"]
  // );
  const [selectedSubSection, setSelectedSubSection] = useState<string>("");
  const [selectedSubSub, setSelectedSubSub] = useState<string>("");
  const [selectedSpec, setSelectedSpec] = useState<string>("");

  const idFromRef = (ref: unknown) => {
    if (ref == null || ref === "") return "";
    if (typeof ref === "object" && ref !== null && "id" in ref) {
      const rid = (ref as { id: unknown }).id;
      if (rid == null || rid === "") return "";
      return String(rid);
    }
    return String(ref);
  };

  const sectionSource = showEditModal
    ? selectedResources
    : showCreateModal
      ? uploadResources
      : null;

  const subsectionLookupId =
    selectedSubSection ||
    (sectionSource ? idFromRef(sectionSource?.subsection) : "");

  const subSubLookupId =
    selectedSubSub ||
    (sectionSource ? idFromRef(sectionSource?.subsubsection) : "");

  const specLookupId =
    selectedSpec ||
    (sectionSource ? idFromRef(sectionSource?.specialization) : "");

  const subSection = subsectionData?.find(
    (s: any) => String(s.id) === String(subsectionLookupId),
  );
  const subsub = subSection?.subsubsections?.find(
    (ss: any) => String(ss.id) === String(subSubLookupId),
  );
  const spec = subsub?.specializations?.find(
    (sp: any) => String(sp.id) === String(specLookupId),
  );
  // const specializationData = specializations?.data;
  const resourcesStatsData = resourcesStats?.data;
  // );
  // POST New resources
  const { mutateAsync: postResources, isPending: isSaving } = useCustomPost(
    "/training/admin/resources/",
    ["postResources"],
  );

  // PUT Resources
  const { mutateAsync: putResources, isPending: isUpdating } = useCustomUpdate(
    `/training/admin/resources/${resourceId}/`,
    ["putResources", resourceId],
  );
  // DELETE Resources
  const { mutateAsync: deleteResources, isPending: isDeleting } =
    useCustomRemove(`/training/admin/resources/${resourceId}/`, [
      "deleteResources",
      resourceId,
    ]);
  const [pendingDeleteResource, setPendingDeleteResource] = useState<{
    id: any;
    title?: string;
  } | null>(null);
  const [pendingPublishToggle, setPendingPublishToggle] = useState<{
    id: any;
    title?: string;
    isPublished: boolean;
    resource: any;
  } | null>(null);
  const [isPublishTogglePending, setIsPublishTogglePending] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const handleDeleteFile = async (id: any) => {
    setResourceId(id);
    setPendingDeleteResource({
      id,
      title:
        resourcesData?.data?.find((r: any) => r?.id === id)?.title ??
        selectedResources?.title ??
        "",
    });
  };

  const confirmDeleteFile = async () => {
    if (!pendingDeleteResource) return;
    try {
      const response = await deleteResources(pendingDeleteResource.id);
      toast.success(response?.data);
      queryClient.invalidateQueries({
        queryKey: ["resources", searchTerm, typeFilter, statusFilter, page],
      });
      setPendingDeleteResource(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  const appendResourceFormDataContent = (
    r: any,
    formData: FormData,
    isPublished: boolean,
  ) => {
    if (r.title) {
      formData.append("title", r.title);
    }
    if (r.description) {
      formData.append("description", r.description);
    }
    if (role !== "teacher" && r.teacher) {
      formData.append(
        "teacher",
        r.teacher.id != null ? r.teacher.id : r.teacher,
      );
    }
    if (r.expiry_date) {
      formData.append("expiry_date", r.expiry_date);
    }
    if (r.subsection) {
      formData.append(
        "subsection",
        idFromRef(r.subsection) || String(r.subsection),
      );
    }
    if (r.subsubsection) {
      formData.append(
        "subsubsection",
        idFromRef(r.subsubsection) || String(r.subsubsection),
      );
    }
    if (r.specialization) {
      formData.append(
        "specialization",
        idFromRef(r.specialization) || String(r.specialization),
      );
    }
    if (r.specialization_material) {
      formData.append(
        "specialization_material",
        idFromRef(r.specialization_material) ||
          String(r.specialization_material),
      );
    }
    if (r.lesson) {
      formData.append("lesson", idFromRef(r.lesson) || String(r.lesson));
    }
    if (r.type) {
      formData.append(
        "type",
        r.type == "مصادر"
          ? "resources"
          : r?.type == "دوسيهات"
            ? "bookses"
            : r?.type == "أسئلة وزارية"
              ? "ministerial_questions"
              : r?.type == "ملفات"
                ? "files"
                : r.type,
      );
    }
    if (r.is_free) {
      formData.append("is_free", r.is_free);
    }
    formData.append("is_published", String(isPublished));
  };

  const requestPublishToggle = (resource: any) => {
    setPendingPublishToggle({
      id: resource?.id,
      title: resource?.title,
      isPublished: Boolean(resource?.is_published),
      resource,
    });
  };

  const confirmPublishToggle = async () => {
    if (!pendingPublishToggle) return;
    const { resource, isPublished: wasPublished } = pendingPublishToggle;
    const nextPublished = !wasPublished;
    const formData = new FormData();
    appendResourceFormDataContent(resource, formData, nextPublished);
    setIsPublishTogglePending(true);
    try {
      const response = await edit(
        `/training/admin/resources/${resource.id}/`,
        formData,
      );
      toast.success(response?.message ?? "تم تحديث حالة النشر");
      queryClient.invalidateQueries({
        queryKey: ["resources", searchTerm, typeFilter, statusFilter, page],
      });
      queryClient.invalidateQueries({
        queryKey: ["resources-stats"],
      });
      setPendingPublishToggle(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    } finally {
      setIsPublishTogglePending(false);
    }
  };

  const handleEditFile = async (id: any) => {
    setResourceId(id);
    const formData = new FormData();
    appendResourceFormDataContent(
      selectedResources,
      formData,
      Boolean(selectedResources.is_published ?? true),
    );
    if (
      selectedResources.image &&
      typeof (selectedResources.image as any).name === "string" &&
      typeof (selectedResources.image as any).size === "number"
    ) {
      formData.append("image", selectedResources.image as File);
    }
    if (
      selectedResources.file &&
      typeof (selectedResources.file as any).name === "string" &&
      typeof (selectedResources.file as any).size === "number"
    ) {
      formData.append("file", selectedResources.file as File);
    }
    try {
      const response = await putResources(formData);
      toast.success(response?.message ?? "تم تعديل المحتوى بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["resources", searchTerm, typeFilter, statusFilter, page],
      });
      queryClient.invalidateQueries({
        queryKey: ["resources-stats"],
      });
      setSelectedSubSection("");
      setSelectedSubSub("");
      setSelectedSpec("");
      setSelectedResources({});
      setShowEditModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };
  const getFileTypeColor = (file: any) => {
    if (file.type === "folder") {
      return "text-(--brand)";
    }

    switch (file.fileType) {
      case "document":
        return "text-(--brand-secondary)";
      case "image":
        return "text-green-600";
      case "video":
        return "text-purple-600";
      case "audio":
        return "text-pink-600";
      case "archive":
        return "text-(--brand)";
      default:
        return "text-gray-600";
    }
  };
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
  const handleResourceUpload = async () => {
    const formData = new FormData();
    if (uploadResources.title) {
      formData.append("title", uploadResources.title);
    }
    if (uploadResources.description) {
      formData.append("description", uploadResources.description);
    }
    if (uploadResources.teacher) {
      formData.append("teacher", uploadResources.teacher);
    }
    if (uploadResources.expiry_date) {
      formData.append("expiry_date", uploadResources.expiry_date);
    }
    if (uploadResources.subsection) {
      formData.append("subsection", uploadResources.subsection);
    }
    if (uploadResources.subsubsection) {
      formData.append("subsubsection", uploadResources.subsubsection);
    }
    if (uploadResources.specialization) {
      formData.append("specialization", uploadResources.specialization);
    }
    if (uploadResources.specialization_material) {
      formData.append(
        "specialization_material",
        uploadResources.specialization_material,
      );
    }
    if (uploadResources.lesson) {
      formData.append("lesson", uploadResources.lesson);
    }
    if (uploadResources.type) {
      formData.append("type", uploadResources.type || null);
    }
    if (uploadResources.is_free) {
      formData.append("is_free", uploadResources.is_free || false);
    }
    if (uploadResources.is_published) {
      formData.append("is_published", uploadResources.is_published ?? true);
    }
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

    try {
      const response = await postResources(formData);
      toast.success(response?.message ?? "تم اضافة المحتوى بنجاح");
      queryClient.invalidateQueries({
        queryKey: ["resources", searchTerm, typeFilter, statusFilter, page],
      });
      queryClient.invalidateQueries({
        queryKey: ["resources-stats"],
      });
      setSelectedSubSection("");
      setSelectedSubSub("");
      setSelectedSpec("");
      setUploadResources({ is_published: true });
      setShowCreateModal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
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
  const ResourceCard = ({ resource }: { resource: any }) => {
    const IconComponent = getFileIcon(resource);
    const iconColor = getFileTypeColor(resource);
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
        {/* Thumbnail/Icon */}
        <div className="relative h-32 shrink-0 bg-gray-50 flex items-center justify-center">
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
        <div className="p-4 flex flex-col flex-1 min-h-0">
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

        <div className="mt-auto px-4 py-3 border-t border-gray-100 bg-gray-50/80 shrink-0">
          <div className="flex justify-end">
            <StatusToggleButton
              isOn={Boolean(resource?.is_published)}
              onToggle={() => requestPublishToggle(resource)}
              titleOn="إلغاء النشر"
              titleOff="نشر"
              disabled={isPublishTogglePending}
              iconSize={22}
            />
            <EditButton
              onClick={() => {
                setSelectedResources(resource);
                setShowEditModal(true);
              }}
              title="تعديل الملف"
            />
            <DeleteButton
              onClick={() => handleDeleteFile(resource?.id)}
              title="حذف الملف"
            />
          </div>
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
                onClick={() => {
                  setSelectedSubSection("");
                  setSelectedSubSub("");
                  setSelectedSpec("");
                  setUploadResources({});
                  setShowCreateModal(false);
                }}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <h2 className="text-lg font-bold text-gray-800 text-center mb-1.25">
                    {!uploadResources?.file ? "رفع الملف *" : "تم رفع الملف"}
                  </h2>
                  <div
                    className={`border-2 border-dashed w-full ${
                      uploadResources?.file && "hidden"
                    } border-gray-300 rounded-lg p-8 text-center hover:border-(--brand) transition-colors`}
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
                      className="btn-brand-slide text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block"
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
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-1.25">
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
                      className="h-50 w-62.5 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-1.25">
                      رفع صورة الملف *
                    </h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-(--brand) transition-colors">
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
                        className="btn-brand-slide text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block"
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
                      className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                  placeholder="عنوان الملف..."
                />
              </div>
              {/* Description */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الملف
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                  placeholder="وصف مختصر للملف..."
                />
              </div>
              {/* File Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الملف *
                </label>
                <select
                  value={uploadResources?.type}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                >
                  <option value="">اختر نوع الملف</option>
                  <option value="resources">مصادر</option>
                  <option value="files">ملفات</option>
                  <option value="bookses">دوسيهات</option>
                  <option value="ministerial_questions">أسئلة وزارية</option>
                </select>
              </div>
              {/* Teacher */}
              {role !== "teacher" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المعلم *
                  </label>
                  <select
                    value={uploadResources?.teacher?.id}
                    onChange={(e) =>
                      setUploadResources({
                        ...uploadResources,
                        teacher: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر معلم</option>
                    {teacherData?.map(
                      (teacher: any) =>
                        teacher?.is_active && (
                          <option key={teacher?.id} value={teacher?.id}>
                            {teacher?.name}
                          </option>
                        ),
                    )}
                  </select>
                </div>
              )}
              {/* SubSections */}
              <div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    value={subsectionLookupId}
                    onChange={(e) => {
                      setSelectedSubSection(e.target.value);
                      setSelectedSubSub("");
                      setSelectedSpec("");
                      setUploadResources({
                        ...uploadResources,
                        subsection: e.target.value,
                        subsubsection: "",
                        specialization: "",
                        specialization_material: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر القسم</option>
                    {subsectionData?.map((subSection: any) => (
                      <option key={subSection.id} value={subSection.id}>
                        {subSection?.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* SubSubSection */}
              {subSection?.subsubsections.length > 0 && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصف *
                    </label>
                    <select
                      value={subSubLookupId}
                      onChange={(e) => {
                        setSelectedSubSub(e.target.value);
                        setSelectedSpec("");
                        setUploadResources({
                          ...uploadResources,
                          subsubsection: e.target.value,
                          specialization: "",
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر الصف</option>
                      {subSection?.subsubsections?.map((subSubSection: any) => (
                        <option key={subSubSection.id} value={subSubSection.id}>
                          {subSubSection?.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specialization */}
              {subsub?.specializations.length > 0 && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التخصص *
                    </label>
                    <select
                      value={specLookupId}
                      onChange={(e) => {
                        setSelectedSpec(e.target.value);
                        setUploadResources({
                          ...uploadResources,
                          specialization: e.target.value,
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر قسم فرعي</option>
                      {subsub?.specializations?.map((specialization: any) => (
                        <option
                          key={specialization.id}
                          value={specialization.id}
                        >
                          {specialization?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specialization Material */}
              {subSubLookupId &&
                subsub?.specialization_materials.length == 0 &&
                subsub?.specializations.length == 0 && (
                  <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                    لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                  </p>
                )}
              {((spec?.specialization_materials?.length ?? 0) > 0 ||
                (subsub?.specializations?.length == 0 &&
                  subsub?.specialization_materials?.length > 0)) && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مادة التخصص *
                    </label>
                    <select
                      value={idFromRef(
                        uploadResources?.specialization_material,
                      )}
                      onChange={(e) => {
                        setUploadResources({
                          ...uploadResources,
                          specialization_material: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر مادة التخصص</option>
                      {((spec?.specialization_materials?.length ?? 0) > 0
                        ? (spec?.specialization_materials ?? [])
                        : (subsub?.specialization_materials ?? [])
                      ).map((specialization_material: any) => (
                        <option
                          key={specialization_material.id}
                          value={specialization_material.id}
                        >
                          {specialization_material?.material}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
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
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              />
            </div>
            <div className="flex flex-col justify-end gap-4">
              {/* Published */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">منشور</p>
                  <p className="text-sm text-gray-500">متاح للطلاب</p>
                </div>
                <input
                  type="checkbox"
                  checked={uploadResources?.is_published ?? true}
                  onChange={(e) =>
                    setUploadResources({
                      ...uploadResources,
                      is_published: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={() => {
                setSelectedSubSection("");
                setSelectedSubSub("");
                setSelectedSpec("");
                setUploadResources({});
                setShowCreateModal(false);
              }}
              className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleResourceUpload}
              disabled={
                isSaving ||
                !uploadResources?.title ||
                !uploadResources?.file ||
                !uploadResources?.image ||
                !uploadResources?.type ||
                (role !== "teacher" && !uploadResources?.teacher) ||
                !uploadResources.subsection ||
                !uploadResources.subsubsection ||
                (subsub?.specializations.length > 0
                  ? !uploadResources.specialization
                  : false) ||
                !uploadResources.specialization_material
              }
              className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              رفع الملف
            </button>
          </div>
        </div>
      </div>
    );
  };
  const EditModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">تعديل الملف</h2>
              <button
                onClick={() => {
                  setSelectedSubSection("");
                  setSelectedSubSub("");
                  setSelectedSpec("");
                  setShowEditModal(false);
                }}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                  <h2 className="text-lg font-bold text-gray-800 text-center mb-1.25">
                    {!selectedResources?.file ? "رفع الملف" : "تم رفع الملف"}
                  </h2>
                  <div
                    className={`border-2 border-dashed w-full ${
                      selectedResources?.file && "hidden"
                    } border-gray-300 rounded-lg p-8 text-center hover:border-(--brand) transition-colors`}
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
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedResources({
                            ...selectedResources,
                            file: e.target.files[0],
                          });
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="btn-brand-slide text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block"
                    >
                      اختيار الملف
                    </label>
                  </div>
                </div>
              </div>
              {/* Upload Image */}
              <div className="w-full">
                {selectedResources?.image ? (
                  <div className="relative flex flex-col justify-center items-center h-full">
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-1.25">
                      صورة الملف
                    </h2>
                    <XSquare
                      size={20}
                      className="absolute top-6 left-14 cursor-pointer text-red-500"
                      onClick={() => {
                        setSelectedResources({
                          ...selectedResources,
                          image: null,
                        });
                      }}
                    />
                    <img
                      loading="lazy"
                      src={selectedResources?.image}
                      className="h-50 w-62.5 object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-800 text-center mb-1.25">
                      رفع صورة الملف
                    </h2>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-(--brand) transition-colors">
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
                            setSelectedResources({
                              ...selectedResources,
                              image: e.target.files?.[0],
                            });
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />

                      <label
                        htmlFor="image-upload"
                        className="btn-brand-slide text-white px-6 py-2 rounded-lg transition-colors cursor-pointer inline-block"
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
                {selectedResources?.file && (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-800">
                        {selectedResources?.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(selectedResources?.file_size)})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedResources({
                          ...selectedResources,
                          file: null, // Clear the single file
                        });
                      }}
                      className="cursor-pointer p-1 text-gray-400 hover:text-red-600 transition-colors"
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
                  value={selectedResources?.title}
                  onChange={(e) =>
                    setSelectedResources({
                      ...selectedResources,
                      title: e.target.value,
                    })
                  }
                  rows={1}
                  className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                  placeholder="عنوان الملف..."
                />
              </div>
              {/* Description */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الملف
                </label>
                <textarea
                  value={selectedResources?.description}
                  onChange={(e) =>
                    setSelectedResources({
                      ...selectedResources,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all resize-none"
                  placeholder="وصف مختصر للملف..."
                />
              </div>
              {/* File Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الملف *
                </label>
                <select
                  value={
                    selectedResources?.type == "مصادر"
                      ? "resources"
                      : selectedResources?.type == "دوسيهات"
                        ? "bookses"
                        : selectedResources?.type == "أسئلة وزارية"
                          ? "ministerial_questions"
                          : selectedResources?.type == "ملفات"
                            ? "files"
                            : selectedResources?.type
                  }
                  onChange={(e) =>
                    setSelectedResources({
                      ...selectedResources,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                >
                  <option value="">اختر نوع الملف</option>
                  <option value="resources">مصادر</option>
                  <option value="bookses">دوسيهات</option>
                  <option value="ministerial_questions">أسئلة وزارية</option>
                  <option value="files">ملفات</option>
                </select>
              </div>
              {/* Teacher */}
              {role !== "teacher" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المعلم *
                  </label>
                  <select
                    value={selectedResources?.teacher?.id ?? ""}
                    onChange={(e) => {
                      const teacherId = e.target.value;
                      // Find the teacher object by id
                      const selectedTeacher = teacherData?.find(
                        (t: any) => t.id === teacherId,
                      );
                      setSelectedResources({
                        ...selectedResources,
                        teacher: selectedTeacher ?? null,
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر معلم</option>
                    {teacherData?.map((teacher: any) => (
                      <option key={teacher?.id} value={teacher?.id}>
                        {teacher?.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* SubSections */}
              <div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    value={subsectionLookupId}
                    onChange={(e) => {
                      setSelectedSubSection(e.target.value);
                      setSelectedSubSub("");
                      setSelectedSpec("");
                      setSelectedResources({
                        ...selectedResources,
                        subsection: e.target.value,
                        subsubsection: "",
                        specialization: "",
                        specialization_material: "",
                      });
                    }}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                  >
                    <option value="">اختر القسم</option>
                    {subsectionData?.map((subSection: any) => (
                      <option key={subSection.id} value={subSection.id}>
                        {subSection?.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* SubSubSection */}
              {subSection?.subsubsections.length > 0 && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصف
                    </label>
                    <select
                      value={subSubLookupId}
                      onChange={(e) => {
                        setSelectedSubSub(e.target.value);
                        setSelectedSpec("");
                        setSelectedResources({
                          ...selectedResources,
                          subsubsection: e.target.value,
                          specialization: "",
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر الصف</option>
                      {subSection?.subsubsections?.map((subSubSection: any) => (
                        <option key={subSubSection.id} value={subSubSection.id}>
                          {subSubSection?.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specialization */}
              {subsub?.specializations.length > 0 && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      التخصص
                    </label>
                    <select
                      value={specLookupId}
                      onChange={(e) => {
                        setSelectedSpec(e.target.value);
                        setSelectedResources({
                          ...selectedResources,
                          specialization: e.target.value,
                          specialization_material: "",
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر قسم فرعي</option>
                      {subsub?.specializations?.map((specialization: any) => (
                        <option
                          key={specialization.id}
                          value={specialization.id}
                        >
                          {specialization?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Specialization Material */}
              {subSubLookupId &&
                subsub?.specialization_materials.length == 0 &&
                subsub?.specializations.length == 0 && (
                  <p className="col-span-1 lg:col-span-2 text-center text-md text-red-600 font-semibold">
                    لا يوجد مواد تخصص لعرضها برجاء اختيار مسار صحيح
                  </p>
                )}
              {(spec?.specialization_materials.length > 0 ||
                (subsub?.specializations?.length == 0 &&
                  subsub?.specialization_materials?.length > 0)) && (
                <div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مادة التخصص
                    </label>
                    <select
                      value={idFromRef(
                        selectedResources?.specialization_material,
                      )}
                      onChange={(e) => {
                        setSelectedResources({
                          ...selectedResources,
                          specialization_material: e.target.value,
                        });
                      }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
                    >
                      <option value="">اختر مادة التخصص</option>
                      {((spec?.specialization_materials?.length ?? 0) > 0
                        ? (spec?.specialization_materials ?? [])
                        : (subsub?.specialization_materials ?? [])
                      ).map((specialization_material: any) => (
                        <option
                          key={specialization_material.id}
                          value={specialization_material.id}
                        >
                          {specialization_material?.material}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ انتهاء الصلاحية (اختياري)
              </label>
              <input
                type="date"
                value={formatDate(selectedResources?.expiry_date) || ""}
                onChange={(e) =>
                  setSelectedResources({
                    ...selectedResources,
                    expiry_date: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all"
              />
            </div>
            <div className="flex flex-col justify-end gap-4">
              {/* Published */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">منشور</p>
                  <p className="text-sm text-gray-500">متاح للطلاب</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedResources?.is_published ?? true}
                  onChange={(e) =>
                    setSelectedResources({
                      ...selectedResources,
                      is_published: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300 text-(--brand) focus:ring-(--brand)"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={() => setShowEditModal(false)}
              className="cursor-pointer px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={() => handleEditFile(selectedResources?.id)}
              disabled={
                isUpdating ||
                !selectedResources?.title ||
                !selectedResources?.file ||
                !selectedResources?.image ||
                !selectedResources?.type ||
                (role !== "teacher" && !selectedResources?.teacher) ||
                !selectedResources.subsection ||
                !selectedResources.subsubsection ||
                (subsub?.specializations.length > 0
                  ? !selectedResources.specialization
                  : false) ||
                !selectedResources.specialization_material
              }
              className="btn-brand-slide px-6 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={16} />
              تعديل الملف
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex md:flex-row flex-col gap-5 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الملفات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الملفات التعليمية في المنصة
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-brand-slide px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm"
        >
          <Upload size={16} />
          رفع ملف{" "}
        </button>
      </div>

      {/* Stats Cards */}
      {isLoadingStats ? (
        <StatsCardsSkeleton
          count={3}
          gridClassName="grid grid-cols-1 lg:grid-cols-3 gap-4"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الملفات</p>
                <p className="text-3xl font-bold text-gray-800">
                  {resourcesStatsData?.total_resources ?? "-"}
                </p>
              </div>
              <Files className="w-12 h-12 text-(--brand)" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">الملفات النشطة</p>
                <p className="text-3xl font-bold text-green-600">
                  {resourcesStatsData?.total_published ?? "-"}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">إجمالي التحميلات</p>
                <p className="text-3xl font-bold text-(--brand-secondary)">
                  {resourcesStatsData?.total_downloads ?? "-"}
                </p>
              </div>
              <Download className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          {/* <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">متوسط التقييم</p>
              <p className="text-3xl font-bold text-(--brand)">
                2
              </p>
            </div>
            <Star className="w-12 h-12 text-(--brand)" />
          </div>
        </div> */}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث عن اسم الملف..."
              className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter || ""}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
          >
            <option value="">جميع الأنواع</option>
            {types?.map((type: any, index: any) => (
              <option key={index} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 text-sm"
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
                  ? "bg-gray-100 text-(--brand)"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Rows size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`cursor-pointer p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-100 text-(--brand)"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* resourcess Grid/Table */}
      {isLoading || isDeleting ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="card" className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <TableSkeleton rows={10} header={false} />
        )
      ) : !resourcesData || resourcesData?.length === 0 ? (
        <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
          <EmptyState
            title="لا توجد نتائج"
            description="ابدأ بإضافة ملفات جديدة للمنصة"
            size="md"
            action={
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                إضافة ملف جديد
              </button>
            }
          />
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resourcesData?.map((resource: any) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          {/* List View */}
          <div className="w-full max-w-50 min-w-full pb-6 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
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
                          <span className="text-gray-700">
                            {resource?.is_published ? "منشور" : "غير منشور"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusToggleButton
                              isOn={Boolean(resource?.is_published)}
                              onToggle={() => requestPublishToggle(resource)}
                              titleOn="إلغاء النشر"
                              titleOff="نشر"
                              disabled={isPublishTogglePending}
                              iconSize={22}
                            />
                            <EditButton
                              onClick={() => {
                                setShowEditModal(true);
                                setSelectedResources(resource);
                              }}
                              className="cursor-pointer p-1 transition-colors text-gray-400 hover:text-blue-500"
                              title="تعديل الملف"
                            />

                            <DeleteButton
                              onClick={() => handleDeleteFile(resource?.id)}
                              title="حذف الملف"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
            currentPage={page}
            count={paginationData?.count}
            onPageChange={setPage}
          />
        </>
      )}
      {/* Modals */}
      {showCreateModal && CreateModal()}
      {showEditModal && EditModal()}

      {pendingDeleteResource && (
        <ConfirmationModal
          open
          onClose={() => !isDeleting && setPendingDeleteResource(null)}
          onConfirm={confirmDeleteFile}
          title="حذف الملف"
          variant="danger"
          confirmLabel="نعم، حذف"
          isPending={isDeleting}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.
              </p>
              {pendingDeleteResource.title ? (
                <p className="text-sm text-gray-600">
                  العنوان:{" "}
                  <span className="font-semibold text-(--brand-secondary)">
                    {pendingDeleteResource.title}
                  </span>
                </p>
              ) : null}
            </>
          }
        />
      )}

      {pendingPublishToggle && (
        <ConfirmationModal
          open
          onClose={() =>
            !isPublishTogglePending && setPendingPublishToggle(null)
          }
          onConfirm={confirmPublishToggle}
          title={
            pendingPublishToggle.isPublished ? "إلغاء نشر الملف" : "نشر الملف"
          }
          variant={pendingPublishToggle.isPublished ? "danger" : "success"}
          confirmLabel={
            pendingPublishToggle.isPublished ? "نعم، إلغاء النشر" : "نعم، نشر"
          }
          isPending={isPublishTogglePending}
          description={
            <>
              <p className="text-base">
                هل أنت متأكد أنك تريد{" "}
                <span className="font-bold text-gray-900">
                  {pendingPublishToggle.isPublished ? "إلغاء نشر" : "نشر"}
                </span>{" "}
                الملف
                {pendingPublishToggle.title ? (
                  <>
                    {" "}
                    <span className="font-bold text-(--brand-secondary)">
                      {pendingPublishToggle.title}
                    </span>
                  </>
                ) : null}
                ؟
              </p>
              {pendingPublishToggle.isPublished ? (
                <p className="text-sm text-amber-900/90 bg-amber-50 border border-amber-100 rounded-xl p-3 mt-3">
                  لن يكون الملف متاحًا للطلاب حتى تقوم بنشره مجددًا.
                </p>
              ) : (
                <p className="text-sm text-emerald-900/90 bg-emerald-50 border border-emerald-100 rounded-xl p-3 mt-3">
                  سيصبح الملف متاحًا للطلاب وفق إعدادات الصلاحيات.
                </p>
              )}
            </>
          }
        />
      )}
    </div>
  );
};
export default ResourcesPage;
