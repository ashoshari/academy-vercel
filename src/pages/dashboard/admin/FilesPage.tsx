import React, { useState } from "react";
import {
  // Plus,
  Search,
  // Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  // ArrowLeft,
  Folder,
  FolderOpen,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
  HardDrive,
  // Cloud,
  // Link,
  // Copy,
  // Move,
  Share,
  Lock,
  Unlock,
  // Calendar,
  // User,
  // Hash,
  // Filter,
  Grid,
  List,
  // SortAsc,
  // SortDesc,
  // MoreVertical,
  X,
  // Save,
  FolderPlus,
  UploadCloud,
  ExternalLink,
  // Info,
  // Settings,
  Star,
  // Tag,
  // Clock,
  // CheckCircle,
  // AlertCircle,
} from "lucide-react";

export interface FileItem {
  id: number;
  name: string;
  type: "folder" | "file";
  fileType?: "document" | "image" | "video" | "audio" | "archive" | "other";
  extension?: string;
  size: number; // in bytes
  url?: string;
  parentId: number | null;
  path: string;
  isPublic: boolean;
  isShared: boolean;
  isFavorite: boolean;
  description?: string;
  tags: string[];
  targetedSections: number[];
  targetedSubsections: number[];
  uploadedBy: string;
  uploadedAt: string;
  lastModified: string;
  downloadCount: number;
  accessLevel: "public" | "students" | "teachers" | "admin";
  expiryDate?: string;
  thumbnail?: string;
  metadata?: {
    duration?: number; // for videos/audio in seconds
    dimensions?: { width: number; height: number }; // for images/videos
    pages?: number; // for documents
  };
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  totalDownloads: number;
  fileTypes: {
    documents: number;
    images: number;
    videos: number;
    audio: number;
    archives: number;
    others: number;
  };
}

const FilesPage = () => {
  // const [currentView, setCurrentView] = useState<
  //   "list" | "upload" | "create-folder"
  // >("list");
  const [currentPath, setCurrentPath] = useState<number | null>(null);
  // const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<
    "all" | "folder" | "document" | "image" | "video" | "audio" | "archive"
  >("all");
  const [accessFilter, setAccessFilter] = useState<
    "all" | "public" | "students" | "teachers" | "admin"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "size" | "date" | "downloads">(
    "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  // Sample files data

  const [files, setFiles] = useState<any>();
  const [newFolder, setNewFolder] = useState({
    name: "",
    description: "",
    accessLevel: "students" as FileItem["accessLevel"],
    targetedSections: [] as number[],
    targetedSubsections: [] as number[],
  });

  const [uploadFiles, setUploadFiles] = useState({
    files: [] as any,
    description: "",
    accessLevel: "students" as FileItem["accessLevel"],
    targetedSections: [] as number[],
    targetedSubsections: [] as number[],
    tags: [] as string[],
    expiryDate: "",
  });

  // Get current folder files
  const currentFiles = files?.filter(
    (file: any) => file.parentId === currentPath,
  );

  // Filter and sort files
  const filteredFiles = currentFiles
    ?.filter((file: any) => {
      const matchesSearch =
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.tags.some((tag: any) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesType =
        fileTypeFilter === "all" ||
        (fileTypeFilter === "folder" && file.type === "folder") ||
        (fileTypeFilter !== "folder" && file.fileType === fileTypeFilter);

      const matchesAccess =
        accessFilter === "all" || file.accessLevel === accessFilter;

      return matchesSearch && matchesType && matchesAccess;
    })
    .sort((a: any, b: any) => {
      let comparison = 0;

      // Folders first
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = a.size - b.size;
          break;
        case "date":
          comparison =
            new Date(a.lastModified).getTime() -
            new Date(b.lastModified).getTime();
          break;
        case "downloads":
          comparison = a.downloadCount - b.downloadCount;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Calculate stats
  const stats: FileStats = {
    totalFiles: files?.filter((f: any) => f.type === "file").length,
    totalSize: files?.reduce((sum: any, f: any) => sum + f.size, 0),
    totalDownloads: files?.reduce(
      (sum: any, f: any) => sum + f.downloadCount,
      0,
    ),
    fileTypes: {
      documents: files?.filter((f: any) => f.fileType === "document").length,
      images: files?.filter((f: any) => f.fileType === "image").length,
      videos: files?.filter((f: any) => f.fileType === "video").length,
      audio: files?.filter((f: any) => f.fileType === "audio").length,
      archives: files?.filter((f: any) => f.fileType === "archive").length,
      others: files?.filter((f: any) => f.fileType === "other").length,
    },
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (file: FileItem) => {
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

  const getFileTypeColor = (file: FileItem) => {
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

  const getAccessLevelColor = (level: FileItem["accessLevel"]) => {
    switch (level) {
      case "public":
        return "bg-green-100 text-green-800";
      case "students":
        return "bg-blue-100 text-(--brand-secondary)";
      case "teachers":
        return "bg-purple-100 text-purple-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateFolder = () => {
    if (newFolder.name) {
      const folder: FileItem = {
        id: Date.now(),
        name: newFolder.name,
        type: "folder",
        size: 0,
        parentId: currentPath,
        path: currentPath
          ? `${files.find((f: any) => f.id === currentPath)?.path}/${
              newFolder.name
            }`
          : `/${newFolder.name}`,
        isPublic: newFolder.accessLevel === "public",
        isShared: false,
        isFavorite: false,
        description: newFolder.description,
        tags: [],
        targetedSections: newFolder.targetedSections,
        targetedSubsections: newFolder.targetedSubsections,
        uploadedBy: "المدير الحالي",
        uploadedAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        downloadCount: 0,
        accessLevel: newFolder.accessLevel,
      };

      setFiles([...files, folder]);
      setNewFolder({
        name: "",
        description: "",
        accessLevel: "students",
        targetedSections: [],
        targetedSubsections: [],
      });
      setShowCreateFolderModal(false);
    }
  };

  const handleFileUpload = () => {
    // Simulate file upload
    uploadFiles.files.forEach((file: any, index: any) => {
      const fileItem: FileItem = {
        id: Date.now() + index,
        name: file.name,
        type: "file",
        fileType: getFileTypeFromExtension(file.name),
        extension: file.name.split(".").pop()?.toLowerCase(),
        size: file.size,
        url: URL.createObjectURL(file),
        parentId: currentPath,
        path: currentPath
          ? `${files.find((f: any) => f.id === currentPath)?.path}/${file.name}`
          : `/${file.name}`,
        isPublic: uploadFiles.accessLevel === "public",
        isShared: false,
        isFavorite: false,
        description: uploadFiles.description,
        tags: uploadFiles.tags,
        targetedSections: uploadFiles.targetedSections,
        targetedSubsections: uploadFiles.targetedSubsections,
        uploadedBy: "المدير الحالي",
        uploadedAt: new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        downloadCount: 0,
        accessLevel: uploadFiles.accessLevel,
        expiryDate: uploadFiles.expiryDate || undefined,
      };

      setFiles((prev: any) => [...prev, fileItem]);
    });

    setUploadFiles({
      files: [],
      description: "",
      accessLevel: "students",
      targetedSections: [],
      targetedSubsections: [],
      tags: [],
      expiryDate: "",
    });
    setShowUploadModal(false);
  };

  const getFileTypeFromExtension = (filename: string): FileItem["fileType"] => {
    const ext = filename.split(".").pop()?.toLowerCase();

    if (["pdf", "doc", "docx", "txt", "rtf"].includes(ext || ""))
      return "document";
    if (["jpg", "jpeg", "png", "gif", "bmp", "svg"].includes(ext || ""))
      return "image";
    if (["mp4", "avi", "mov", "wmv", "flv", "webm"].includes(ext || ""))
      return "video";
    if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext || ""))
      return "audio";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) return "archive";

    return "other";
  };

  const handleDeleteFile = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا العنصر؟")) {
      // Delete file and all its children if it's a folder
      const deleteRecursively = (targetId: number) => {
        const children = files.filter((f: any) => f.parentId === targetId);
        children.forEach((child: any) => deleteRecursively(child.id));
        setFiles((prev: any) => prev.filter((f: any) => f.id !== targetId));
      };

      deleteRecursively(id);
    }
  };

  const toggleFileFavorite = (id: number) => {
    setFiles(
      files.map((file: any) =>
        file.id === id ? { ...file, isFavorite: !file.isFavorite } : file,
      ),
    );
  };

  const navigateToFolder = (folderId: number | null) => {
    setCurrentPath(folderId);
    // setSelectedFiles([]);
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentId = currentPath;

    while (currentId !== null) {
      const folder = files.find((f: any) => f.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  const FileCard = ({ file }: { file: FileItem }) => {
    const IconComponent = getFileIcon(file);
    const iconColor = getFileTypeColor(file);

    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group">
        {/* Thumbnail/Icon */}
        <div className="relative h-32 bg-gray-50 flex items-center justify-center">
          {file.thumbnail ? (
            <img
              loading="lazy"
              src={file.thumbnail}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent size={48} className={iconColor} />
          )}

          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {file.type === "folder" ? (
              <button
                onClick={() => navigateToFolder(file.id)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                title="فتح المجلد"
              >
                <Eye size={16} />
              </button>
            ) : (
              <button
                onClick={() => window.open(file.url, "_blank")}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                title="عرض الملف"
              >
                <ExternalLink size={16} />
              </button>
            )}

            <button
              onClick={() => toggleFileFavorite(file.id)}
              className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                file.isFavorite
                  ? "bg-yellow-500/80 text-white"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
              title={file.isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
            >
              <Star size={16} />
            </button>

            <button
              onClick={() => handleDeleteFile(file.id)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/80 transition-colors"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Status Badges */}
          <div className="absolute top-2 right-2 flex gap-1">
            {file.isFavorite && (
              <Star size={14} className="text-yellow-500 fill-current" />
            )}
            {file.isShared && <Share size={14} className="text-blue-500" />}
            {file.accessLevel === "public" ? (
              <Unlock size={14} className="text-green-500" />
            ) : (
              <Lock size={14} className="text-red-500" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-3">
            <h3
              className="font-medium text-gray-800 truncate"
              title={file.name}
            >
              {file.name}
            </h3>
            {file.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {file.description}
              </p>
            )}
          </div>

          {/* File Info */}
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>الحجم</span>
              <span className="font-medium">{formatFileSize(file.size)}</span>
            </div>

            {file.type === "file" && (
              <div className="flex items-center justify-between">
                <span>التحميلات</span>
                <span className="font-medium">{file.downloadCount}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>آخر تعديل</span>
              <span className="font-medium">{file.lastModified}</span>
            </div>
          </div>

          {/* Access Level */}
          <div className="mt-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(
                file.accessLevel,
              )}`}
            >
              {file.accessLevel === "public"
                ? "عام"
                : file.accessLevel === "students"
                  ? "طلاب"
                  : file.accessLevel === "teachers"
                    ? "معلمين"
                    : "إداريين"}
            </span>
          </div>

          {/* Tags */}
          {file.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {file.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
              {file.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{file.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Upload Modal
  const UploadModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">رفع ملفات جديدة</h2>
            <button
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-(--brand) transition-colors">
            <UploadCloud size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              اسحب الملفات هنا أو انقر للاختيار
            </p>
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setUploadFiles({
                    ...uploadFiles,
                    files: Array.from(e.target.files),
                  });
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="bg-(--brand) text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors cursor-pointer inline-block"
            >
              اختيار الملفات
            </label>
          </div>

          {/* Selected Files */}
          {uploadFiles.files.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3">
                الملفات المحددة ({uploadFiles.files.length})
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadFiles.files.map((file: any, index: any) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <File size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-800">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const newFiles = uploadFiles.files.filter(
                          (_: any, i: any) => i !== index,
                        );
                        setUploadFiles({ ...uploadFiles, files: newFiles });
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الملفات
              </label>
              <textarea
                value={uploadFiles.description}
                onChange={(e) =>
                  setUploadFiles({
                    ...uploadFiles,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all resize-none"
                placeholder="وصف مختصر للملفات..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مستوى الوصول
              </label>
              <select
                value={uploadFiles.accessLevel}
                onChange={(e) =>
                  setUploadFiles({
                    ...uploadFiles,
                    accessLevel: e.target.value as FileItem["accessLevel"],
                  })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
              >
                <option value="public">عام - متاح للجميع</option>
                <option value="students">طلاب - متاح للطلاب فقط</option>
                <option value="teachers">معلمين - متاح للمعلمين فقط</option>
                <option value="admin">إداريين - متاح للإداريين فقط</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ انتهاء الصلاحية (اختياري)
            </label>
            <input
              type="date"
              value={uploadFiles.expiryDate}
              onChange={(e) =>
                setUploadFiles({ ...uploadFiles, expiryDate: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowUploadModal(false)}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleFileUpload}
            disabled={uploadFiles.files.length === 0}
            className="px-6 py-2 bg-linear-to-r from-(--brand) to-(--brand-light) text-white rounded-lg hover:from-(--brand-light) hover:to-(--brand) transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            رفع الملفات
          </button>
        </div>
      </div>
    </div>
  );

  // Create Folder Modal
  const CreateFolderModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">إنشاء مجلد جديد</h2>
            <button
              onClick={() => setShowCreateFolderModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المجلد *
            </label>
            <input
              type="text"
              value={newFolder.name}
              onChange={(e) =>
                setNewFolder({ ...newFolder, name: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
              placeholder="أدخل اسم المجلد..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف المجلد
            </label>
            <textarea
              value={newFolder.description}
              onChange={(e) =>
                setNewFolder({ ...newFolder, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all resize-none"
              placeholder="وصف مختصر للمجلد..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مستوى الوصول
            </label>
            <select
              value={newFolder.accessLevel}
              onChange={(e) =>
                setNewFolder({
                  ...newFolder,
                  accessLevel: e.target.value as FileItem["accessLevel"],
                })
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all"
            >
              <option value="public">عام - متاح للجميع</option>
              <option value="students">طلاب - متاح للطلاب فقط</option>
              <option value="teachers">معلمين - متاح للمعلمين فقط</option>
              <option value="admin">إداريين - متاح للإداريين فقط</option>
            </select>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={() => setShowCreateFolderModal(false)}
            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleCreateFolder}
            disabled={!newFolder.name}
            className="px-6 py-2 bg-linear-to-r from-(--brand) to-(--brand-light) text-white rounded-lg hover:from-(--brand-light) hover:to-(--brand) transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FolderPlus size={16} />
            إنشاء المجلد
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة الملفات</h1>
          <p className="text-gray-600 text-sm">
            إدارة شاملة لجميع الملفات والمجلدات في المنصة
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <FolderPlus size={16} />
            مجلد جديد
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2 text-sm"
          >
            <Upload size={16} />
            رفع ملفات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي الملفات</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalFiles}
              </p>
            </div>
            <File className="w-12 h-12 text-(--brand)" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">الحجم الإجمالي</p>
              <p className="text-3xl font-bold text-(--brand-secondary)">
                {formatFileSize(stats.totalSize)}
              </p>
            </div>
            <HardDrive className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">إجمالي التحميلات</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.totalDownloads}
              </p>
            </div>
            <Download className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">المجلدات</p>
              <p className="text-3xl font-bold text-purple-600">
                {files?.filter((f: any) => f.type === "folder").length}
              </p>
            </div>
            <Folder className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      {currentPath !== null && (
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-4 border border-(--brand)">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => navigateToFolder(null)}
              className="text-(--brand) hover:text-(--brand-light) transition-colors"
            >
              الرئيسية
            </button>
            {getBreadcrumbs().map((folder) => (
              <React.Fragment key={folder.id}>
                <span className="text-gray-400">/</span>
                <button
                  onClick={() => navigateToFolder(folder.id)}
                  className="text-(--brand) hover:text-(--brand-light) transition-colors"
                >
                  {folder.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="البحث في الملفات..."
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
            />
          </div>

          {/* File Type Filter */}
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
          >
            <option value="all">جميع الأنواع</option>
            <option value="folder">مجلدات</option>
            <option value="document">مستندات</option>
            <option value="image">صور</option>
            <option value="video">فيديو</option>
            <option value="audio">صوت</option>
            <option value="archive">أرشيف</option>
          </select>

          {/* Access Filter */}
          <select
            value={accessFilter}
            onChange={(e) => setAccessFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
          >
            <option value="all">جميع المستويات</option>
            <option value="public">عام</option>
            <option value="students">طلاب</option>
            <option value="teachers">معلمين</option>
            <option value="admin">إداريين</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split("-");
              setSortBy(by as any);
              setSortOrder(order as any);
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) transition-all duration-300 text-sm"
          >
            <option value="name-asc">الاسم (أ-ي)</option>
            <option value="name-desc">الاسم (ي-أ)</option>
            <option value="size-asc">الحجم (صغير-كبير)</option>
            <option value="size-desc">الحجم (كبير-صغير)</option>
            <option value="date-asc">التاريخ (قديم-جديد)</option>
            <option value="date-desc">التاريخ (جديد-قديم)</option>
            <option value="downloads-desc">الأكثر تحميلاً</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-orange-100 text-(--brand)"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-orange-100 text-(--brand)"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFiles?.map((file: any) => (
            <FileCard key={file.id} file={file} />
          ))}

          {filteredFiles?.length === 0 && (
            <div className="col-span-full bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-12 text-center border border-(--brand)">
              <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {searchTerm ||
                fileTypeFilter !== "all" ||
                accessFilter !== "all"
                  ? "لا توجد نتائج"
                  : "المجلد فارغ"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ||
                fileTypeFilter !== "all" ||
                accessFilter !== "all"
                  ? "لم يتم العثور على ملفات تطابق المعايير المحددة"
                  : "ابدأ برفع ملفات أو إنشاء مجلدات جديدة"}
              </p>
              {!searchTerm &&
                fileTypeFilter === "all" &&
                accessFilter === "all" && (
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-6 py-3 rounded-lg font-medium hover:from-(--brand-light) hover:to-(--brand) transition-all duration-300 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      رفع ملفات
                    </button>
                    <button
                      onClick={() => setShowCreateFolderModal(true)}
                      className="border border-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <FolderPlus size={16} />
                      إنشاء مجلد
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      ) : (
        // List View
        <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand)">
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
                    الوصول
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    آخر تعديل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file: any) => {
                  const IconComponent = getFileIcon(file);
                  const iconColor = getFileTypeColor(file);

                  return (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <IconComponent size={20} className={iconColor} />
                          <div>
                            <div className="font-medium text-gray-900">
                              {file.name}
                            </div>
                            {file.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {file.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.type === "folder"
                          ? "مجلد"
                          : file.fileType === "document"
                            ? "مستند"
                            : file.fileType === "image"
                              ? "صورة"
                              : file.fileType === "video"
                                ? "فيديو"
                                : file.fileType === "audio"
                                  ? "صوت"
                                  : file.fileType === "archive"
                                    ? "أرشيف"
                                    : "أخرى"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.downloadCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(
                            file.accessLevel,
                          )}`}
                        >
                          {file.accessLevel === "public"
                            ? "عام"
                            : file.accessLevel === "students"
                              ? "طلاب"
                              : file.accessLevel === "teachers"
                                ? "معلمين"
                                : "إداريين"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.lastModified}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {file.type === "folder" ? (
                            <button
                              onClick={() => navigateToFolder(file.id)}
                              className="p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                              title="فتح المجلد"
                            >
                              <Eye size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => window.open(file.url, "_blank")}
                              className="p-1 text-gray-400 hover:text-(--brand-secondary) transition-colors"
                              title="عرض الملف"
                            >
                              <ExternalLink size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => toggleFileFavorite(file.id)}
                            className={`p-1 transition-colors ${
                              file.isFavorite
                                ? "text-yellow-500"
                                : "text-gray-400 hover:text-yellow-500"
                            }`}
                            title={
                              file.isFavorite
                                ? "إزالة من المفضلة"
                                : "إضافة للمفضلة"
                            }
                          >
                            <Star size={16} />
                          </button>

                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="حذف"
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
      )}

      {/* Modals */}
      {showUploadModal && <UploadModal />}
      {showCreateFolderModal && <CreateFolderModal />}
    </div>
  );
};

export default FilesPage;
