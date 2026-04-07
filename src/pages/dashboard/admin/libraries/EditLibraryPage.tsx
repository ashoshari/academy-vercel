import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useCustomUpdate } from "@/hooks/useMutation";
import Spinner from "@/components/dashboard/Spinner";
import { applyServerErrors } from "@/utils/errors";

interface FormValues {
  name: string;
  email: string;
  password?: string;
  mobile_number: string;
  about_me: string;
  image: File | string | null;
  is_active?: boolean;
}

export type FieldName = keyof FormValues;
export type ServerErr = Record<string, string | string[]>;

export default function EditLibraryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    setFocus,
    control,
  } = useForm<FormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { image: null, is_active: false },
  });

  useEffect(() => {
    register("image");
    register("is_active");
  }, [register]);

  const imageVal = useWatch({ control, name: "image" });
  const isActive = useWatch({ control, name: "is_active" }) ?? false;

  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!imageVal) return setPreview(null);
    if (imageVal instanceof File) {
      const url = URL.createObjectURL(imageVal);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(imageVal as string);
  }, [imageVal]);

  const clearImage = (inputId: string) => {
    setValue("image", null, { shouldDirty: true, shouldValidate: true });
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    if (el) el.value = "";
  };

  const { data: libraryData, isLoading } = useCustomQuery(
    `/account/admin/libraries/${id}/`,
    ["library", id],
  );

  const updateLibrary = useCustomUpdate(`account/admin/libraries/${id}/`, [
    "libraries",
    "libraries-statistics",
    "library",
  ]);

  useEffect(() => {
    if (libraryData?.data) {
      const t = libraryData.data;
      setValue("name", t.name);
      setValue("email", t.email);
      setValue("mobile_number", t.mobile_number);
      setValue("image", t.image ?? null);
      setValue("about_me", t.about_me);
      setValue("is_active", !!t.is_active);
    }
  }, [libraryData, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("mobile_number", data.mobile_number);
      formData.append("about_me", data.about_me);
      formData.append("is_active", String(!!data.is_active));
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      const res = await updateLibrary.mutateAsync(formData);

      if (res?.status === false) {
        applyServerErrors(res?.error as ServerErr, setError, setFocus);
        handleErrorAlerts("فشل في تعديل المكتبة");
        return;
      }
      toast.success("تم تحديث المكتبة بنجاح");
      navigate("/dashboard/libraries");
    } catch (error: any) {
      const payload = error?.response?.data;
      applyServerErrors(payload?.error as ServerErr, setError, setFocus);
      handleErrorAlerts(payload?.message || "حدث خطأ أثناء إضافة المكتبة");
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
      hasError ? "border-red-500 focus:border-red-500" : "border-gray-200"
    }`;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size={40} thickness={4} className="text-orange-500" />
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        تعديل بيانات المكتبة
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* الاسم */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            الاسم الكامل *
          </label>
          <input
            type="text"
            {...register("name", { required: "الاسم مطلوب" })}
            className={inputClass(!!errors.name)}
            placeholder="أدخل الاسم الكامل"
          />
          {errors.name && (
            <span className="text-sm text-red-500">
              {String(errors.name.message ?? "الاسم مطلوب")}
            </span>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            البريد الإلكتروني
          </label>
          <input
            type="email"
            {...register("email", {
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "من فضلك ادخل بريد إلكتروني صحيح",
              },
            })}
            className={inputClass(!!errors.email)}
            placeholder="example@domain.com"
          />
          {errors.email && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.email.message as string}
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
            className={inputClass(!!errors.mobile_number)}
            placeholder="07XXXXXXXX"
          />
          {errors.mobile_number && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.mobile_number.message as string}
            </span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            نظرة عامة
          </label>
          <input
            type="text"
            {...register("about_me")}
            className={inputClass(!!errors.name)}
            placeholder="نبذة مختصرة عن المكتبة"
          />
          {errors.about_me && (
            <span className="text-sm text-red-500">
              {errors.about_me.message as string}
            </span>
          )}
        </div>

        {/* مؤكد */}
        <div className="col-span-2">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg w-fit gap-10 min-w-xs">
            <div>
              <p className="font-medium text-gray-800">
                {isActive ? "مفعل" : "معطل"}
              </p>
              <p className="text-sm text-gray-500">
                {isActive ? "نشط" : "غير نشط"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setValue("is_active", !isActive, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              className={`cursor-pointer p-1 rounded-full transition-colors ${
                isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>
        </div>

        {/* الصورة و المعاينة */}
        <div className="flex w-full justify-start items-center gap-4">
          <div className="h-17 flex items-center justify-center">
            <label
              htmlFor="lib-img-edit"
              className="bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2.5 text-sm rounded-lg hover:from-(--brand-light) hover:to-(--brand) cursor-pointer"
            >
              اضافة صورة
            </label>
            <input
              id="lib-img-edit"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setValue("image", file, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
                e.currentTarget.value = "";
              }}
            />
          </div>

          {preview && (
            <div className="rounded-lg overflow-hidden relative group hover:cursor-pointer">
              <img
                src={preview}
                alt="preview"
                className="w-40 h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => clearImage("lib-img-edit")}
                className="top-0 right-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity absolute duration-300 bg-black/40 cursor-pointer"
              >
                <Trash2 size={20} color="red" />
              </button>
            </div>
          )}
        </div>

        {/* زر الحفظ */}
        <div className="lg:col-span-2 flex justify-end h-fit self-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-(--brand) text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
