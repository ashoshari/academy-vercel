import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Save, RefreshCw, ArrowRight } from "lucide-react";
import { useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useCustomQuery } from "@/hooks/useQuery";
import Spinner from "@/components/dashboard/Spinner";
import { useQueryClient } from "@tanstack/react-query";

interface FormValues {
  name: string;
  mobile_number: string;
  password?: string;
  is_allow_to_use_web: boolean;
}

const EditStudentPage = () => {
  const { id } = useParams(); // جلب الـ id من الـ URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>();

  const studentData = useCustomQuery(`account/admin/students/${id}/`, [
    "student",
    id,
  ]);

  const updateStudent = useCustomUpdate(`account/admin/students/${id}/`, [
    "students",
  ]);

  useEffect(() => {
    if (studentData.data) {
      reset({
        name: studentData?.data?.data?.name,
        mobile_number: studentData?.data?.data?.mobile_number,
        password: "",
        is_allow_to_use_web: studentData?.data?.data?.is_allow_to_use_web,
      });
    }
  }, [studentData?.data, reset]);

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleGeneratePassword = () => {
    const generated = generatePassword();
    setValue("password", generated);
  };
  const onSubmit = async (data: FormValues) => {
    try {
      const payload = { ...data };
      if (!data.password || data.password.trim() === "") {
        delete payload.password;
      }
      const res = await updateStudent.mutateAsync(payload);
      if (res?.status) {
        toast.success("تم تعديل الطالب بنجاح");
        navigate("/dashboard/students");
        queryClient.invalidateQueries({ queryKey: ["student"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.error || "حدث خطأ أثناء تعديل الطالب",
      );
    }
  };
  if (studentData?.isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} thickness={4} className="text-orange-500" />
      </div>
    );
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <div className="flex items-center mb-6 gap-x-1.25">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          تعديل بيانات الطالب
        </h2>
      </div>
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
            {...register("mobile_number", {
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^07[0-9]{8}$/,
                message: "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام",
              },
            })}
            maxLength={10}
            minLength={10}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(
                /[^0-9]/g,
                "",
              );
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="07XXXXXXXX"
          />
          {errors.mobile_number && (
            <span className="text-sm text-red-500">
              {errors.mobile_number.message}
            </span>
          )}
        </div>

        {/* كلمة المرور */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            كلمة المرور ( اتركه فارغا اذا لم ترد تغييره )
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register("password")}
              className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="أدخل كلمة المرور الجديدة"
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="cursor-pointer px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              title="توليد كلمة مرور"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        <div className="md:col-span-2 flex items-center gap-4 justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">
              السماح بالمشاهدة على الويب
            </p>
            <p className="text-sm text-gray-500">
              يسمح الطالب بمشاهدة المحتوى على الويب
            </p>
          </div>
          <input
            type="checkbox"
            {...register("is_allow_to_use_web")}
            className="rounded border-gray-300 w-6 h-6 text-orange-600 focus:ring-orange-500"
          />
        </div>

        {/* زر الحفظ */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
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
