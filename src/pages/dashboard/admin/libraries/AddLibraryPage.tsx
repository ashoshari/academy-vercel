/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { RefreshCw, Save, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useCustomPost } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useNavigate } from "react-router";

interface FormValues {
  name: string;
  email: string;
  password: string;
  mobile_number: string;
  about_me: string;
  image: File | null;
  is_active: boolean;
}

export default function AddLibraryPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile_number: "",
      about_me: "",
      image: null,
      is_active: false,
    },
  });

  // ensure RHF tracks the image field
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
    setPreview(null);
  }, [imageVal]);

  const clearImage = (inputId: string) => {
    setValue("image", null, { shouldDirty: true, shouldValidate: true });
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    if (el) el.value = "";
  };

  const addLibrary = useCustomPost("account/admin/libraries/", [
    "libraries",
    "libraries-statistics",
  ]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email ?? "");
      formData.append("mobile_number", data.mobile_number);
      formData.append("about_me", data.about_me);
      formData.append("is_active", String(!!data.is_active));
      if (data.image instanceof File) formData.append("image", data.image);

      const res = await addLibrary.mutateAsync(formData);
      if (res?.status) {
        toast.success("تم إضافة المكتبة بنجاح");
        reset();
        navigate("/dashboard/libraries");
      } else {
        handleErrorAlerts(res?.error || "فشل في إضافة المكتبة");
      }
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.message || "حدث خطأ أثناء إضافة المكتبة"
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
    <div
      className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-8"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        إضافة مكتبة جديد
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
            placeholder="أدخل الاسم الكامل"
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
            {...register("email", {
              required: "البريد الإلكتروني مطلوب",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "من فضلك ادخل بريد إلكتروني صحيح",
              },
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
              errors.mobile_number ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="example@domain.com"
          />
          {errors.email && (
            <span className="text-sm text-red-500 mt-1 block">
              {errors.email.message}
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
            {...register("mobile_number", {
              required: "رقم الهاتف مطلوب",
              pattern: {
                value: /^07[0-9]{8}$/,
                message: "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام",
              },
              maxLength: 10,
              minLength: 10,
            })}
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(
                /[^0-9]/g,
                ""
              );
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
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

        {/* نظرة عامة */}
        <div>
          <label className="block mb-2 font-medium text-sm text-gray-700">
            نظرة عامة *
          </label>
          <input
            type="text"
            {...register("about_me", { required: true })}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="نبذة مختصرة عن المكتبة"
          />
          {errors.about_me && (
            <span className="text-sm text-red-500">النظرة العامة مطلوبة</span>
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

        {/* صورة + معاينة */}
        <div className="lg:col-span-2 flex w-full items-center gap-4">
          <div className="h-[68px] flex items-center">
            <label
              htmlFor="library-img-add"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all cursor-pointer"
            >
              إضافة صورة
            </label>
            <input
              id="library-img-add"
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setValue("image", file, { shouldDirty: true });
                // allow re-choosing the same file
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
                onClick={() => clearImage("library-img-add")}
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
            إضافة المكتبة
          </button>
        </div>
      </form>
    </div>
  );
}
