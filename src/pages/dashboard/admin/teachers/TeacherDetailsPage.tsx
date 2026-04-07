import { useParams } from "react-router";
import { Shield, ArrowRight, User } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import Spinner from "@/components/dashboard/Spinner";
import { useNavigate } from "react-router";
export default function TeacherDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCustomQuery(`account/admin/teachers/${id}/`, [
    "teacher",
    id,
  ]);

  const selectedTeacher = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} thickness={4} className="text-orange-500" />
      </div>
    );
  }
  if (!selectedTeacher) {
    return (
      <div className="text-center mt-10 text-red-500">
        لم يتم العثور على المعلم.
      </div>
    );
  }
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">تفاصيل المعلم</h1>
          <p className="text-gray-600 text-sm">عرض معلومات المعلم</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6 border-b pb-4 border-gray-200">
            <div className="flex items-center gap-4">
              {selectedTeacher?.image ? (
                <img
                  src={selectedTeacher?.image}
                  alt={selectedTeacher?.name}
                  className="w-16 h-16 rounded-full border-2 border-white/20"
                />
              ) : (
                <User className="w-16 h-16 rounded-full border-2 border-white/20 p-3" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedTeacher?.name}
                </h2>
                <p className="text-gray-600">
                  {selectedTeacher?.materials.map(
                    (material: any, index: number, arr: any) =>
                      `${material?.name}${index + 1 !== arr.length ? ", " : ""}`,
                  ) || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7.5">
            {/* Personal Info */}
            <div className="grid grid-col-1 lg:grid-cols-3 gap-x-2.5 gap-y-2.5">
              <div className="bg-gray-50 rounded-xl p-6 mb-6 h-full">
                <h3 className="font-bold text-gray-800 mb-4">
                  المعلومات الشخصية
                </h3>
                <div className="space-y-3">
                  <Info
                    label="البريد الإلكتروني"
                    value={selectedTeacher.email}
                  />
                  <Info
                    label="رقم الهاتف"
                    value={selectedTeacher.mobile_number || "غير متوفر"}
                  />
                  {/* <Info
                    label="التخصص"
                    value={selectedTeacher.academic_qualification}
                  /> */}
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
                      selectedTeacher.last_password_change
                        ? formatDateTimeSimple(
                            selectedTeacher.last_password_change,
                          )
                        : "لم يتم تغييرها بعد"
                    }
                  />
                  <Info
                    label="آخر دخول"
                    value={
                      selectedTeacher.last_login
                        ? formatDateTimeSimple(selectedTeacher.last_login)
                        : "لم يسجل دخول بعد"
                    }
                  />
                  <Info
                    label="تاريخ الانضمام"
                    value={
                      selectedTeacher.created_at
                        ? formatDateTimeSimple(selectedTeacher.created_at)
                        : "غير متوفر"
                    }
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6 h-full">
                <h3 className="font-bold text-gray-800 mb-4">الإحصائيات</h3>
                <div className="space-y-4">
                  <Stat
                    label="عدد الطلاب"
                    value={selectedTeacher.number_of_students_enrolled}
                  />
                  <Stat
                    label="عدد الدورات"
                    value={selectedTeacher.number_of_courses_has}
                  />
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="">
              {/* <Section title="المواد التي يدرسها">
              <div className="flex flex-wrap gap-2">
                {selectedTeacher?.materials?.length ? (
                  selectedTeacher?.materials.map((subject: any) => (
                    <span
                      key={subject?.id}
                      className="px-3 py-2 bg-blue-100 text-(--brand-secondary) rounded-lg font-medium"
                    >
                      {subject?.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">لم يتم تحديد مواد بعد.</p>
                )}
              </div>
            </Section> */}

              {/* <Section title="الشهادات والدورات">
              {selectedTeacher.academic_qualification?.length ? (
                selectedTeacher.academic_qualification.map(
                  (cert: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg"
                    >
                      <Award size={16} className="text-green-600" />
                      <span className="text-green-800 font-medium">{cert}</span>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500">لم يتم إضافة شهادات بعد.</p>
              )}
            </Section> */}

              <Section title="الحالة">
                <div className="">
                  <StatusCard
                    title="حالة الحساب"
                    description={
                      selectedTeacher.is_active
                        ? "نشط - يمكنه تسجيل الدخول"
                        : "معطل - لا يمكنه تسجيل الدخول"
                    }
                    value={selectedTeacher.is_active ? "نشط" : "معطل"}
                    color={selectedTeacher.is_active ? "green" : "red"}
                  />
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-sm text-gray-500">{label}</span>
    <p className="font-medium">{value}</p>
  </div>
);

const Stat = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: any;
  icon?: React.ReactNode;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-medium">{value}</span>
    </div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
    <div className="bg-white border border-gray-200 rounded-lg">{children}</div>
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
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
