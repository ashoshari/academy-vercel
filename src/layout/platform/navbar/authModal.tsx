import { useState } from "react";
import { X, Sparkles, GraduationCap, ArrowRight } from "lucide-react";
import useTokenStore from "@/store/platform/useToken";
import { useNavigate } from "react-router";
import Register from "../authModal/register";
import Login from "../authModal/login";
import ForgetPassword from "../authModal/forgetPassword";
import { useForm, Controller } from "react-hook-form";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}
interface formData {
  name?: string;
  mobile_number?: string;
  password?: string;
  new_password?: string;
  confirm_password?: string;
  registerOTP: string[];
  resetOTP: string[];
}
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [showResetOTP, setShowResetOTP] = useState(false);
  const [showRegisterOTP, setShowRegisterOTP] = useState(false);
  const setTokens = useTokenStore((state) => state.setTokens);

  const { register, handleSubmit, watch, control, reset, setValue, formState } =
    useForm<formData>({
      defaultValues: {
        mobile_number: "",
        new_password: "",
        confirm_password: "",
        registerOTP: ["", "", "", ""],
        resetOTP: ["", "", "", ""],
      },
    });
  const switchMode = () => {
    setIsLogin(!isLogin);
    reset();
    setShowPassword(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setShowPassword(false);
            setForgetPassword(false);
            setShowResetOTP(false);
            setShowRegisterOTP(false);
            setIsLogin(true);
            reset();
            onClose();
          }}
          className="cursor-pointer absolute top-4 left-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        {(forgetPassword || showRegisterOTP) && (
          <button
            onClick={() => {
              setShowRegisterOTP(false);
              setShowResetOTP(false);
              setResetPassword(false);
              setShowPassword(false);
              setForgetPassword(false);
              reset();
            }}
            className="cursor-pointer absolute top-4 right-4 w-10 h-10 bg-linear-to-r from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center transition-colors duration-200 z-10"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        )}

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-yellow-400 to-orange-500 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
              <Sparkles className="w-4 h-4 text-yellow-200 absolute -top-1 -right-1 animate-ping" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {forgetPassword && !showResetOTP
                ? "نسيت كلمة السر "
                : showResetOTP
                  ? "📱 تأكيد رقم الهاتف"
                  : isLogin
                    ? "🔐 تسجيل الدخول"
                    : "🚀 إنشاء حساب جديد"}
            </h2>
            <p className="text-gray-600 text-sm">
              {forgetPassword && !showResetOTP
                ? "أدخل رقم الهاتف ليتم ارسال كود التحقق "
                : showResetOTP || showRegisterOTP
                  ? `تم إرسال رمز التحقق إلى هاتفك 📲`
                  : isLogin
                    ? "أدخل بياناتك للوصول إلى دوراتك المفضلة 📚"
                    : "ابدأ رحلتك نحو التفوق في التوجيهي 🌟"}
            </p>
          </div>
          {/* Form */}
          {forgetPassword ? (
            <ForgetPassword
              resetPassword={resetPassword}
              forgetPassword={forgetPassword}
              setResetPassword={setResetPassword}
              setIsLogin={setIsLogin}
              setForgetPassword={setForgetPassword}
              showOTP={showResetOTP}
              setShowOTP={setShowResetOTP}
              setShowPassword={setShowPassword}
              showPassword={showPassword}
              formState={formState}
              register={register}
              handleSubmit={handleSubmit}
              reset={reset}
              watch={watch}
              Controller={Controller}
              control={control}
            />
          ) : isLogin ? (
            <Login
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onLogin={onLogin}
              onClose={onClose}
              navigate={navigate}
              setTokens={setTokens}
              register={register}
              handleSubmit={handleSubmit}
              reset={reset}
              formState={formState}
            />
          ) : (
            <Register
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              onLogin={onLogin}
              onClose={onClose}
              navigate={navigate}
              setTokens={setTokens}
              register={register}
              handleSubmit={handleSubmit}
              reset={reset}
              formState={formState}
              Controller={Controller}
              control={control}
              setShowOTP={setShowRegisterOTP}
              showOTP={showRegisterOTP}
              isLogin={isLogin}
              setValue={setValue}
            />
          )}

          {/* Switch Mode */}
          {!showResetOTP && !showRegisterOTP && !forgetPassword && (
            <div className="mt-6 text-center flex gap-x-2.5">
              <button
                onClick={switchMode}
                className="cursor-pointer text-yellow-600 hover:text-yellow-700 text-sm font-semibold transition-all duration-300"
              >
                {isLogin
                  ? "🆕 لا تملك حساب؟ إنشاء حساب جديد"
                  : "👋 لديك حساب؟ تسجيل الدخول"}
              </button>
              {!forgetPassword && (
                <button
                  onClick={() => {
                    reset();
                    setForgetPassword(true);
                  }}
                  className="cursor-pointer text-gray-400 hover:text-gray-800 text-sm font-semibold transition-all duration-300"
                >
                  هل نسيت كلمة السر
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
