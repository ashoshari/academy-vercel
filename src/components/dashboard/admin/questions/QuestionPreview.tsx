import { useMemo } from "react";
import { CheckCircle, Image as ImageIcon, Lightbulb } from "lucide-react";
import { DraftQuestion } from "@/pages/dashboard/admin/exams/questions/QuestionsPage";

type Props = {
  question: DraftQuestion & { index: number };
};

type AnswerWithIdx = DraftQuestion["answers"][number] & { _idx: number };

const QuestionPreview: React.FC<Props> = ({ question }) => {
  const qImgUrl = useMemo(
    () => (question.image ? question.image : null),
    [question.image],
  );

  const { correctWithExpl, incorrectWithExpl } = useMemo(() => {
    const withIdx: AnswerWithIdx[] = (question.answers || []).map((a, idx) => ({
      ...a,
      _idx: idx,
    }));

    const hasText = (s: string | null | undefined) =>
      (s ?? "").trim().length > 0;

    return {
      correctWithExpl: withIdx.filter(
        (a) => a.is_correct && hasText(a.explanation),
      ),
      incorrectWithExpl: withIdx.filter(
        (a) => !a.is_correct && hasText(a.explanation),
      ),
    };
  }, [question.answers]);

  const letterOf = (idx: number) => String.fromCharCode(65 + idx);

  return (
    <div className="bg-white rounded-xl border border-(--brand) py-8 xl:px-36 px-8">
      <div className="flex items-start justify-start mb-2 gap-4">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
          <span className="font-bold text-(--brand) text-lg">
            {question.index + 1}
          </span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-bold text-gray-800">
            السؤال {question.index + 1}
          </h3>
          <span className="text-sm text-gray-500">{question.marks} درجة</span>
        </div>
      </div>
      <hr className="border-gray-200 my-4" />
      <p className="text-gray-800 mb-4 whitespace-pre-wrap text-lg font-semibold">
        {question.question_text || "—"}
      </p>
      {qImgUrl && (
        <div className="mb-3 w-full flex items-center justify-center">
          <img
            src={
              qImgUrl instanceof File ? URL.createObjectURL(qImgUrl) : qImgUrl
            }
            alt="Question"
            className="w-full max-w-md h-auto rounded-xl"
          />
        </div>
      )}
      <div className="space-y-2">
        {question.answers.map((a, idx) => (
          <div
            key={a.id ?? idx}
            className={`flex items-center gap-3 px-3 py-4 rounded-lg border ${
              a.is_correct
                ? "bg-green-50 border-2 border-green-400"
                : "bg-white border-2 border-gray-200"
            }`}
          >
            <span
              className={`text-base font-semibold flex items-center justify-center w-8 h-8 rounded-full border border-solid border-gray-200 ${
                a.is_correct
                  ? "border-green-400 bg-green-400 text-white"
                  : "border-gray-200 border-2 text-gray-900"
              }`}
            >
              {letterOf(idx)}
            </span>
            <span className="flex-1">{a.answer_text || "—"}</span>
            {a.image && (
              <img
                src={
                  a.image instanceof File
                    ? URL.createObjectURL(a.image)
                    : a.image
                }
                alt="Answer"
                className={`w-20 h-20 object-cover rounded-lg ${
                  !a.is_correct ? "ml-8" : ""
                }`}
              />
            )}
            {a.is_correct && (
              <CheckCircle size={20} className="text-green-600" />
            )}
          </div>
        ))}
      </div>
      {(correctWithExpl.length > 0 || incorrectWithExpl.length > 0) && (
        <>
          <hr className="border-gray-200 my-6" />

          <div className="flex flex-col items-start justify-start gap-6">
            <div className="bg-blue-50 w-full rounded-lg p-6 border border-blue-200">
              <h3 className="font-bold text-(--brand-secondary) mb-3 flex items-center gap-2">
                <Lightbulb size={20} />
                شرح الإجابة الصحيحة
              </h3>
              {correctWithExpl.map((a, i) => (
                <div
                  key={a.id ?? `c-${i}`}
                  className="w-full text-(--brand-secondary) whitespace-pre-wrap"
                >
                  <div className="mt-1">{a.explanation}</div>
                </div>
              ))}
            </div>

            {incorrectWithExpl.length > 0 && (
              <div className="w-full">
                <h3 className="font-bold text-gray-800 mb-2">
                  شرح الإجابات الخاطئة
                </h3>
                <div className="space-y-2">
                  {incorrectWithExpl.map((a, i) => (
                    <div
                      key={a.id ?? `w-${i}`}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 whitespace-pre-wrap"
                    >
                      <div className="font-semibold">
                        ({letterOf(a._idx)}) {a.answer_text}
                      </div>
                      <div className="mt-1 text-sm">{a.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {(!question.answers || question.answers.length === 0) && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <ImageIcon size={12} />
          لا توجد إجابات بعد
        </div>
      )}
    </div>
  );
};

export default QuestionPreview;
