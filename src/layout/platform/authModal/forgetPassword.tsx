import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import toast from "react-hot-toast";

interface resetData {
  mobile_number?: string;
  new_password?: string;
  confirm_password?: string;
  resetOTP: string[];
}
const ForgetPassword = ({
  resetPassword,
  setResetPassword,
  setIsLogin,
  forgetPassword,
  setForgetPassword,
  showOTP,
  setShowOTP,
  formState: { errors, isSubmitting },
  register,
  handleSubmit,
  reset,
  control,
  watch,
  Controller,
}: any) => {
  const [showPassword, setShowPassword] = useState<string[]>([]);
  const [formData, setFormData] = useState<resetData>({
    mobile_number: "",
    new_password: "",
    confirm_password: "",
    resetOTP: [],
  });
  // POST Reset Password OTP
  const { mutateAsync: postForgetPasswordOtp } = useCustomPost(
    "/account/students/reset-password-otp/",
    ["forget-password-otp"],
  );
  // POST Reset Password OTP Check
  const { mutateAsync: postForgetPasswordOtpCheck } = useCustomPost(
    "account/students/reset-password-otp/check/",
    ["forget-password-otp-check"],
  );
  // POST Reset Password OTP Confirm
  const { mutateAsync: postResetPasswordConfirm } = useCustomPost(
    "/account/students/reset-password-confirm/",
    ["reset-password-confirm"],
  );
  const newPassword = watch("new_password");
  const onSubmit = async (data: resetData) => {
    try {
      if (resetPassword) {
        const res = await postResetPasswordConfirm({
          mobile_number: formData.mobile_number,
          new_password: data.new_password,
        });
        if (!res?.status) {
          toast.error(res?.data);
          return;
        } else {
          toast.success(res?.data || "تم تغيير كلمة السر");
          setResetPassword(false);
          setIsLogin(true);
          setForgetPassword(false);
          setShowOTP(false);
          reset();
        }
      } else if (forgetPassword && !showOTP) {
        const res = await postForgetPasswordOtp({
          mobile_number: data.mobile_number,
        });
        setFormData({ ...data, resetOTP: [] });
        if (res?.status) {
          setShowOTP(true);
          toast.success(res?.data);
        }
      } else if (showOTP) {
        const res = await postForgetPasswordOtpCheck({
          otp: data.resetOTP.join(""),
          mobile_number: data.mobile_number,
        });
        if (!res?.status) {
          toast.error(res?.data);
          return;
        } else {
          toast.success(res?.data || "رقم التحقق صحيح");
          setShowOTP(false);
          setResetPassword(true);
        }
      }
    } catch (error: any) {
      {
        toast.error(error?.response?.data?.error || "فشل التحقق");
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {resetPassword ? (
        <>
          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              🔒 كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={
                  showPassword.find((item: any) => item == "new_password")
                    ? "text"
                    : "password"
                }
                {...register("new_password", {
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
                  if (showPassword.includes("new_password")) {
                    setShowPassword((prev) =>
                      prev.filter((item) => item !== "new_password"),
                    );
                  } else {
                    setShowPassword((prev) => [...prev, "new_password"]);
                  }
                }}
                className="absolute cursor-pointer top-[40%] left-4"
              >
                {showPassword.includes("new_password") ? (
                  <EyeOff className="text-gray-500" size={14} />
                ) : (
                  <Eye className="text-gray-500" size={14} />
                )}
              </button>
            </div>
            {errors.new_password && (
              <span className="text-sm text-red-500">
                {errors.new_password.message}
              </span>
            )}
          </div>
          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              🔒 تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                type={
                  showPassword.includes("confirm_password")
                    ? "text"
                    : "password"
                }
                {...register("confirm_password", {
                  required: "كلمة المرور مطلوبة",
                  minLength: {
                    value: 6,
                    message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                  },
                  validate: (value: any) =>
                    value === newPassword || "كلمة المرور غير متطابقة",
                })}
                minLength={6}
                className="w-full flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="أدخل كلمة المرور"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (showPassword.includes("confirm_password")) {
                    setShowPassword((prev) =>
                      prev.filter((item) => item !== "confirm_password"),
                    );
                  } else {
                    setShowPassword((prev) => [...prev, "confirm_password"]);
                  }
                }}
                className="absolute cursor-pointer top-[40%] left-4"
              >
                {showPassword.includes("confirm_password") ? (
                  <EyeOff className="text-gray-500" size={14} />
                ) : (
                  <Eye className="text-gray-500" size={14} />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <span className="text-sm text-red-500">
                {errors.confirm_password.message}
              </span>
            )}
          </div>
        </>
      ) : forgetPassword && !showOTP ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            أدخل رقم الهاتف
          </label>
          <input
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
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 text-right"
            placeholder="ادخل رقم الهاتف"
          />
          {errors.mobile_number && (
            <span className="text-sm text-red-500">
              {errors.mobile_number.message}
            </span>
          )}
        </div>
      ) : showOTP ? (
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700 text-center">
            أدخل رمز التحقق المكون من 4 أرقام
          </label>
          <div className="flex gap-3 justify-center">
            {[0, 1, 2, 3].map((index) => (
              <Controller
                key={index}
                name={`resetOTP.${index}`} // register each index in array
                control={control}
                rules={{ required: "الرمز مطلوب" }}
                render={({ field }: any) => (
                  <input
                    {...field}
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
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            أدخل رقم الهاتف
          </label>
          <input
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
            type="text"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 text-right"
            placeholder="ادخل رقم الهاتف"
          />
          {errors.mobile_number && (
            <span className="text-sm text-red-500">
              {errors.mobile_number.message}
            </span>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer w-full bg-linear-to-r from-(--brand) to-(--brand-light) text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-(--brand-light) hover:to-(--brand) focus:ring-4 focus:ring-yellow-200 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري المعالجة...</span>
          </div>
        ) : showOTP ? (
          <div className="flex items-center space-x-2">
            {/* <Check className="w-5 h-5" /> */}
            <span>✅ تأكيد الرمز</span>
          </div>
        ) : (
          "ارسال كود التحقق"
        )}
      </button>
    </form>
  );
};
export default ForgetPassword;
