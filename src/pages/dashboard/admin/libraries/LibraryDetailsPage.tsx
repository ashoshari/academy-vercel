import { useParams } from "react-router";
import { Shield, User } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import Spinner from "@/components/dashboard/Spinner";
import { Library } from "./LibrariesPage";

export default function LibraryDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useCustomQuery(`account/admin/libraries/${id}/`, [
    "library",
    id,
  ]);

  const selectedLibrary: Library = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} thickness={4} className="text-(--brand)" />
      </div>
    );
  }
  if (!selectedLibrary) {
    return (
      <div className="text-center mt-10 text-red-500">
        لم يتم العثور على المكتبة.
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
          <div className="flex items-center gap-4">
            {selectedLibrary?.image ? (
              <img
                src={selectedLibrary?.image}
                alt={selectedLibrary?.name}
                className="w-16 h-16 rounded-full border-2 border-white/20"
              />
            ) : (
              <User className="w-16 h-16 rounded-full border-2 border-white/20 p-3" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedLibrary?.name}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-7.5">
          {/* Personal Info */}
          <div className="grid grid-col-1 lg:grid-cols-2 gap-x-2.5 gap-y-2.5">
            <div className="bg-gray-50 rounded-xl p-6 mb-6 h-full">
              <h3 className="font-bold text-gray-800 mb-4">
                المعلومات الشخصية
              </h3>
              <div className="space-y-3">
                <Info label="البريد الإلكتروني" value={selectedLibrary.email} />
                <Info
                  label="رقم الهاتف"
                  value={selectedLibrary.mobile_number || "غير متوفر"}
                />
                <Info
                  label="نظرة عامة"
                  value={selectedLibrary.about_me || "غير متوفر"}
                />
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-6 h-full">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} />
                معلومات الأمان
              </h3>
              <div className="space-y-3">
                <Info
                  label="آخر تغيير لكلمة المرور"
                  value={
                    selectedLibrary.last_password_change
                      ? formatDateTimeSimple(
                          selectedLibrary.last_password_change,
                        )
                      : "لم يتم تغييرها بعد"
                  }
                />
                <Info
                  label="آخر دخول"
                  value={
                    selectedLibrary.last_login
                      ? formatDateTimeSimple(selectedLibrary.last_login)
                      : "لم يسجل دخول بعد"
                  }
                />
                <Info
                  label="تاريخ الانضمام"
                  value={
                    selectedLibrary.created_at
                      ? formatDateTimeSimple(selectedLibrary.created_at)
                      : "غير متوفر"
                  }
                />
              </div>
            </div>
          </div>

          {/* Status Section */}
          <Section title="الحالة">
            <StatusCard
              title="حالة الحساب"
              description={
                selectedLibrary.is_active
                  ? "نشط - يمكنه تسجيل الدخول"
                  : "معطل - لا يمكنه تسجيل الدخول"
              }
              value={selectedLibrary.is_active ? "نشط" : "معطل"}
              color={selectedLibrary.is_active ? "green" : "red"}
            />
          </Section>
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-sm text-gray-500">{label}</span>
    <p className="font-medium">{value}</p>
  </div>
);

// const Stat = ({
//   label,
//   value,
//   icon,
// }: {
//   label: string;
//   value: any;
//   icon?: React.ReactNode;
// }) => (
//   <div className="flex justify-between">
//     <span className="text-gray-600">{label}</span>
//     <div className="flex items-center gap-1">
//       {icon}
//       <span className="font-medium">{value}</span>
//     </div>
//   </div>
// );

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
    <div className="bg-white rounded-lg">{children}</div>
  </div>
);

const StatusCard = ({
  title,
  description,
  value,
  color,
}: {
  title: string;
  description: string;
  value: string;
  color: "green" | "red" | "blue" | "yellow";
}) => {
  const bgMap: any = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-(--brand-secondary)",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${bgMap[color]}`}
      >
        {value}
      </span>
    </div>
  );
};
