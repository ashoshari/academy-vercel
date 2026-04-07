import { Library } from "@/pages/dashboard/admin/libraries/LibrariesPage";
import { UseMutationResult } from "@tanstack/react-query";
import {
  CheckCircle,
  Edit,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { SetStateAction } from "react";
import { useNavigate } from "react-router";

interface Props {
  library: Library;
  resetAccountPassword: UseMutationResult<any, Error, any, unknown>;
  resetPassword: () => void;
  setSelectedLibrary: (value: SetStateAction<Library | null>) => void;
  toggleLibraryStatus: () => void;
}

export default function LibraryCard({
  library,
  resetAccountPassword,
  resetPassword,
  setSelectedLibrary,
  toggleLibraryStatus,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-(--brand) to-(--brand-light) text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                library?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  library?.name,
                )}&background=ffffff&color=f97316&size=64`
              }
              alt={library?.name}
              className="w-16 h-16 rounded-full border-2 border-white/20"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                library.is_active ? "bg-green-500" : "bg-gray-400"
              }`}
            ></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{library.name}</h3>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  library.is_active
                    ? "bg-green-400/20 text-green-100"
                    : "bg-red-400/20 text-red-100"
                }`}
              >
                {library.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        {/* Contact Info */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={14} />
            <span>{library.mobile_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={14} />
            <span className="truncate">{library.email || "-"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                resetPassword();
              }}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="إعادة تعيين كلمة المرور"
              disabled={resetAccountPassword.isPending}
            >
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedLibrary(library);
                toggleLibraryStatus();
              }}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                library.is_active
                  ? "text-(--brand-secondary) hover:bg-blue-100"
                  : "text-gray-400 hover:bg-gray-100"
              }`}
              title={library?.is_active ? "إلغاء التفعيل" : "تفعيل المكتبة"}
            >
              {library?.is_active ? (
                <CheckCircle size={16} />
              ) : (
                <XCircle size={16} />
              )}
            </button>

            <button
              onClick={() => {
                navigate(`/dashboard/libraries/${library.id}`);
              }}
              className="p-2 text-gray-400 hover:text-(--brand-secondary) hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              title="عرض التفاصيل"
            >
              <Eye size={16} />
            </button>

            <button
              onClick={() => {
                navigate(`/dashboard/libraries/edit/${library.id}`);
              }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
              title="تعديل المكتبة"
            >
              <Edit size={16} />
            </button>

            {/* Delete library */}
            {/* <button
              onClick={() => handleDeletelibrary()}
              className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="حذف المكتبة"
            >
              <Trash2 size={16} />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
