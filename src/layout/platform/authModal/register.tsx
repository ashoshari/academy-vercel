import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import toast from "react-hot-toast";

const Register = ({
  showPassword,
  setShowPassword,
  onLogin,
  onClose,
  navigate,
  setTokens,
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
  Controller,
  control,
  setShowOTP,
  showOTP,
}: any) => {
  // POST Register
  const { mutateAsync: RegisterMutateAsync } = useCustomPost(
    "/account/register/",
    ["register"]
  );
  // POST Generate IMEI
  const { mutateAsync: generateIMEI } = useCustomPost("/account/imei-string/", [
    "generateIMEI",
  ]);
  // POST Verify OTP
  const { mutateAsync: verifyOTP } = useCustomPost("/account/verify-otp/", [
    "verifyOTP",
  ]);
  const onsubmit = async (data: any) => {
    let imei: string | null = window.localStorage.getItem("IMEI");
    console.log("data",data)
    try {
      if (showOTP) {
        const otpData = {
            mobile_number: data.mobile_number,
            otp: data.registerOTP.join(""),
        }
        const res = await verifyOTP(otpData);
        if (res?.status) {
          setTokens(res?.data.tokens.access, res.data?.user);
          toast.success(
            res?.data?.message ||
              res?.message ||
              res?.data ||
              "تم إنشاء الحساب بنجاح"
          );
          onLogin();
          onClose();
          navigate("/");
          reset();
        } else {
          toast.error(res?.error || "فشل إنشاء الحساب");
        }
      } else {
        if (!imei) {
          const IMEIResponse = await generateIMEI({});
          imei = IMEIResponse?.data ?? null;
          if (imei) {
            window.localStorage.setItem("IMEI", imei);
          }
        }
        const registerData = {
          name: data.name,
          mobile_number: data.mobile_number,
          password: data.password,
          imei,
        };
        const res = await RegisterMutateAsync(registerData);
        if (res?.status) {
          setShowOTP(true);
        }
      }
    } catch (error: any) {
      const errorData = error.response?.data?.error;

      if (errorData?.mobile_number?.[0]) {
        toast.error(errorData.mobile_number[0]);
      } else if (errorData?.full_name?.[0] || errorData?.name?.[0]) {
        toast.error(errorData.full_name[0] || errorData?.name?.[0]);
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
      {showOTP ? (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 text-center">
            أدخل رمز التحقق المكون من 4 أرقام
          </label>
          <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3].map((index) => (
              <Controller
                key={index}
                name={`registerOTP.${index}`} // register each index in array
                control={control}
                rules={{ required: "الرمز مطلوب" }}
                render={({ field }: any) => (
                  <input
                    {...field}
                    value={field.value || ""}
                    type="text"
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                    onChange={(e) => {
                      const val = e.target.value.slice(-1); // keep only last digit
                      field.onChange(val);

                      // Auto-focus next input
                      if (val && index < 3) {
                        const nextInput = e.target.parentElement?.children[
                          index + 1
                        ] as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                  />
                )}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              👤 الاسم الكامل
            </label>
            <input
              {...register("name", {
                required: "الاسم الكامل مطلوب",
              })}
              type="text"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 text-right"
              placeholder="أدخل اسمك الكامل"
            />
            {errors.name && (
              <span className="text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>
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
                    ""
                  );
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
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
                className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
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
          </div>
        </>
      )}

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
        ) : (
          <span>✨ إنشاء الحساب</span>
        )}
      </button>
    </form>
  );
};
export default Register;
