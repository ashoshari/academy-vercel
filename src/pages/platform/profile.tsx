import {
  User,
  Calendar,
  ArrowRight,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
// import { useCustomUpdate } from "@/hooks/platform/usePlatformMutation";

// interface FormData {
//   name?: string;
//   email?: string;
//   image?: File;
//   grade?: string;
//   gender?: string;
//   school_name?: string;
//   date_of_birth?: string;
// }

const Profile = () => {
  const navigate = useNavigate();
  // GET User Profile
  const { data: userProfile } = useCustomQuery("/account/students/profile/", [
    "user-profile",
  ]);
  const userProfileData = userProfile?.data;
  const formValues = [
    {
      label: "الاسم الكامل",
      type: "name",
      value: userProfileData?.name || "-",
      icon: User,
    },
    {
      label: "رقم الهاتف",
      type: "phone_number",
      value: userProfileData?.mobile_number || "-",
      icon: Phone,
    },
  ];
  return (
    // <div className="w-full">
    //   {/* Header */}
    //   <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    //       <div className="flex items-center mb-6">
    //         <button
    //           onClick={() =>
    //             window.history.length > 1 ? navigate(-1) : navigate("/")
    //           }
    //           className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 group"
    //         >
    //           <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
    //         </button>
    //       </div>
    //       <div className="flex flex-col md:flex-row items-center justify-between">
    //         <div className="text-white mb-6 md:mb-0">
    //           <h1 className="text-4xl font-bold mb-2">الملف الشخصي</h1>
    //           <p className="text-blue-100 text-lg">
    //             معلوماتك الشخصية والمهنية والتعليمية
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Profile Info Section */}
    //   <div className="max-w-3xl mx-auto my-10">
    //     <div className="bg-white rounded-2xl shadow-lg p-8">
    //       {/* Profile Details */}
    //       <div className="space-y-4">
    //         {formValues.map((item, index) => (
    //           <div
    //             key={index}
    //             className="flex items-center gap-3 border-b pb-3"
    //           >
    //             <item.icon className="text-gray-500" size={20} />
    //             <div className="w-full space-y-1">
    //               <p className="text-sm text-gray-500">{item.label}</p>
    //               <p className="font-semibold">{item.value}</p>
    //             </div>
    //           </div>
    //         ))}

    //         {/* Create Date */}
    //         <div className="flex items-center gap-3">
    //           <Calendar className="text-gray-500" size={20} />
    //           <div className="w-full space-y-1">
    //             <p className="text-sm text-gray-500">تاريخ الانضمام</p>
    //             <p className={`font-semibold `}>01 يناير 2024</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() =>
                window.history.length > 1 ? navigate(-1) : navigate("/")
              }
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
        <div className="bg-white rounded-2xl shadow-xl p-7 w-2/3 border border-gray-100">
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
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-sm">
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Create Date */}
            <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-md transition">
              <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg shadow-sm">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-gray-500">تاريخ الانضمام</p>
                <p className="font-semibold text-gray-800">01 يناير 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
