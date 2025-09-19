/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId, useMemo, useState } from "react";
import { useCustomUpdate } from "@/hooks/useMutation";
import { Save, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import {
  DraftAnswer,
  DraftQuestion,
} from "@/pages/dashboard/admin/exams/questions/QuestionsPage";
import { buildSingleQuestionJson } from "@/utils/buildQuestionsPayload";

type Props = {
  examId: string;
  question: DraftQuestion;
  onCancel: () => void;
  onSuccess?: () => void;
};

const QuestionEditForm: React.FC<Props> = ({
  examId,
  question,
  onCancel,
  onSuccess,
}) => {
  const [form, setForm] = useState<DraftQuestion>(question);

  const updateQuestion = useCustomUpdate(
    `/training/admin/exams-questions/${form.id}/`,
    ["exam-questions", examId]
  );

  const setAnswer = (idx: number, patch: Partial<DraftAnswer>) => {
    setForm((d) => {
      const next = structuredClone(d);
      next.answers[idx] = { ...next.answers[idx], ...patch };
      return next;
    });
  };

  const correctCount = useMemo(
    () => form.answers.filter((a) => a.is_correct).length,
    [form.answers]
  );

  const onSubmit = async () => {
    if (!form.question_text.trim()) return toast.error("أدخل نص السؤال");
    if (form.marks <= 0) return toast.error("الدرجات يجب أن تكون أكبر من 0");
    const correct = form.answers.filter((a) => a.is_correct).length;
    if (correct !== 1) return toast.error("يجب اختيار إجابة صحيحة واحدة فقط");

    const body = await buildSingleQuestionJson(form);
    try {
      const res = await updateQuestion.mutateAsync(body as any);
      if (res?.status) {
        toast.success("تم تحديث السؤال");
        onSuccess?.();
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };

  const radioGroupId = useId();

  const ensureOneCorrect = (index: number) => {
    setForm((d) => ({
      ...d,
      answers: d.answers.map((ans, i) => ({ ...ans, is_correct: i === index })),
    }));
  };

  const removeLastAnswer = () => {
    setForm((d) => {
      const nextAnswers = d.answers.slice(0, -1);
      if (nextAnswers.length && !nextAnswers.some((a) => a.is_correct)) {
        nextAnswers[0] = { ...nextAnswers[0], is_correct: true };
      }
      return { ...d, answers: nextAnswers };
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-orange-100/50">
        <h2 className="text-lg font-bold text-gray-800">تعديل السؤال</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص السؤال *
              </label>
              <textarea
                rows={3}
                value={form.question_text}
                onChange={(e) =>
                  setForm((d) => ({ ...d, question_text: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="flex w-full justify-start items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدرجات *
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.marks ?? ""}
                  onChange={(e) =>
                    setForm((d) => ({
                      ...d,
                      marks: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex w-full justify-start items-center gap-4">
                <div className="h-[68px] flex items-center justify-center">
                  <label
                    htmlFor="question-img-edit"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2.5 text-sm rounded-lg hover:from-orange-600 w-fit self-end hover:to-orange-700 transition-all block"
                  >
                    اضافة صورة
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="question-img-edit"
                    onChange={(e) =>
                      setForm((d) => ({
                        ...d,
                        image:
                          e.target.files && e.target.files[0]
                            ? e.target.files[0]
                            : null,
                      }))
                    }
                    className="block w-full text-sm text-gray-700"
                  />
                </div>
                {form.image && (
                  <div className="mt-2">
                    <img
                      src={
                        form.image instanceof File
                          ? URL.createObjectURL(form.image)
                          : form.image
                      }
                      alt="preview"
                      className="w-40 h-28 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  الإجابات *
                </label>
                <span className="text-xs text-gray-500">
                  الصحيحة المختارة: {correctCount}
                </span>
              </div>

              <div className="space-y-3">
                {form.answers.map((a, idx) => (
                  <div
                    key={a.id ?? idx}
                    className="border border-gray-300 rounded-lg p-3 bg-gray-50 flex flex-col md:flex-row gap-3"
                  >
                    <div className="flex lg:flex-row flex-col items-start justify-start gap-4 w-full">
                      <div className="flex flex-1 items-center justify-start gap-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={radioGroupId}
                            checked={a.is_correct}
                            onChange={() => ensureOneCorrect(idx)}
                            className="scale-110"
                            title="إجابة صحيحة؟"
                          />
                          <CheckCircle
                            size={20}
                            className={
                              a.is_correct ? "text-green-600" : "text-gray-300"
                            }
                          />
                          <span className="text-sm text-gray-500">
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </div>

                        <textarea
                          rows={3}
                          value={a.answer_text}
                          onChange={(e) =>
                            setAnswer(idx, { answer_text: e.target.value })
                          }
                          className="flex-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500"
                          placeholder={`الخيار ${idx + 1}...`}
                        />

                        <div className="flex flex-col items-center justify-start gap-2">
                          <div>
                            <label
                              htmlFor={`answer_${idx}_edit`}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 text-sm rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all block"
                            >
                              اضافة صورة
                            </label>
                            <input
                              id={`answer_${idx}_edit`}
                              hidden
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setAnswer(idx, {
                                  image:
                                    e.target.files && e.target.files[0]
                                      ? e.target.files[0]
                                      : null,
                                })
                              }
                            />
                          </div>

                          {a.image && (
                            <img
                              src={
                                a.image instanceof File
                                  ? URL.createObjectURL(a.image)
                                  : a.image
                              }
                              alt="ans"
                              className="w-20 h-20 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>

                      <textarea
                        rows={1}
                        value={a.explanation ?? ""}
                        onChange={(e) =>
                          setAnswer(idx, { explanation: e.target.value })
                        }
                        placeholder="شرح (اختياري)"
                        className="max-w-xs px-3 py-2 self-center border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={() =>
                    setForm((d) => ({
                      ...d,
                      answers: [
                        ...d.answers,
                        {
                          answer_text: "",
                          image: null,
                          is_correct: false,
                          explanation: null,
                        },
                      ],
                    }))
                  }
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  إضافة خيار
                </button>

                {form.answers.length > 1 && (
                  <button
                    type="button"
                    onClick={removeLastAnswer}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1"
                  >
                    <Trash2 size={14} /> حذف آخر خيار
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Save size={16} /> حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditForm;
