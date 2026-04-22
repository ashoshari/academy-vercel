import { User, ArrowRight, Phone, Mail, School, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import EditProfileForm from "./profile/EditProfileForm";

const Profile = () => {
  const navigate = useNavigate();
  // GET User Profile
  const { data: userProfile } = useCustomQuery("/account/students/profile/", [
    "user-profile",
  ]);
  const userProfileData = userProfile?.data;
  const gender = userProfileData?.gender === "M" ? "ذكر" : "أنثى";
  const formValues = [
    {
      label: "الاسم الكامل",
      value: userProfileData?.name || "-",
      icon: User,
    },
    {
      label: "رقم الهاتف",
      value: userProfileData?.mobile_number || "-",
      icon: Phone,
    },
    {
      label: "البريد الإلكتروني",
      value: userProfileData?.email || "-",
      icon: Mail,
    },
    {
      label: "اسم المدرسة",
      value: userProfileData?.school_name || "-",
      icon: School,
    },
    {
      label: "الجنس",
      value: gender || "-",
      icon: Users,
    },
  ];
  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 group"
            >
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">الملف الشخصي</h1>
              <p className="text-blue-100 text-lg">
                معلوماتك الشخصية والمهنية والتعليمية
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="flex justify-center w-full my-10">
        <div className="bg-white rounded-2xl shadow-xl p-7 w-3/4 md:w-2/3 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">
            التفاصيل الشخصية
          </h2>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formValues.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white rounded-lg shadow-sm shrink-0">
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800 break-all">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Create Date */}
            {/* <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-md transition">
              <div className="w-10 h-10 flex items-center justify-center bg-linear-to-r from-(--brand) to-(--brand-light) text-white rounded-lg shadow-sm">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500">تاريخ الانضمام</p>
                <p className="font-semibold text-gray-800">01 يناير 2024</p>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mb-10">
        <div className="bg-white rounded-2xl shadow-xl p-7 w-3/4 md:w-2/3 border border-gray-100">
          <EditProfileForm userProfileData={userProfileData} />
        </div>
      </div>
    </div>
  );
};
export default Profile;
