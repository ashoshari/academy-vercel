import { useCustomQuery } from "@/hooks/useQuery";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import {
  Award,
  // BookOpen,
  // FileText,
  // GraduationCap,
  // CreditCard,
  Phone,
  User,
  School,
  ArrowRight,
} from "lucide-react";
import { useParams } from "react-router";
import Spinner from "@/components/dashboard/Spinner";
import { useNavigate } from "react-router";
const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCustomQuery(`/account/admin/students/${id}/`, [
    "student-details",
    id,
  ]);

  const selectedStudent = data?.data;
  console.log("selectedStudent", selectedStudent);
  // const getCourseTypeIcon = (type: string) => {
  //   switch (type) {
  //     case "exam":
  //       return BookOpen;
  //     case "ministry":
  //       return FileText;
  //     case "course":
  //       return GraduationCap;
  //     case "cards":
  //       return CreditCard;
  //     default:
  //       return BookOpen;
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "dropped":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} thickness={4} className="text-orange-500" />
      </div>
    );
  console.log("Student Details:", selectedStudent?.imei_info);
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
          <h1 className="text-2xl font-bold text-gray-800">تفاصيل الطالب</h1>
          <p className="text-gray-600 text-sm">عرض معلومات الطالب</p>
        </div>
      </div>
      <div className="p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-auto">
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 w-full">
                  <img
                    src={
                      selectedStudent?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedStudent?.name
                      )}&background=f97316&color=ffffff&size=64`
                    }
                    alt={selectedStudent?.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="w-full">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedStudent?.name}
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2 text-sm">
                      <div className="space-y-[10px]">
                        <div className="flex items-center gap-x-[10px]">
                          <Award
                            size={16}
                            className="text-gray-600 text-sm font-medium text-center"
                          />
                          <p className="text-gray-600 text-sm font-medium text-center">
                            {selectedStudent?.grade?.name || "-"}{" "}
                          </p>
                        </div>
                        <div className="flex items-center gap-x-[10px]">
                          <School
                            size={16}
                            className="text-gray-600 text-sm font-medium text-center"
                          />
                          <p className="text-gray-600 text-sm font-medium text-center">
                            {selectedStudent?.school_name || "-"}{" "}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-[10px]">
                        <div className="flex items-center gap-x-[10px]">
                          <User
                            size={16}
                            className="text-gray-600 text-sm font-medium text-center"
                          />
                          <p className="text-gray-600 text-sm font-medium text-center">
                            {selectedStudent?.gender || "-"}{" "}
                          </p>
                        </div>
                        <div className="flex items-center gap-x-[10px]">
                          <Phone
                            size={16}
                            className="text-gray-600 font-medium text-center"
                          />
                          <p className="text-gray-600 text-sm font-medium text-center">
                            {selectedStudent?.mobile_number || "-"}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Personal Info */}

                {/* Courses and Activity */}
                <div className="lg:col-span-2 w-full">
                  {/* Enrolled Courses */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      الدورات المسجلة
                    </h3>
                    <div className="space-y-3">
                      {selectedStudent?.courses_enrolled?.map((course: any) => {
                        // const IconComponent = getCourseTypeIcon(
                        //   course?.courseType
                        // );
                        return (
                          <div
                            key={course?.course?.id}
                            className="bg-white border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex items-start gap-4">
                              {/* <IconComponent
                              size={24}
                              className="text-orange-500 mt-1"
                            /> */}
                              <div className="flex-1">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  mb-2">
                                  <div className="col-span-2">
                                    <h4 className="font-medium text-gray-800">
                                      {course?.course?.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      المعلم: {course?.course?.teacher?.name}
                                    </p>
                                  </div>
                                  <div className="text-left flex items-center justify-center gap-x-[10px]">
                                    {course?.course?.level && (
                                      <span
                                        className={`px-2 py-2 rounded-full text-xs font-medium ${getStatusColor(
                                          course?.course?.level?.name
                                        )}`}
                                      >
                                        {course?.course?.level?.name}
                                      </span>
                                    )}
                                    {course?.course?.is_free ? (
                                      <span
                                        className={`px-2 py-2 rounded-full text-xs font-medium bg-green-600 text-white`}
                                      >
                                        مجانا
                                      </span>
                                    ) : (
                                      <span
                                        className={`px-2 py-2 rounded-full text-xs font-medium bg-green-600 text-white`}
                                      >
                                        {course?.course?.card_price?.price ||
                                          "-"}{" "}
                                        د.أ
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm items-center">
                                  <div className="lg:col-span-2">
                                    <span className="text-gray-500">
                                      التقدم
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-orange-500 h-2 rounded-full transition-all"
                                          style={{
                                            width: `${course?.course?.progress}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span className="font-medium">
                                        {course?.course?.progress}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center text-end">
                                    <h4 className="text-gray-500 text-center w-fit">
                                      الوقت المستغرق
                                    </h4>
                                    <p className="font-medium text-center w-fit">
                                      {course?.course?.time_in_hours} ساعة
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Payment History */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">
                      سجل المدفوعات
                    </h3>
                    <div className="space-y-2">
                      {selectedStudent?.payments?.map((payment: any) => (
                        <div
                          key={payment?.id}
                          className="bg-green-50 border border-green-200 rounded-lg p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">
                                {payment?.code_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatDateTimeSimple(payment?.payment_date)}
                              </p>
                            </div>
                            <div className="text-center flex gap-x-[10px]">
                              <p className="font-bold text-green-600">
                                {payment?.amount} د.أ
                              </p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs bg-gray-200 text-black`}
                              >
                                {payment?.payment_method}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* IMEI Info */}
                  {selectedStudent?.imei_info && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-800 mb-4">
                        معلومات رمز هوية الجهاز
                      </h3>
                      <div className="space-y-2">
                        <div className="">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] text-center">
                            <div className="bg-gray-50 rounded-lg p-6 space-y-5">
                              <p className="text-lg text-gray-800">
                                رمز هوية الجهاز (IMEI)
                              </p>
                              <p className="text-sm text-gray-800">
                                {selectedStudent?.imei_info?.imei}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-5">
                              <p className="text-lg text-gray-800">اللغة</p>
                              <p className="text-sm text-gray-800">
                                {selectedStudent?.imei_info?.accept_language.slice(
                                  0,
                                  2
                                ) == "ar"
                                  ? "العربية"
                                  : "English"}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-5">
                              <p className="text-lg text-gray-800">
                                عنوان بروتوكول الإنترنت (IP)
                              </p>
                              <p className="text-sm text-gray-800">
                                {selectedStudent?.imei_info?.ip_address || "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-5">
                              <p className="text-lg text-gray-800">المنصة</p>
                              <p className="text-sm text-gray-800">
                                {selectedStudent?.imei_info?.platform.replace(
                                  /"/g,
                                  ""
                                ) || "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-5">
                              <p className="text-lg text-gray-800">
                                رقم الهاتف
                              </p>
                              <p className="text-sm text-gray-800">
                                {selectedStudent?.imei_info?.mobile || "-"}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 space-y-5">
                              <p className="text-lg text-gray-800">
                                وكيل المستخدم (User Agent)
                              </p>
                              <p className="text-sm text-gray-800">
                                {selectedStudent?.imei_info?.user_agent || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Activity Log */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4">سجل النشاط</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg py-5 px-[10%] text-center">
                          <h2>تم انشاؤه في</h2>
                          <p className="font-medium text-gray-800">
                            {selectedStudent?.created_at === null
                              ? "-"
                              : formatDateTimeSimple(
                                  selectedStudent?.created_at
                                )}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg py-5 px-[10%] text-center">
                          <h2>اخر تسجيل دخول</h2>
                          <p className="font-medium  text-gray-800">
                            {selectedStudent?.last_login == null
                              ? "-"
                              : formatDateTimeSimple(
                                  selectedStudent?.last_login
                                )}
                          </p>
                        </div>
                      </div>
                      {/* {selectedStudent?.activityLog
                      ?.slice(0, 5)
                      .map((activity: any) => (
                        <div
                          key={activity.id}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800">
                                {activity.action}
                              </p>
                              <p className="text-sm text-gray-600">
                                {activity.description}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {activity.timestamp}
                            </p>
                          </div>
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </>
  );
};

export default StudentDetailsPage;
