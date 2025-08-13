import { useCustomQuery } from "@/hooks/useQuery";
import {
  Award,
  BookOpen,
  FileText,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { useParams } from "react-router";

const StudentDetailsPage = () => {
  const { id } = useParams();

  const data = useCustomQuery(`/account/admin/students/${id}/`, [
    "student-details",
    id,
  ]);

  const selectedStudent = data?.data?.data;

  const getCourseTypeIcon = (type: string) => {
    switch (type) {
      case "exam":
        return BookOpen;
      case "ministry":
        return FileText;
      case "course":
        return GraduationCap;
      case "cards":
        return CreditCard;
      default:
        return BookOpen;
    }
  };

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

  return (
    <div className="p-4 lg:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-auto">
        <>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedStudent?.name}
                  </h2>
                  <p className="text-gray-600">{selectedStudent?.grade}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Info */}

              {/* Courses and Activity */}
              <div className="lg:col-span-2">
                {/* Enrolled Courses */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    الدورات المسجلة
                  </h3>
                  <div className="space-y-3">
                    {selectedStudent?.current_courses?.map((course: any) => {
                      const IconComponent = getCourseTypeIcon(
                        course.courseType
                      );
                      return (
                        <div
                          key={course.courseId}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start gap-4">
                            <IconComponent
                              size={24}
                              className="text-orange-500 mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-gray-800">
                                    {course.courseName}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    المعلم: {course.teacherName}
                                  </p>
                                </div>
                                <div className="text-left">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      course.status
                                    )}`}
                                  >
                                    {course.status === "active"
                                      ? "نشط"
                                      : course.status === "completed"
                                      ? "مكتمل"
                                      : course.status === "paused"
                                      ? "متوقف"
                                      : "منسحب"}
                                  </span>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {course.price} د.أ
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">التقدم</span>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-orange-500 h-2 rounded-full transition-all"
                                        style={{
                                          width: `${course.progress}%`,
                                        }}
                                      ></div>
                                    </div>
                                    <span className="font-medium">
                                      {course.progress}%
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-500">الدرجة</span>
                                  <p className="font-medium">
                                    {course.grade || "-"}%
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    الوقت المستغرق
                                  </span>
                                  <p className="font-medium">
                                    {course.timeSpent} ساعة
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-500">
                                    آخر وصول
                                  </span>
                                  <p className="font-medium">
                                    {course.lastAccessed}
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

                {/* Achievements */}
                {selectedStudent?.achievements?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-800 mb-4">الإنجازات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedStudent?.achievements.map((achievement: any) => (
                        <div
                          key={achievement.id}
                          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                        >
                          <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-yellow-600" />
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {achievement.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {achievement.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {achievement.earnedDate}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment History */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    سجل المدفوعات
                  </h3>
                  <div className="space-y-2">
                    {selectedStudent?.paymentHistory?.map((payment: any) => (
                      <div
                        key={payment.id}
                        className="bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              {payment.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {payment.date}
                            </p>
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-green-600">
                              {payment.amount} د.أ
                            </p>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status === "completed"
                                ? "مكتمل"
                                : payment.status === "pending"
                                ? "معلق"
                                : "فاشل"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Log */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4">سجل النشاط</h3>
                  <div className="space-y-2">
                    {selectedStudent?.activityLog
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
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default StudentDetailsPage;
