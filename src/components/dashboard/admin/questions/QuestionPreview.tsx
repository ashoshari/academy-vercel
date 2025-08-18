// src/components/exams/questions/QuestionPreview.tsx
// import React, { useMemo } from "react";
import { CheckCircle, Image as ImageIcon } from "lucide-react";
import { DraftQuestion } from "@/pages/dashboard/admin/exams/questions/QuestionsPage";
import img from "@/assets/illustration/Error_illustration.svg";

type Props = {
  question: DraftQuestion;
};

const QuestionPreview: React.FC<Props> = ({ question }) => {
  // const qImgUrl = useMemo(
  //   () => (question.image ? URL.createObjectURL(question.image) : null),
  //   [question.image]
  // );

  return (
    <div className="bg-white rounded-xl border border-orange-100/50 p-4">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-gray-800">معاينة السؤال</h3>
        <span className="text-sm text-gray-500">{question.marks} درجة</span>
      </div>

      <p className="text-gray-800 mb-3 whitespace-pre-wrap">
        {question.question_text || "—"}
      </p>

      {/* {qImgUrl && ( */}
      <div className="mb-3">
        <img
          src={img}
          alt="Question"
          className="w-full max-w-md h-40 object-cover rounded border"
        />
      </div>
      {/* )} */}

      <div className="space-y-2">
        {question.answers.map((a, idx) => (
          <div
            key={a.id ?? idx}
            className={`flex items-center gap-3 p-2 rounded border ${
              a.is_correct ? "bg-green-50 border-green-200" : "bg-gray-50"
            }`}
          >
            <span className="text-sm text-gray-500">
              {String.fromCharCode(65 + idx)}.
            </span>
            <span className="flex-1">{a.answer_text || "—"}</span>
            {/* {a.image && ( */}
            <img
              src={img}
              // src={URL.createObjectURL(a.image)}
              alt="Answer"
              className="w-10 h-10 object-cover rounded border"
            />
            {/* )} */}
            {a.is_correct && (
              <CheckCircle size={16} className="text-green-600" />
            )}
          </div>
        ))}
      </div>

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
