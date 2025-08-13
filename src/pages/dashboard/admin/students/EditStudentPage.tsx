import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { useCustomPost } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useCustomQuery } from "@/hooks/useQuery";

interface FormValues {
  name: string;
  mobile_number: string;
  password: string;
}

const EditStudentPage = () => {
  const { id } = useParams(); // جلب الـ id من الـ URL
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>();

  const studentData = useCustomQuery(`account/admin/students/${id}/`, [
    "student",
    id,
  ]);

  const updateStudent = useCustomPost(`account/admin/students/${id}/`, [
    "students",
  ]);

  useEffect(() => {
    if (studentData.data) {
      reset({
        name: studentData?.data?.data?.name,
        mobile_number: studentData?.data?.data?.mobile_number,
        password: "",
      });
    }
  }, [studentData.data, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await updateStudent.mutateAsync(data);
      if (res?.status) {
        toast.success("تم تعديل الطالب بنجاح");
        navigate("/dashboard/students");
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.error || "حدث خطأ أثناء تعديل الطالب"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        تعديل بيانات الطالب
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* الاسم */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            الاسم الكامل *
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="أدخل الاسم الكامل"
          />
          {errors.name && (
            <span className="text-sm text-red-500">الاسم مطلوب</span>
          )}
        </div>

        {/* الهاتف */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            رقم الهاتف *
          </label>
          <input
            type="tel"
            {...register("mobile_number", { required: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="07XXXXXXXX"
          />
          {errors.mobile_number && (
            <span className="text-sm text-red-500">رقم الهاتف مطلوب</span>
          )}
        </div>

        {/* كلمة المرور */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            كلمة المرور (اتركه فارغ لو مش هتغيره)
          </label>
          <input
            type="text"
            {...register("password")}
            className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="أدخل كلمة المرور الجديدة"
          />
        </div>

        {/* زر الحفظ */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            تعديل الطالب
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentPage;
