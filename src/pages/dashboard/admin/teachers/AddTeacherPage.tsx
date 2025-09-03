import { useForm, Controller } from "react-hook-form";
import { RefreshCw, Save, ArrowRight } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useNavigate } from "react-router";
import MultiSelectAutocomplete from "@/components/dashboard/admin/subsections/MultiSelector";

interface FormValues {
  name: string;
  email: string;
  mobile_number: string;
  materials: string[];
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
    control,
    reset,
    trigger
  } = useForm<FormValues>();

  const { data: dataMaterials } = useCustomQuery("core/materials/", [
    "materials",
  ]);

  const addTeacher = useCustomPost("account/admin/teachers/", ["teachers"]);
  console.log("dataMaterials", dataMaterials?.data);
  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addTeacher.mutateAsync({
        ...data,
        material: data?.materials,
      });
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
      <div className="flex items-center mb-6 gap-x-[5px]">
        <button
          onClick={() => {
            navigate(-1);
          }}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">إضافة معلم جديد</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* الاسم */}
        <div className="">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            الاسم الكامل *
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="أدخل الاسم الكامل"
          />
          {errors.name && (
            <span className="text-sm text-red-500">الاسم مطلوب</span>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div className="">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            {...register("email", { required: false })}
            className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                ""
              );
            }}
            className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500 
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
        <div className="">
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

        {/* كلمة المرور */}
        <div className="col-span-2">
          <label className="block mb-2 font-medium text-sm text-gray-700">
            كلمة المرور
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              {...register("password", { required: true })}
              className="flex-1 px-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
              placeholder="أدخل كلمة المرور"
            />
            <button
              type="button"
              onClick={handleGeneratePassword}
              className="px-5 py-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              title="توليد كلمة مرور"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* مؤكد */}
        {/* <div className="flex items-center gap-2">
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
        </div> */}
        {/* <div className="col-span-2 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">منشور</p>
            <p className="text-sm text-gray-500">متاح للطلاب</p>
          </div>
          <input
            defaultChecked={true}
            type="checkbox"
            {...register("is_active")}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-[20px] h-[20px]"
          />
        </div> */}

        {/* زر الحفظ */}
        <div className="col-span-2 flex justify-end">
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
