import { Target, Award, CheckCircle, X } from "lucide-react";
import { useExam } from "@/store/platform/useExam";
import { useState } from "react";
import { useLesson } from "@/store/platform/useLesson";

const Exam = () => {
  // const setStartExam = useExam((state) => state.setStartExam);
  const setIsExamMode = useExam((state) => state.setIsExamMode);
  const [currentExam, setCurrentExam] = useState<any>(null);
  const [examResults, setExamResults] = useState<any>(null);
  // const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState({});
  // const [timeRemaining, setTimeRemaining] = useState(0);
  // const [examSubmitted, setExamSubmitted] = useState(false);
  const currentLesson = useLesson((state) => state.currentLesson);

  console.log("currentLesson", currentLesson);
  const startExam = () => {
    setIsExamMode(true);
    setCurrentExam(currentLesson);
    // setCurrentQuestionIndex(0);
    // setSelectedAnswers({});
    // setTimeRemaining(currentLesson.duration * 60);
    // setExamSubmitted(false);
    setExamResults(null);
  };
  const retryExam = () => {
    startExam();
  };

  const exitExam = () => {
    setIsExamMode(false);
    setCurrentExam(null);
    setExamResults(null);
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            examResults?.passed ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {examResults?.passed ? (
            <Award className="w-10 h-10 text-green-600" />
          ) : (
            <Target className="w-10 h-10 text-red-600" />
          )}
        </div>
        <h2 className="text-3xl font-bold mb-2">
          {examResults?.passed ? "🎉 تهانينا!" : "😔 لم تنجح هذه المرة"}
        </h2>
        <p className="text-xl text-gray-600 mb-4">
          درجتك:{" "}
          <span
            className={`font-bold ${
              examResults?.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {examResults?.score}%
          </span>
        </p>
        <p className="text-gray-600">
          {examResults?.passed
            ? `أحسنت! لقد تجاوزت الحد الأدنى للنجاح (${currentExam?.passingScore}%)`
            : `تحتاج إلى ${currentExam?.passingScore}% للنجاح`}
        </p>
      </div>

      {/* Detailed Results */}
      <div className="space-y-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900">مراجعة الإجابات</h3>
        {currentExam?.questions?.map((question: any, index: any) => {
          const userAnswer = examResults?.answers[question.id];
          const isCorrect = userAnswer?.selected === userAnswer?.correct;

          return (
            <div
              key={question?.id}
              className={`p-6 rounded-xl border-2 ${
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
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {question?.question}
                  </h4>
                  <div className="space-y-2">
                    {question?.options.map((option: any, optionIndex: any) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === userAnswer.correct
                            ? "border-green-500 bg-green-100 text-green-800"
                            : optionIndex === userAnswer.selected && !isCorrect
                            ? "border-red-500 bg-red-100 text-red-800"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {optionIndex === userAnswer.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {optionIndex === userAnswer.selected &&
                            !isCorrect && (
                              <X className="w-5 h-5 text-red-600" />
                            )}
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">الشرح:</h5>
                    <p className="text-blue-800">{question?.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-4">
        {!examResults?.passed && (
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
          {examResults?.passed ? "متابعة" : "الخروج"}
        </button>
      </div>
    </div>
  );
};

export default Exam;
