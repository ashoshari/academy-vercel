/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useCustomUpdate } from "@/hooks/useMutation";
import Spinner from "@/components/dashboard/Spinner";

interface FormValues {
  name: string;
  email: string;
  mobile_number: string;
  about_me: string;
  image: File | string | null;
  is_active?: boolean;
}

export default function EditLibraryPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm<FormValues>({ defaultValues: { image: null, is_active: false } });

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
    ["library", id]
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

      if (res?.status) {
        toast.success("تم تحديث المكتبة بنجاح");
        navigate("/dashboard/libraries");
      } else {
        toast.error("فشل في تحديث بيانات المكتبة");
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.message || "حدث خطأ أثناء التحديث"
      );
    }
  };
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
            البريد الإلكتروني
          </label>
          <input
            type="email"
            {...register("email", { required: false })}
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
            className={`w-full px-4 py-4 border rounded-lg focus:ring-2 focus:ring-orange-500  ${
              errors.mobile_number ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="07XXXXXXXX"
          />

          {errors.mobile_number && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.mobile_number.message}
            </span>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            نظرة عامة *
          </label>
          <input
            type="text"
            {...register("about_me", { required: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          {errors.about_me && (
            <span className="text-sm text-red-500">النظرة العامة مطلوبة</span>
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
                setValue("is_active", !isActive, { shouldDirty: true })
              }
              className={`p-1 rounded-full transition-colors ${
                isActive ? "text-green-600" : "text-gray-400"
              }`}
            >
              {isActive ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
            </button>
          </div>
        </div>

        {/* الصورة و المعاينة */}
        <div className="flex w-full justify-start items-center gap-4">
          <div className="h-[68px] flex items-center justify-center">
            <label
              htmlFor="lib-img-edit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 cursor-pointer"
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
                setValue("image", file, { shouldDirty: true });
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
            className="px-6 py-3 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save size={16} />
            حفظ التعديلات
          </button>
        </div>
      </form>
    </div>
  );
}
