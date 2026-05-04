import { Library } from "@/pages/dashboard/admin/libraries/LibrariesPage";
import StatusToggleButton from "@/components/dashboard/core/StatusToggleButton";
import { UseMutationResult } from "@tanstack/react-query";
import { Mail, Phone, Wallet } from "lucide-react";
import { useNavigate } from "react-router";
import RefreshButton from "../../core/RefreshButton";
import DetailsButton from "../../core/DetailsButton";
import EditButton from "../../core/EditButton";

interface Props {
  library: Library;
  resetAccountPassword: UseMutationResult<any, Error, any, unknown>;
  requestPasswordReset: (library: Library) => void;
  toggleLibraryStatus: () => void;
}

export default function LibraryCard({
  library,
  resetAccountPassword,
  requestPasswordReset,
  toggleLibraryStatus,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-(--brand) overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="p-6 bg-linear-to-r from-(--brand) to-(--brand-light) text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                library?.image ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  library?.name,
                )}&background=ffffff&color=2465c9&size=64`
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
                    ? "bg-blue-400/20 text-white"
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
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-end gap-1">
            <StatusToggleButton
              isOn={Boolean(library?.is_active)}
              onToggle={toggleLibraryStatus}
              titleOn="إلغاء التفعيل"
              titleOff="تفعيل المكتبة"
              className="p-2"
            />

            <RefreshButton
              onClick={() => requestPasswordReset(library)}
              title="إعادة تعيين كلمة المرور"
              disabled={resetAccountPassword.isPending}
            />

            <DetailsButton
              onClick={() => {
                navigate(`/dashboard/libraries/${library.id}`);
              }}
            />

            <EditButton
              onClick={() => {
                navigate(`/dashboard/libraries/edit/${library.id}`);
              }}
              title="تعديل المكتبة"
            />

            <button
              type="button"
              onClick={() => {
                navigate(`/dashboard/libraries/wallet/${library.id}`);
              }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
              title="المحفظة"
            >
              <Wallet size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
