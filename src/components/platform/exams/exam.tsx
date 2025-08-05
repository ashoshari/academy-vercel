import {
  Target,
  Award,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { useExam } from "@/store/platform/useExam";
import { useState } from "react";
// import { useLesson } from "@/store/platform/useLesson";
import {  useNavigate, useParams } from "react-router";
import { useCustomQuery } from "@/hooks/useQuery";
import { useCustomPost } from "@/hooks/useMutation";
import { toast } from "react-hot-toast";

const Exam = () => {
  // const setStartExam = useExam((state) => state.setStartExam);
  const { examId } = useParams();
  const navigate = useNavigate();
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  // const [currentExam, setCurrentExam] = useState<any>(null);
  // const [examResults, setExamResults] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>([]);
  // const [timeRemaining, setTimeRemaining] = useState(0);
  // const [examSubmitted, setExamSubmitted] = useState(false);
  // const currentLesson = useLesson((state) => state.currentLesson);

  // GET EXAM
  const { data, isLoading } = useCustomQuery(
    `/training/students/course/exam/${examId}/`,
    ["exams", examId]
  );
  if (isLoading) {
    console.log("isLoading");
  } else {
    console.log(data?.data?.id);
    console.log(`/training/students/course/exam/${examId}/`);
  }
  const examData = data?.data;

  console.log("examData", examData?.questions);

  const [openExam, setOpenExam] = useState(!examData?.is_passed);
  const [score, setScore] = useState(examData?.score);
  // const [answers, setAnswers] = useState(examData?.answers);

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
      console.log("selectedAnswers", selectedAnswers);
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
    setOpenExam(!openExam);
    setSelectedAnswers([]);
  };
  const exitExam = () => {
    // setIsExamMode(false);
    navigate(-1);
    // setCurrentExam(null);
    // setExamResults(null);
  };
  const handleExamSubmit = async () => {
    if (!examData) return;

    // setExamSubmitted(true);
    // examData?.questions?.forEach((question: any) => {
    //   const selectedAnswer = selectedAnswers[question.id];
    //   const isCorrect = selectedAnswer === question.correctAnswer;
    //   if (isCorrect) correctAnswers++;

    //   answerDetails[question.id] = {
    //     selected: selectedAnswer ?? -1,
    //     correct: question.correctAnswer,
    //   };
    // });
    console.log("examData", examData?.questions);
    try {
      const res = await postExam({ answers: selectedAnswers });
      console.log(res);
      setScore(res?.data?.score);
      // setAnswers(res?.data?.answers);
      toast.success("تم تقديم الامتحان بنجاح");
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
    setOpenExam(false);
  };
  if (!examData) return null;
  return (
    <>
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-200"
              >
                <ArrowRight className="w-5 h-5 text-gray-600 cursor-pointer" />
              </button>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {examData?.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {examData?.teacher?.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openExam ? (
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
                  examData?.time_in_minutes < 100
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {examData?.enable_countdown && examData?.time_in_minutes}
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
                  ((currentQuestionIndex + 1) / examData?.questions?.length) *
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
                    ((currentQuestionIndex + 1) / examData?.questions?.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {examData?.questions?.[currentQuestionIndex].question_text}
            </h3>
            <div className="space-y-3">
              {examData?.questions?.[currentQuestionIndex].answers?.map(
                (answer: any, index: any) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleAnswerSelect(
                        examData?.questions[currentQuestionIndex].id,
                        answer?.id
                      )
                    }
                    className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
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
                      <span className="flex-1 font-medium">
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
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>تسليم الامتحان</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log("currentQuestionIndex", currentQuestionIndex);
                  console.log("selectedAnswers", selectedAnswers.length);
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
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
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
                examData?.is_passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {examData?.is_passed ? (
                <Award className="w-10 h-10 text-green-600" />
              ) : (
                <Target className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {examData?.is_passed ? "🎉 تهانينا!" : "😔 لم تنجح هذه المرة"}
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              درجتك:{" "}
              <span
                className={`font-bold ${
                  examData?.is_passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {score}%
              </span>
            </p>
            <p className="text-gray-600">
              {examData?.is_passed
                ? `أحسنت! لقد تجاوزت الحد الأدنى للنجاح (${examData?.passing_marks}%)`
                : `تحتاج إلى ${examData?.passing_marks}% للنجاح`}
            </p>
          </div>
          {/* Detailed Results */}
          {/* <div className="space-y-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900">مراجعة الإجابات</h3>
            {examData?.questions?.map((question: any, index: any) => {
              <div key={index} className="">
                {question?.answers?.map((answer: any, answerIndex: any) => {
                  <div
                    key={answer?.answerIndex}
                    className={`p-6 rounded-xl border-2 ${
                      answer?.is_correct
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start space-x-3 mb-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          answer?.is_correct ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {answerIndex + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {answer?.question_text}
                        </h4>
                        <div className="space-y-2">
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border ${
                                  optionIndex === answer?.correct
                                    ? "border-green-500 bg-green-100 text-green-800"
                                    : optionIndex === answer?.selected &&
                                      !answer?.is_correct
                                    ? "border-red-500 bg-red-100 text-red-800"
                                    : "border-gray-200 bg-white"
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  {optionIndex === answer?.correct && (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  )}
                                  {optionIndex === answer?.selected &&
                                    !answer?.is_correct && (
                                      <X className="w-5 h-5 text-red-600" />
                                    )}
                                  <span>{option}</span>
                                </div>
                              </div>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-blue-900 mb-2">
                            الشرح:
                          </h5>
                          <p className="text-blue-800">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>;
                })}
              </div>;
            })}
          </div> */}
          <div>
            {examData?.questions?.map((question: any, index: any) => (
              <div
                className={`p-6 rounded-xl border-2 ${
                  question?.is_passed
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start space-x-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      question?.is_passed ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {question?.question_text}
                  </h4>
                </div>
                {/* <div className="space-y-3">
                {examData?.questions?.[currentQuestionIndex].answers?.map(
                  (answer: any, index: any) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleAnswerSelect(
                          examData?.questions[currentQuestionIndex].id,
                          answer?.id
                        )
                      }
                      className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
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
                        <span className="flex-1 font-medium">
                          {answer?.answer_text}
                        </span>
                      </div>
                    </button>
                  )
                )}
              </div> */}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            {!examData?.is_passed && (
              <button
                onClick={retryExam}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
              >
                إعادة المحاولة
              </button>
            )}
            <button
              onClick={exitExam}
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
            >
              {examData?.id_passed ? "متابعة" : "الخروج"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Exam;
