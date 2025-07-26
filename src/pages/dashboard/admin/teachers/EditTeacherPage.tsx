import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Save } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useCustomUpdate } from "@/hooks/useMutation";

interface FormValues {
  name: string;
  email: string;
  mobile_number: string;
  material: string;
  experience?: number;
  location?: string;
  is_active?: boolean;
}

export default function EditTeacherPage() {
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>();

  const { data: teacherData, isLoading } = useCustomQuery(
    `/account/admin/teachers/${id}/`,
    ["teacher", id]
  );
  const { data: dataMaterials } = useCustomQuery("core/materials/", [
    "materials",
  ]);

  const updateTeacher = useCustomUpdate(`account/admin/teachers/${id}/`, [
    "teachers",
    "teachers-statistics",
  ]);

  useEffect(() => {
    if (teacherData?.data) {
      const t = teacherData.data;
      console.log("t", t);
      setValue("name", t.name);
      setValue("email", t.email);
      setValue("mobile_number", t.mobile_number);
      setValue("material", t.material);
      setValue("experience", t.experience);
      setValue("location", t.location);
      setValue("is_active", t.is_active);
    }
  }, [teacherData, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await updateTeacher.mutateAsync(data);
      if (res?.status) {
        toast.success("تم تحديث المعلم بنجاح");
      } else {
        toast.error("فشل في تحديث بيانات المعلم");
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.message || "حدث خطأ أثناء التحديث"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        تعديل بيانات المعلم
      </h2>
      {isLoading ? (
        <p className="text-center text-gray-500">جارٍ تحميل البيانات...</p>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* نفس الحقول كما في إضافة المعلم */}
          {/* الاسم، البريد، الهاتف، التخصص، الخبرة، الموقع، is_active */}

          {/* الاسم */}
          <div>
            <label className="block mb-2 font-medium text-sm text-gray-700">
              الاسم الكامل *
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
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
              نشط؟
            </label>
          </div>

          {/* زر الحفظ */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              حفظ التعديلات
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
