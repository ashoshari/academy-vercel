import { useState } from 'react';
import { X, ArrowLeft, Check, Loader2, Sparkles, GraduationCap } from 'lucide-react';

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
    fullName: '',
    mobile: '',
    password: '',
    otp: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (!isLogin && !showOTP) {
        setShowOTP(true);
      } else {
        // Handle login or OTP verification
        onLogin();
        onClose();
      }
      setIsLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobile: '',
      password: '',
      otp: ''
    });
    setShowOTP(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
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
                ? '📱 تأكيد رقم الهاتف' 
                : isLogin 
                  ? '🔐 تسجيل الدخول' 
                  : '🚀 إنشاء حساب جديد'
              }
            </h2>
            <p className="text-gray-600 text-sm">
              {showOTP 
                ? `تم إرسال رمز التحقق إلى ${formData.mobile} 📲` 
                : isLogin 
                  ? 'أدخل بياناتك للوصول إلى دوراتك المفضلة 📚' 
                  : 'ابدأ رحلتك نحو التفوق في التوجيهي 🌟'
              }
            </p>
          </div>

          {/* Back Button for OTP */}
          {showOTP && (
            <button
              onClick={() => setShowOTP(false)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 hover:translate-x-1 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              <span className="font-medium">العودة</span>
            </button>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            {showOTP && (
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 text-center">
                  أدخل رمز التحقق المكون من 4 أرقام
                </label>
                <div className="flex gap-3 justify-center">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      onChange={(e) => {
                        const value = formData.otp;
                        const newValue = value.substring(0, index) + e.target.value + value.substring(index + 1);
                        handleInputChange('otp', newValue);
                        
                        // Auto-focus next input
                        if (e.target.value && index < 3) {
                          const nextInput = e.target.parentElement?.children[index + 1] as HTMLInputElement;
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
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 text-right"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
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
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      className="w-full px-4 py-3 pl-16 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300"
                      placeholder="07XXXXXXXX"
                      required
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded-lg text-sm">
                      +962
                    </span>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    🔒 كلمة المرور
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-yellow-200 focus:border-yellow-500 transition-all duration-300 text-right"
                    placeholder="أدخل كلمة المرور"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-yellow-600 hover:to-orange-600 focus:ring-4 focus:ring-yellow-200 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {isLoading ? (
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
                <span>{isLogin ? '🚀 تسجيل الدخول' : '✨ إنشاء الحساب'}</span>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          {!showOTP && (
            <div className="mt-6 text-center">
              <button
                onClick={switchMode}
                className="text-yellow-600 hover:text-yellow-700 text-sm font-semibold transition-all duration-300"
              >
                {isLogin ? '🆕 لا تملك حساب؟ إنشاء حساب جديد' : '👋 لديك حساب؟ تسجيل الدخول'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;