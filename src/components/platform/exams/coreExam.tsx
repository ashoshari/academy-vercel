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
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import EmptyState from "@/components/core/EmptyState";
import { Inbox, ShieldAlert } from "lucide-react";

interface ExamProps {
  examData: any;
  examError: any;
  postExam: any;
  course?: boolean;
  markLessonComplete?: any;
  currentLesson?: any;
}
const CoreExam = ({
  examData,
  examError,
  postExam,
  course,
  markLessonComplete,
  currentLesson,
}: ExamProps) => {
  const navigate = useNavigate();
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>([]);
  //   const examData = data?.data;
  const [openExam, setOpenExam] = useState(true);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<any>([]);
  const [isPassed, setIsPassed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (examData) {
      setScore(examData.percentage);
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
  const startExam = () => {
    setIsExamMode(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };
  const handleAnswerSelect = (questionId: any, answerId: any) => {
    setSelectedAnswers((prev: any) => {
      const exists = prev?.some((ans: any) => ans.question_id === questionId);

      if (exists) {
        // Update existing answer
        return prev.map((ans: any) =>
          ans.question_id === questionId
            ? { ...ans, answer_id: answerId }
            : ans,
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
    setIsExamMode(false);
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    } // setCurrentExam(null);
    // setExamResults(null);
  };
  const handleExamSubmit = async (timer?: any) => {
    if (!examData) return;
    try {
      const res = await postExam({ answers: selectedAnswers });
      setScore(res?.data?.percentage);
      setIsPassed(res?.data?.is_passed);
      setAnswers(res?.data?.answers);
      if (!timer) toast.success("تم تقديم الامتحان بنجاح");
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
    setOpenExam(false);
  };
  return (
    <section>
      {examError ? (
        <div className="min-h-screen p-3 bg-linear-to-br from-gray-50 to-white flex flex-col items-center justify-center">
          <EmptyState
            title="ليس لديك الصلاحيات لمشاهدة هذا المحتوى"
            description="إذا كنت تعتقد أن هذا خطأ، تواصل مع الدعم."
            icon={ShieldAlert}
            tone="warning"
            size="lg"
            fullHeight
            className="w-full"
          />
        </div>
      ) : !examData?.questions || examData?.questions?.length === 0 ? (
        <>
          {!isPassed && !course && (
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
                    <div className="flex justify-between w-full">
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">
                          {examData?.title || "-"}
                        </h1>
                        <p className="text-sm text-gray-600">
                          {examData?.teacher?.name || "-"}
                        </p>
                      </div>
                      <div className="text-center">
                        <h1 className="text-xl font-bold text-gray-900">
                          {examData?.material?.name || "-"}
                        </h1>
                        <p className="text-sm text-gray-600">
                          {examData?.level?.name || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="h-100 p-3 bg-linear-to-br from-gray-50 to-white flex flex-col items-center justify-center">
            <EmptyState
              title="لا يوجد محتوى لعرضه"
              description="لا توجد أسئلة/بيانات متاحة لهذا الامتحان حالياً."
              icon={Inbox}
              tone="info"
              size="lg"
              className="w-full"
            />
          </div>
        </>
      ) : (
        <>
          {!course && (
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
                            {examData?.title || "-"}
                          </h1>
                          <p className="text-sm text-gray-600">
                            {examData?.teacher?.name || "-"}
                          </p>
                        </div>
                        <div className="text-center">
                          <h1 className="text-xl font-bold text-gray-900">
                            {examData?.material?.name || "-"}
                          </h1>
                          <p className="text-sm text-gray-600">
                            {examData?.level?.name || "-"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {openExam && !examError ? (
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
                        : "text-(--brand-secondary)"
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
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) h-3 rounded-full transition-all duration-300"
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
                  {examData?.questions?.[currentQuestionIndex]?.image && (
                    <img
                      src={examData?.questions?.[currentQuestionIndex]?.image}
                      alt="Question"
                      className="w-112.5 mb-4 rounded-lg"
                    />
                  )}
                  {examData?.questions?.[currentQuestionIndex]?.question_text}
                </h3>
                {/* Answers */}
                <div className="space-y-3">
                  {examData?.questions?.[currentQuestionIndex]?.answers?.map(
                    (answer: any, index: any) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswerSelect(
                            examData?.questions[currentQuestionIndex].id,
                            answer?.id,
                          )
                        }
                        className={`cursor-pointer w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                          selectedAnswers[currentQuestionIndex]?.answer_id ===
                          answer?.id
                            ? "border-(--brand-secondary) bg-blue-50 text-(--brand-secondary)"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[currentQuestionIndex]
                                ?.answer_id === answer?.id
                                ? "border-(--brand-secondary) bg-(--brand-secondary)"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswers[currentQuestionIndex]
                              ?.answer_id === answer?.id && (
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="flex md:flex-row flex-col items-center gap-x-5 font-medium">
                            {answer?.image && (
                              <img
                                src={answer?.image}
                                alt="Answer"
                                className="w-37.5 md:w-62.5 mb-2 rounded-lg max-w-100 max-h-100"
                              />
                            )}
                            <p className="w-full">{answer?.answer_text}</p>
                          </span>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex md:flex-row flex-col gap-y-5 items-center justify-between">
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(
                      Math.max(0, currentQuestionIndex - 1),
                    )
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
                      if (currentQuestionIndex !== selectedAnswers.length) {
                        handleExamSubmit();
                      } else {
                        toast.error(
                          "يرجى اجابة عن السؤال قبل الانتقال للسؤال التالي",
                        );
                      }
                    }}
                    className="cursor-pointer px-8 py-3 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>تسليم الامتحان</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (currentQuestionIndex !== selectedAnswers.length) {
                        setCurrentQuestionIndex(
                          Math.min(
                            examData?.questions.length - 1,
                            currentQuestionIndex + 1,
                          ),
                        );
                      } else {
                        toast.error(
                          "يرجى اجابة عن السؤال قبل الانتقال للسؤال التالي",
                        );
                      }
                    }}
                    className="cursor-pointer px-6 py-3 bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white rounded-xl font-semibold hover:from-(--brand-secondary-dark) hover:to-(--brand-secondary) transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>التالي</span>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            !openExam && (
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
                      ? `أحسنت! لقد تجاوزت الحد الأدنى للنجاح (${
                          (examData?.passing_marks / examData?.total_marks) *
                          100
                        }%)`
                      : `تحتاج إلى ${
                          (examData?.passing_marks / examData?.total_marks) *
                          100
                        }% للنجاح`}
                  </p>
                </div>
                {/* Detailed Results */}
                <div>
                  {examData?.questions?.map(
                    (question: any, questionIndex: any) => {
                      const matchedAnswer = answers?.find(
                        (a: any) => a?.question_id === question?.id,
                      );
                      const isCorrect = matchedAnswer?.is_correct;
                      const correctAnswerId = matchedAnswer?.correct_answer_id;
                      const userAnswerId = matchedAnswer?.user_answer_id;
                      const currentAnswer = answers?.[questionIndex];
                      return (
                        <div
                          key={questionIndex}
                          className={`p-6 rounded-xl border-2 my-2.5 ${
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
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">
                                {question?.question_text}
                              </h4>
                              {question?.image && (
                                <img
                                  src={question?.image}
                                  alt="Question"
                                  className="w-62.5 mb-4 rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                          <div className="space-y-3">
                            {question?.answers?.map(
                              (answer: any, answerIndex: any) => (
                                <div
                                  key={answerIndex}
                                  className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
                                    answer?.id === correctAnswerId ||
                                    (answer?.id === userAnswerId && isCorrect)
                                      ? "border-green-500 bg-green-50 text-green-900"
                                      : answer?.id === userAnswerId &&
                                          !isCorrect
                                        ? "border-red-500 bg-red-100 text-red-900"
                                        : "border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    {answer?.id === correctAnswerId ||
                                    (answer?.id === userAnswerId &&
                                      isCorrect) ? (
                                      <CircleCheckBig className="w-6 h-6" />
                                    ) : (
                                      answer?.id === userAnswerId && (
                                        <CircleX className="w-6 h-6 text-red-500" />
                                      )
                                    )}
                                    <span className="flex-1 font-medium">
                                      {answer?.image && (
                                        <img
                                          src={answer?.image}
                                          alt="Answer"
                                          className="w-62.5 mb-2 rounded-lg max-w-100 max-h-100"
                                        />
                                      )}
                                      {answer?.answer_text}
                                    </span>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                          {currentAnswer?.explanation && (
                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                              <h5 className="font-semibold text-blue-900 mb-2">
                                الشرح:
                              </h5>
                              <p className="text-(--brand-secondary)">
                                {currentAnswer?.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={retryExam}
                    className="cursor-pointer px-8 py-3 bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                  >
                    إعادة المحاولة
                  </button>
                  {course ? (
                    <button
                      onClick={markLessonComplete}
                      disabled={currentLesson?.is_completed}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                        currentLesson?.is_completed
                          ? "bg-green-100 text-green-800 cursor-not-allowed"
                          : "bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        {currentLesson?.is_completed
                          ? "مكتمل"
                          : "وضع علامة مكتمل"}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={exitExam}
                      className="cursor-pointer px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      الخروج
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </>
      )}
    </section>
  );
};

export default CoreExam;
