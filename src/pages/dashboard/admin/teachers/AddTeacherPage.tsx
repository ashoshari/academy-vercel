import { useForm } from "react-hook-form";
import { RefreshCw, Save } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useNavigate } from "react-router";

interface FormValues {
  name: string;
  email: string;
  mobile_number: string;
  material: string;
  experience?: number;
  location?: string;
  is_active?: boolean;
  password: string;
}

export default function AddTeacherPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormValues>();

  const { data: dataMaterials } = useCustomQuery("core/materials/", [
    "materials",
  ]);
  const addTeacher = useCustomPost("account/admin/teachers/", ["teachers"]);

  const onSubmit = async (data: FormValues) => {
    console.log("data", data);
    try {
      const res = await addTeacher.mutateAsync(data);
      if (res?.status) {
        toast.success("تم إضافة المعلم بنجاح");
        reset();
        navigate("/dashboard/teachers");
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.error || "حدث خطأ أثناء إضافة المعلم"
      );
    }
  };
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

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">إضافة معلم جديد</h2>
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

        {/* البريد الإلكتروني */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            البريد الإلكتروني *
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="example@domain.com"
          />
          {errors.email && (
            <span className="text-sm text-red-500">
              البريد الإلكتروني مطلوب
            </span>
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

        {/* التخصص */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            التخصص *
          </label>
          <select
            {...register("material", { required: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">اختر التخصص</option>
            {dataMaterials?.data?.map((mat: any) => (
              <option key={mat.id} value={mat.id}>
                {mat.name}
              </option>
            ))}
          </select>
          {errors.material && (
            <span className="text-sm text-red-500">اختر التخصص</span>
          )}
        </div>

        {/* كلمة المرور */}
        <div className="md:col-span-2">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            كلمة المرور
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register("password", { required: true })}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="أدخل كلمة المرور"
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              title="توليد كلمة مرور"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* مؤكد */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            type="checkbox"
            {...register("is_active")}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="is_active"
          >
            تم التحقق من الهوية
          </label>
        </div>

        {/* زر الحفظ */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            إضافة المعلم
          </button>
        </div>
      </form>
    </div>
  );
}
