import React from "react";
import { Eye, Edit } from "lucide-react";
import { ExamQuestion } from "@/pages/dashboard/admin/exams/questions/QuestionsPage";

type Props = {
  questions: ExamQuestion[];
  onAdd: () => void;
  onPreview: (q: ExamQuestion, index: number) => void;
  onEdit: (q: ExamQuestion, index: number) => void;
  onDelete: (q: ExamQuestion, index: number) => void;
};

const QuestionsList: React.FC<Props> = ({
  questions,
  onAdd,
  onPreview,
  onEdit,
  // onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800">أسئلة الامتحان</h2>
          <p className="text-sm text-gray-500">
            الإجمالي: {questions?.length ?? 0}
          </p>
        </div>
        <button
          onClick={onAdd}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:from-orange-600 hover:to-orange-700"
        >
          إضافة أسئلة
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  السؤال
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  الدرجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  الإجابات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions?.map((q, index) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-start gap-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="font-bold text-orange-600 text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="text-black font-semibold">
                        {q.question_text}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">{q.marks}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {q.answers?.length ?? 0}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onPreview(q, index)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="معاينة"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(q, index)}
                        className="p-1 text-gray-400 hover:text-orange-600"
                        title="تعديل"
                      >
                        <Edit size={16} />
                      </button>
                      {/* <button
                        onClick={() => onDelete(q, index)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="حذف السؤال"
                      >
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}

              {(!questions || questions.length === 0) && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    لا توجد أسئلة بعد — أضف أول سؤال الآن
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuestionsList;
