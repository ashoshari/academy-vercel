import {
  Target,
  Award,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { useExam } from "@/store/platform/useExam";
import { useState, useEffect, useRef } from "react";
// import { useLesson } from "@/store/platform/useLesson";
import { useNavigate, useParams } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import { toast } from "react-hot-toast";
import errorIllustation from "@/assets/illustration/Error_illustration.svg";

const Exam = () => {
  // const setStartExam = useExam((state) => state.setStartExam);
  const { examId } = useParams();
  const navigate = useNavigate();
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>([]);

  // GET EXAM
  const { data, error } = useCustomQuery(
    `/training/students/course/exam/${examId}/`,
    ["exams", examId]
  );
  const examData = data?.data;
  const [openExam, setOpenExam] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any>([]);
  const [isPassed, setIsPassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (examData) {
      setOpenExam(!examData.is_passed);
      setScore(examData.score);
      setIsPassed(examData.is_passed);
      setTimeLeft((examData.time_in_minutes || 0) * 60);
    }
  }, [examData]);

  const hasSubmitted = useRef(false);
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasSubmitted.current) {
            hasSubmitted.current = true;
            toast.error("انتهى الوقت");
            handleExamSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // POST SUBMIT EXAM
  const { mutateAsync: postExam } = useCustomPost(
    `/training/students/course/exam/${examData?.id}/submit/`,
    ["postExam"]
  );
  const startExam = () => {
    setIsExamMode(true);
    // setCurrentExam(examData);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    // setTimeRemaining(examData.duration * 60);
    // setExamSubmitted(false);
    // setExamResults(null);
  };
  const handleAnswerSelect = (questionId: any, answerId: any) => {
    setSelectedAnswers((prev: any) => {
      const exists = prev?.some((ans: any) => ans.question_id === questionId);

      if (exists) {
        // Update existing answer
        return prev.map((ans: any) =>
          ans.question_id === questionId ? { ...ans, answer_id: answerId } : ans
        );
      } else {
        // Add new answer
        return [...prev, { question_id: questionId, answer_id: answerId }];
      }
    });
  };
  const retryExam = () => {
    startExam();
    setOpenExam(true);
    setSelectedAnswers([]);
    setAnswers([]);
  };
  const exitExam = () => {
    // setIsExamMode(false);
    window.history.length > 1 ? navigate(-1) : navigate("/");
    // setCurrentExam(null);
    // setExamResults(null);
  };
  const handleExamSubmit = async (timer?: any) => {
    if (!examData) return;
    try {
      const res = await postExam({ answers: selectedAnswers });
      setScore(res?.data?.score);
      setIsPassed(res?.data?.is_passed);
      setAnswers(res?.data?.answers);
      !timer && toast.success("تم تقديم الامتحان بنجاح");
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
    setOpenExam(false);
  };

  if (!examData && !error) return null;
  return (
    <section>
      {error && (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <img
              loading="lazy"
              src={errorIllustation}
              alt="404"
              className="w-[200px] h-[200px] mx-auto mb-4"
            />
            <p className="text-gray-600">
              ليس لديك الصلاحيات لمشاهدة هذا المحتوى
            </p>
          </div>
        </div>
      )}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 w-full">
              <button
                onClick={() => window.history.back()}
                className="cursor-pointer w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-200"
              >
                <ArrowRight className="w-5 h-5 text-gray-600 cursor-pointer" />
              </button>
              {!isPassed && (
                <div className="flex justify-between w-full">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      {examData?.title}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {examData?.teacher?.name}
                    </p>
                  </div>
                  <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-900">
                      {examData?.material?.name}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {examData?.level?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {openExam && !error ? (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Exam Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {examData?.title}
              </h2>
              <p className="text-gray-600">
                السؤال {currentQuestionIndex + 1} من{" "}
                {examData?.questions?.length}
              </p>
            </div>
            <div className="text-center">
              <div
                className={`text-3xl font-bold mb-2 ${
                  timeLeft < (examData?.time_in_minutes * 60) / 8
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">الوقت المتبقي</div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>التقدم</span>
              <span>
                {Math.round(
                  (Object.keys(selectedAnswers).length /
                    examData?.questions?.length) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (Object.keys(selectedAnswers).length /
                      examData?.questions?.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {examData?.questions?.[currentQuestionIndex]?.question_image && (
                <img
                  src={
                    examData?.questions?.[currentQuestionIndex]
                      ?.question_image
                  }
                  alt="Question"
                  className="mb-4 rounded-lg w-120 h-120"
                />
              )}
              {examData?.questions?.[currentQuestionIndex]?.question_text}
            </h3>
            <div className="space-y-3">
              {examData?.questions?.[currentQuestionIndex]?.answers?.map(
                (answer: any, index: any) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswerSelect(
                        examData?.questions[currentQuestionIndex].id,
                        answer?.id
                      )
                    }
                    className={`cursor-pointer w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuestionIndex]?.answer_id ===
                      answer?.id
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedAnswers[currentQuestionIndex]?.answer_id ===
                          answer?.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedAnswers[currentQuestionIndex]?.answer_id ===
                          answer?.id && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="flex items-center gap-x-[20px] font-medium">
                        {answer?.answer_image && (
                          <img
                            src={
                              answer?.answer_image
                            }
                            alt="Answer"
                            className="mb-2 rounded-lg w-24 h-24"
                          />
                        )}
                        {answer?.answer_text}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() =>
                setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
              }
              disabled={currentQuestionIndex === 0}
              className="cursor-pointer px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <ChevronRight className="w-5 h-5" />
              <span>السابق</span>
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">
                تم الإجابة على {Object.keys(selectedAnswers).length} من{" "}
                {examData?.questions?.length} أسئلة
              </div>
            </div>

            {currentQuestionIndex === examData?.questions?.length - 1 ? (
              <button
                onClick={() => {
                  currentQuestionIndex !== selectedAnswers.length
                    ? handleExamSubmit()
                    : toast.error(
                        "يرجى اجابة عن السؤال قبل الانتقال للسؤال التالي"
                      );
                }}
                className="cursor-pointer px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>تسليم الامتحان</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  currentQuestionIndex !== selectedAnswers.length
                    ? setCurrentQuestionIndex(
                        Math.min(
                          examData?.questions.length - 1,
                          currentQuestionIndex + 1
                        )
                      )
                    : toast.error(
                        "يرجى اجابة عن السؤال قبل الانتقال للسؤال التالي"
                      );
                }}
                className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
              >
                <span>التالي</span>
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isPassed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {isPassed ? (
                <Award className="w-10 h-10 text-green-600" />
              ) : (
                <Target className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isPassed ? "🎉 تهانينا!" : "😔 لم تنجح هذه المرة"}
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              درجتك:{" "}
              <span
                className={`font-bold ${
                  isPassed ? "text-green-600" : "text-red-600"
                }`}
              >
                {score}%
              </span>
            </p>
            <p className="text-gray-600">
              {isPassed
                ? `أحسنت! لقد تجاوزت الحد الأدنى للنجاح (${examData?.passing_marks}%)`
                : `تحتاج إلى ${examData?.passing_marks}% للنجاح`}
            </p>
          </div>
          {/* Detailed Results */}
          <div>
            {examData?.questions?.map((question: any, questionIndex: any) => {
              const matchedAnswer = answers?.find(
                (a: any) => a?.question_id === question?.id
              );
              const isCorrect = matchedAnswer?.is_correct;
              const correctAnswerId = matchedAnswer?.correct_answer_id;
              const userAnswerId = matchedAnswer?.user_answer_id;
              const currentAnswer = answers?.[questionIndex];
              return (
                <div
                  key={questionIndex}
                  className={`p-6 rounded-xl border-2 my-[10px] ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {questionIndex + 1}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {question?.question_text}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {question?.answers?.map((answer: any, answerIndex: any) => (
                      <div
                        key={answerIndex}
                        className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                          correctAnswerId === answer?.id
                            ? "border-green-500 bg-green-50 text-green-900"
                            : answer?.id === userAnswerId
                            ? "border-red-500 bg-red-100 text-red-900"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {answer?.id === correctAnswerId ? (
                            <CircleCheckBig className="w-6 h-6" />
                          ) : (
                            answer?.id === userAnswerId && (
                              <CircleX className="w-6 h-6 text-red-500" />
                            )
                          )}
                          <span className="flex-1 font-medium">
                            {answer?.answer_text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {currentAnswer?.explanation && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">
                        الشرح:
                      </h5>
                      <p className="text-blue-800">
                        {currentAnswer?.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            {!isPassed && (
              <button
                onClick={retryExam}
                className="cursor-pointer px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                إعادة المحاولة
              </button>
            )}
            <button
              onClick={exitExam}
              className="cursor-pointer px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              {examData?.id_passed ? "متابعة" : "الخروج"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Exam;
