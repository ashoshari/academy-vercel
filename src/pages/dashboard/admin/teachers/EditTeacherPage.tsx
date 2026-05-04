import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, ArrowRight } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useCustomUpdate } from "@/hooks/useMutation";
import FormPageSkeleton from "@/components/dashboard/skeletons/FormPageSkeleton";
import MultiSelectAutocomplete from "@/components/dashboard/admin/subsections/MultiSelector";

interface FormValues {
  name: string;
  email: string;
  mobile_number: string;
  materials: string[];
  location?: string;
  is_active?: boolean;
}

export default function EditTeacherPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    trigger,
  } = useForm<FormValues>();

  const { data: teacherData, isLoading } = useCustomQuery(
    `/account/admin/teachers/${id}/`,
    ["teacher", id],
  );
  const { data: dataMaterials } = useCustomQuery("core/materials/", [
    "materials",
  ]);

  const updateTeacher = useCustomUpdate(`account/admin/teachers/${id}/`, [
    "teachers",
    "teachers-statistics",
    "teacher",
  ]);

  useEffect(() => {
    if (teacherData?.data) {
      const t = teacherData.data;
      setValue("name", t.name);
      setValue("email", t.email);
      setValue("mobile_number", t.mobile_number);

      // Ensure material is always an array of IDs
      const materials = Array.isArray(t.materials)
        ? t.materials.map((m: any) => m.id)
        : t.materials
          ? [t.materials.id]
          : [];
      setValue("materials", materials);

      setValue("is_active", t.is_active);
    }
  }, [teacherData, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await updateTeacher.mutateAsync(data);

      if (res?.status) {
        toast.success("تم تحديث المعلم بنجاح");
        navigate("/dashboard/teachers");
      } else {
        toast.error("فشل في تحديث بيانات المعلم");
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "حدث خطأ أثناء التحديث",
      );
    }
  };
  if (isLoading) {
    return <FormPageSkeleton inputs={4} includeWideInput={false} />;
  }
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
          تعديل بيانات المعلم
        </h2>
      </div>

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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
          />
          {errors.name && (
            <span className="text-sm text-red-500">الاسم مطلوب</span>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            {...register("email", { required: false })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
            placeholder="example@domain.com"
          />
          {errors.email && (
            <span className="text-sm text-red-500">
              البريد الإلكتروني مطلوب
            </span>
          )}
        </div>

        {/* الهاتف */}
        <div className="">
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
            className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-(--brand) 
    ${errors.mobile_number ? "border-red-500" : "border-gray-200"}`}
            placeholder="07XXXXXXXX"
          />
          {errors.mobile_number && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.mobile_number.message}
            </span>
          )}
        </div>

        {/* التخصص */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            التخصص *
          </label>
          <div className="space-y-3">
            <Controller
              name="materials" // same name as old select
              control={control}
              defaultValue={[]}
              rules={{
                validate: (value) =>
                  value && value.length > 0 ? true : "اختر التخصص",
              }}
              render={({ field }) => (
                <MultiSelectAutocomplete
                  {...field}
                  big={true}
                  value={field.value || []}
                  onChange={(ids) => {
                    field.onChange(ids);
                    // Manually trigger validation after state update
                    setTimeout(() => trigger("materials"), 0);
                  }} // updates RHF state
                  options={
                    dataMaterials?.data?.map((mat: any) => ({
                      id: mat?.id,
                      title: mat?.name,
                    })) || []
                  }
                  placeholder="اختر التخصصات..."
                />
              )}
            />
          </div>
          {errors.materials && (
            <span className="text-sm text-red-500">
              {errors.materials.message}
            </span>
          )}
        </div>

        {/* زر الحفظ */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-brand-slide px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
