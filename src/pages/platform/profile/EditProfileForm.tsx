import { useState, useEffect } from "react";
import { useCustomUpdate } from "@/hooks/useMutation";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { User } from "lucide-react";

interface Props {
  userProfileData: any;
}

type FormState = {
  name: string;
  email: string;
  school_name: string;
  gender: "male" | "female" | "";
};

function EditProfileForm({ userProfileData }: Props) {
  const { mutateAsync: updateProfile, isPending } = useCustomUpdate(
    "account/students/profile/update/",
    ["user-profile"],
  );

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    school_name: "",
    gender: "",
  });

  // hydrate form when data arrives
  useEffect(() => {
    if (!userProfileData) return;

    setForm({
      name: userProfileData?.name || "",
      email: userProfileData?.email || "",
      school_name: userProfileData?.school_name || "",
      gender: userProfileData?.gender || "",
    });
  }, [userProfileData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!form.name.trim()) return "الاسم مطلوب";
    return null;
  };

  const hasValuesChanged = () => {
    return (
      form.name !== userProfileData?.name ||
      form.email !== userProfileData?.email ||
      form.school_name !== userProfileData?.school_name ||
      form.gender !== userProfileData?.gender
    );
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const body = {
      name: form.name,
      email: form.email,
      school_name: form.school_name,
      gender: form.gender,
    };

    try {
      const res = await updateProfile(body);

      if (res?.status) {
        toast.success("تم تحديث البيانات بنجاح");
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };

  return (
    <form onSubmit={handleEdit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
            <User size={20} className="text-(--brand)" />
            <span>الملف الشخصي</span>
          </h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            هنا يمكنك تعديل بياناتك الشخصية في أي وقت، حتى تبقى معلوماتك محدثة
            وتعكس هويتك الدراسية بشكل صحيح.
          </p>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Name */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900">
                الاسم الكامل
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900">
                البريد الإلكتروني
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
              />
            </div>

            {/* School */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900">
                اسم المدرسة
              </label>
              <input
                name="school_name"
                value={form.school_name}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
              />
            </div>

            {/* Gender */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-900">
                الجنس
              </label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
              >
                <option value="M">ذكر</option>
                <option value="F">أنثى</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() =>
            setForm({
              name: userProfileData?.name || "",
              email: userProfileData?.email || "",
              school_name: userProfileData?.school_name || "",
              gender: userProfileData?.gender || "",
            })
          }
          className="cursor-pointer px-5 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
        >
          إلغاء التغييرات
        </button>

        <button
          type="submit"
          disabled={isPending || !hasValuesChanged()}
          className="cursor-pointer px-5 py-2 rounded-lg text-white font-medium shadow-sm hover:shadow-md bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? <FaSpinner className="animate-spin" /> : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}

export default EditProfileForm;
