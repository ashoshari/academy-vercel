import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import toast from "react-hot-toast";

const Login = ({
  showPassword,
  setShowPassword,
  onLogin,
  onClose,
  navigate,
  setTokens,
  register,
  handleSubmit,
  reset,
  setForgetPassword,
  formState: { errors, isSubmitting },
}: any) => {
  // POST Login
  const { mutateAsync: loginMutateAsync } = useCustomPost("/account/login/", [
    "login",
  ]);
  // POST Generate IMEI
  const { mutateAsync: generateIMEI } = useCustomPost("/account/imei-string/", [
    "generateIMEI",
  ]);
  const onsubmit = async (data: any) => {
    let imei: string | null = window.localStorage.getItem("IMEI");
    try {
      if (!imei) {
        const IMEIResponse = await generateIMEI({});
        imei = IMEIResponse?.data ?? null;
        if (imei) {
          window.localStorage.setItem("IMEI", imei);
        }
      }
      const loginData = {
        mobile_number: data.mobile_number,
        password: data.password,
        imei,
      };
      const res = await loginMutateAsync(loginData);
      if (res?.status) {
        setTokens(res.data.tokens.access, res.data?.user);
        toast.success("تم تسجيل الدخول بنجاح");
        onLogin();
        onClose();
        navigate("/");
        reset();
      } else {
        toast.error(res.error || "فشل تسجيل الدخول");
      }
    } catch (error: any) {
      const errorData = error.response?.data?.error;

      if (errorData?.mobile_number?.[0]) {
        toast.error(errorData.mobile_number[0]);
      } else if (errorData?.password?.[0]) {
        toast.error(errorData.password[0]);
      } else if (typeof errorData === "string") {
        toast.error(errorData);
      } else {
        toast.error("فشل إنشاء الحساب");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Mobile Number */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            📱 رقم الهاتف
          </label>
          <div className="relative">
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
              placeholder="07XXXXXXXX"
            />
            {errors.mobile_number && (
              <span className="text-sm text-red-500">
                {errors.mobile_number.message}
              </span>
            )}
          </div>
        </div>
        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            🔒 كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 6,
                  message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                },
              })}
              minLength={6}
              className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-(--brand)"
              placeholder="أدخل كلمة المرور"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              className="absolute cursor-pointer top-[40%] left-4"
            >
              {showPassword ? (
                <EyeOff className="text-gray-500" size={14} />
              ) : (
                <Eye className="text-gray-500" size={14} />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
          {/* <button
            type="button"
            onClick={() => {
              reset();
              setForgetPassword(true);
            }}
            className="cursor-pointer text-(--brand) hover:text-(--brand-light) text-sm font-semibold transition-all duration-300 block w-full text-end mt-1"
          >
            هل نسيت كلمة المرور
          </button> */}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer w-full text-white py-3 px-6 rounded-xl font-bold text-lg bg-[linear-gradient(to_right,var(--brand),var(--brand-light),var(--brand))] bg-size-[200%_100%] bg-left hover:bg-right focus:ring-4 focus:ring-(--brand) transition-all duration-700 flex items-center justify-center space-x-3 disabled:opacity-70"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري المعالجة...</span>
          </div>
        ) : (
          <span>🚀 تسجيل الدخول</span>
        )}
      </button>
    </form>
  );
};

export default Login;
