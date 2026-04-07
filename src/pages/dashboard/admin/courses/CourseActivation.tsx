import { useEffect, useState } from "react";
import { X, Search, Check, XCircle, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useCustomPost } from "@/hooks/useMutation";
import { useCustomQuery } from "@/hooks/useQuery";
import Spinner from "@/components/dashboard/Spinner";

interface Student {
  id: string;
  mobile_number: string;
  name: string;
  is_enrolled_in_course: boolean;
}
const CourseActivation = ({ setCurrentView, selectedCourse }: any) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [cardCode, setCardCode] = useState("");

  const queryParams = new URLSearchParams();
  queryParams.append("page_size", "5");
  if (searchTerm) queryParams.append("search", searchTerm);
  queryParams.append("course_id", selectedCourse?.id);

  // GET Students
  const { data, isLoading } = useCustomQuery(
    `/account/admin/students/?${queryParams.toString()}`,
    ["students", searchTerm, selectedCourse?.id],
    undefined,
    !!searchTerm.trim(),
  );
  const studentData = data?.data;
  useEffect(() => {
    if (studentData) {
      setStudents(studentData);
    }
  }, [studentData]);
  // POST Activate Course
  const { mutateAsync: activateCourse } = useCustomPost(
    `/training/admin/courses/enroll/student/`,
    ["activate-student"],
  );

  const handleActivate = async (id: string) => {
    try {
      if (!cardCode.trim() && !selectedCourse?.is_free) {
        toast.error("الرجاء إدخال كود البطاقة");
        return;
      }
      let activateData;
      if (selectedCourse?.is_free) {
        activateData = {
          student_id: id,
          course_id: selectedCourse?.id,
        };
      } else {
        activateData = {
          student_id: id,
          course_id: selectedCourse?.id,
          generated_code: cardCode,
        };
      }
      const response = await activateCourse(activateData);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_enrolled_in_course: true } : s,
        ),
      );
      toast.success(response?.data || "تم تفعيل الطالب بنجاح");
      setActivatingId(null);
      setCardCode("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "حدث خطأ في تفعيل الطالب");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 h-full">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">تفعيل الطلاب</h2>
            <p className="text-sm text-gray-500">
              اسم الدورة:{" "}
              <span className="font-medium">{selectedCourse?.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              رقم الدورة:{" "}
              <span className="font-medium">{selectedCourse?.id}</span>
            </p>
          </div>
          <button
            onClick={() => setCurrentView("courses")}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الطالب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-(--brand) text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto my-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spinner size={40} thickness={4} className="text-orange-500" />
            </div>
          ) : students?.length === 0 && searchTerm ? (
            <div className="col-span-full backdrop-blur-xl shadow-lg p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                لا يوجد طلاب مطابقون للبحث
              </h3>
            </div>
          ) : !searchTerm ? (
            <div className="col-span-full backdrop-blur-xl shadow-lg p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                برجاء البحث عن طلاب لاظهار النتائج{" "}
              </h3>
            </div>
          ) : (
            searchTerm && (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      رقم الجوال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {students?.map((student: any) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{student.name}</td>
                      <td className="px-6 py-4 text-sm">
                        {student.mobile_number}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            student.is_enrolled_in_course
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.is_enrolled_in_course ? "مسجل" : "غير مسجل"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {student.is_enrolled_in_course ? (
                          <span className="text-gray-400 text-sm whitespace-nowrap">
                            تم التسجيل مسبقاً
                          </span>
                        ) : activatingId === student.id &&
                          !selectedCourse?.is_free ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="كود البطاقة"
                              value={cardCode}
                              onChange={(e) => setCardCode(e.target.value)}
                              className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-orange-500"
                            />
                            <button
                              onClick={() => handleActivate(student.id)}
                              className="cursor-pointer p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setActivatingId(null);
                                setCardCode("");
                              }}
                              className="cursor-pointer p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setCardCode("");
                              if (selectedCourse?.is_free) {
                                handleActivate(student.id);
                              } else {
                                setActivatingId(student.id);
                              }
                            }}
                            className="cursor-pointer px-3 py-1 bg-linear-to-r from-(--brand) to-(--brand-light) text-white rounded-lg text-sm hover:from-(--brand-light) hover:to-(--brand)"
                          >
                            تفعيل
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseActivation;
