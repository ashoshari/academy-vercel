import { useState } from "react";
import {
  X,
  Check,
  Loader2,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import useTokenStore from "@/store/platform/useToken";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
// import { storeTokens } from "@/services/platform/userAuth";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

interface FormData {
  fullName: string;
  mobile: string;
  password: string;
  otp: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobile: "",
    password: "",
    otp: "",
  });
  // const { setTokens } = useToken();
  const { mutateAsync: loginMutateAsync } = useCustomPost("/account/login/", [
    "login",
  ]);
  const { mutateAsync: RegisterMutateAsync } = useCustomPost(
    "/account/register/",
    ["register"]
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<FormData>();
  const setTokens = useTokenStore((state) => state.setTokens);
  // eng: mahmoud code of auth
  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsLoading(true);

  //     const formdata = new FormData();
  //     formdata.append("mobile_number", formData.mobile);
  //     formdata.append("password", formData.password);

  //     mutateAsync(formdata)
  //       .then(async (res) => {
  //         if (res.status) {
  //           await storeTokens(
  //             res.data.tokens.access,
  //             onNavigate,
  //             setIsAuthenticated
  //           );

  //           localStorage.setItem("user", JSON.stringify(res?.data?.user));
  //         } else {
  //           setError(res.error);
  //         }
  //       })
  //       .catch((error) => {
  //         handleErrorAlerts(error?.response?.data?.error);
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   };

  //       mutateAsync(loginData, );
  // // setTokens(response.tokens.access, response.tokens.refresh);
  // };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     setIsLoading(true);

  //     const formdata = new FormData();
  //     formdata.append("mobile_number", formData.mobile);
  //     formdata.append("password", formData.password);
  //     // Simulate API call
  //     setTimeout(() => {
  //       if (!isLogin && !showOTP) {
  //         setShowOTP(true);
  //       } else {
  //         // Handle login or OTP verification
  //         onLogin();
  //         onClose();
  //       }
  //       setIsLoading(false);
  //     }, 1500);
  //     mutateAsync(formdata)
  //       .then(async (res) => {
  //         if (res.status) {
  //           await setTokens(
  //             res.data.tokens.access,
  //             res.data.tokens.refresh
  //           );

  //           // localStorage.setItem("user", JSON.stringify(res?.data?.user));
  //         }
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   };
  const onSubmit = async (data: FormData) => {
    // e.preventDefault();
    setIsLoading(true);

    const formdata = new FormData();
    formdata.append("mobile_number", formData.mobile);
    formdata.append("password", formData.password);

    if (!isLogin) {
      formdata.append("name", formData.fullName);
    }

    try {
      const res = isLogin
        ? await loginMutateAsync(data)
        : await RegisterMutateAsync(data);
      if (res?.status) {
        setTokens(`"${res.data.tokens.access}"`, res.data?.user);
        setFormData({ mobile: "", password: "", fullName: "", otp: "" });
        toast.success(
          isLogin ? "تم تسجيل الدخول بنجاح" : "تم إنشاء الحساب بنجاح"
        );

        onLogin();
        onClose();
        // if (!isLogin && !showOTP) {
        //   setShowOTP(true);
        // } else {
        // }
      } else {
        // Handle API returning success: false
        toast.error(
          res.error || (isLogin ? "فشل تسجيل الدخول" : "فشل إنشاء الحساب")
        );
      }
    } catch (error: any) {
      const errorData = error.response?.data?.error;

      if (errorData?.mobile_number?.[0]) {
        toast.error(errorData.mobile_number[0]);
      } else if (errorData?.full_name?.[0]) {
        toast.error(errorData.full_name[0]);
      } else if (errorData?.password?.[0]) {
        toast.error(errorData.password[0]);
      } else if (typeof errorData === "string") {
        toast.error(errorData);
      } else {
        toast.error(isLogin ? "فشل تسجيل الدخول" : "فشل إنشاء الحساب");
      }
      // Handle network or other errors
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     if (!isLogin && !showOTP) {
  //       setShowOTP(true);
  //     } else {
  //       // Handle login or OTP verification
  //       onLogin();
  //       onClose();
  //     }
  //     setIsLoading(false);
  //   }, 1500);
  // };

  const resetForm = () => {

    setFormData({
      fullName: "",
      mobile: "",
      password: "",
      otp: "",
    });
    setShowOTP(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 left-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {showOTP
                ? "📱 تأكيد رقم الهاتف"
                : isLogin
                ? "🔐 تسجيل الدخول"
                : "🚀 إنشاء حساب جديد"}
            </h2>
            <p className="text-gray-600 text-sm">
              {showOTP
                ? `تم إرسال رمز التحقق إلى ${formData.mobile} 📲`
                : isLogin
                ? "أدخل بياناتك للوصول إلى دوراتك المفضلة 📚"
                : "ابدأ رحلتك نحو التفوق في التوجيهي 🌟"}
            </p>
          </div>

          {/* Back Button for OTP */}
          {showOTP && (
            <button
              onClick={() => setShowOTP(false)}
              className="flex items-center cursor-pointer text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 hover:translate-x-1 group"
            >
              <ArrowRight className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              <span className="font-medium">العودة</span>
            </button>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* OTP Input */}
            {showOTP && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 text-center">
                  أدخل رمز التحقق المكون من 4 أرقام
                </label>
                <div className="flex gap-3 justify-center">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      {...register("otp", { required: "الرمز مطلوب" })}
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      onChange={(e) => {
                        const value = formData.otp;
                        const newValue =
                          value.substring(0, index) +
                          e.target.value +
                          value.substring(index + 1);
                        handleInputChange("otp", newValue);

                        // Auto-focus next input
                        if (e.target.value && index < 3) {
                          const nextInput = e.target.parentElement?.children[
                            index + 1
                          ] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Form Fields */}
            {!showOTP && (
              <div className="space-y-4">
                {/* Full Name (Register only) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      👤 الاسم الكامل
                    </label>
                    <input
                      {...register("fullName", {
                        required: "الاسم الكامل مطلوب",
                      })}
                      type="text"
                      // value={formData.fullName}
                      // onChange={(e) =>
                      //   handleInputChange("fullName", e.target.value)
                      // }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 text-right"
                      placeholder="أدخل اسمك الكامل"
                      
                    />
                    {errors.fullName && (
                      <span className="text-sm text-red-500">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>
                )}

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    📱 رقم الهاتف
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      {...register("mobile", {
                        required: "رقم الهاتف مطلوب",
                        pattern: {
                          value: /^07[0-9]{8}$/,
                          message:
                            "رقم الهاتف يجب أن يبدأ بـ 07 ويتكون من 10 أرقام",
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                      placeholder="07XXXXXXXX"
                    />
                    {errors.mobile && (
                      <span className="text-sm text-red-500">
                        {errors.mobile.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    🔒 كلمة المرور
                  </label>
                  <input
                    type="text"
                    {...register("password", {
                      required: "كلمة المرور مطلوبة",
                      minLength: {
                        value: 6,
                        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                      },
                    })}
                    minLength={6}
                    className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="أدخل كلمة المرور"
                  />
                  {errors.password && (
                    <span className="text-sm text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري المعالجة...</span>
                </div>
              ) : showOTP ? (
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>✅ تأكيد الرمز</span>
                </div>
              ) : (
                <span>{isLogin ? "🚀 تسجيل الدخول" : "✨ إنشاء الحساب"}</span>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          {!showOTP && (
            <div className="mt-6 text-center">
              <button
                onClick={switchMode}
                className="cursor-pointer text-yellow-600 hover:text-yellow-700 text-sm font-semibold transition-all duration-300"
              >
                {isLogin
                  ? "🆕 لا تملك حساب؟ إنشاء حساب جديد"
                  : "👋 لديك حساب؟ تسجيل الدخول"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
