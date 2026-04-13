import { useId, useMemo, useState } from "react";
import { Plus, Save, Trash2, CheckCircle } from "lucide-react";
import { useCustomPost } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";
import {
  DraftAnswer,
  DraftQuestion,
} from "@/pages/dashboard/admin/exams/questions/QuestionsPage";
import { buildQuestionsJson } from "@/utils/buildQuestionsPayload";

type Props = {
  examId: string;
  questionsCount: number;
  totalMarks: number;
  existingQuestionsCount: number;
  existingMarksSum: number;
  onCancel: () => void;
  onSuccess?: () => void;
};

const emptyAnswer = (isCorrect = false): DraftAnswer => ({
  answer_text: "",
  image: null,
  is_correct: isCorrect,
  explanation: null,
});

const emptyQuestion = (): DraftQuestion => ({
  question_text: "",
  image: null,
  marks: 1,
  answers: [emptyAnswer(true), emptyAnswer(), emptyAnswer(), emptyAnswer()],
});

const AddQuestionsForm: React.FC<Props> = ({
  examId,
  questionsCount,
  totalMarks,
  existingQuestionsCount,
  existingMarksSum,
  onCancel,
  onSuccess,
}) => {
  const [draft, setDraft] = useState<DraftQuestion>(emptyQuestion());
  const radioGroupId = useId();
  const [pending, setPending] = useState<DraftQuestion[]>([]);

  const addQuestion = useCustomPost(`/training/admin/exam-questions/`, [
    "exam-questions",
    examId,
  ]);

  const correctCount = useMemo(
    () => draft.answers.filter((a) => a.is_correct).length,
    [draft.answers],
  );

  const setAnswer = (idx: number, patch: Partial<DraftAnswer>) => {
    setDraft((d) => {
      const next = structuredClone(d);
      next.answers[idx] = { ...next.answers[idx], ...patch };
      return next;
    });
  };

  const onAddToBatch = () => {
    if (remainingQuestions <= 0) {
      toast.error(
        "لا يمكنك إضافة أسئلة أخرى — الحد الأقصى لعدد الأسئلة تم بلوغه",
      );
      return;
    }
    if (remainingMarks <= 0 || draft.marks > remainingMarks) {
      toast.error("لا توجد درجات كافية لإضافة هذا السؤال");
      return;
    }
    if (!draft.question_text.trim()) {
      toast.error("أدخل نص السؤال");
      return;
    }
    if (draft.marks <= 0) {
      toast.error("الدرجات يجب أن تكون أكبر من 0");
      return;
    }
    if (draft.answers.length === 0) {
      toast.error("أضف إجابات للسؤال");
      return;
    }
    if (draft.answers.every((a) => !a.is_correct)) {
      toast.error("اختر إجابة صحيحة واحدة على الأقل");
      return;
    }
    setPending((p) => [...p, draft]);
    setDraft(emptyQuestion());
    toast.success("تمت إضافة السؤال للمجموعة");
  };

  const onSubmitAll = async () => {
    const currentHasText = !!draft.question_text.trim();
    const payload = pending.length
      ? [...pending, ...(currentHasText ? [draft] : [])]
      : [draft];

    if (!payload.length || !payload[0].question_text.trim()) {
      toast.error("أدخل بيانات السؤال أولاً");
      return;
    }

    for (const q of payload) {
      const correct = q.answers.filter((a) => a.is_correct).length;
      if (correct !== 1) {
        toast.error("يجب اختيار إجابة صحيحة واحدة فقط لكل سؤال");
        return;
      }
      if (q.marks <= 0) {
        toast.error("الدرجات يجب أن تكون أكبر من 0");
        return;
      }
    }

    const totalAfterQuestions = existingQuestionsCount + payload.length;
    if (totalAfterQuestions > questionsCount) {
      toast.error("إجمالي عدد الأسئلة سيتجاوز المسموح");
      return;
    }

    const payloadMarks = payload.reduce(
      (s, q) => s + (Number(q.marks) || 0),
      0,
    );
    const totalAfterMarks = existingMarksSum + payloadMarks;
    if (totalAfterMarks > totalMarks) {
      toast.error("إجمالي الدرجات سيتجاوز المسموح");
      return;
    }

    try {
      const json = await buildQuestionsJson(examId, payload);
      const res = await addQuestion.mutateAsync(json as any);
      if (res?.status) {
        toast.success("تم حفظ الأسئلة بنجاح");
        setPending([]);
        setDraft(emptyQuestion());
        onSuccess?.();
      } else {
        handleErrorAlerts(res?.error);
      }
    } catch (e: any) {
      handleErrorAlerts(e?.response?.data?.error);
    }
  };

  const removePending = (index: number) => {
    setPending((p) => p.filter((_, i) => i !== index));
  };

  const ensureOneCorrect = (index: number) => {
    setDraft((q) => ({
      ...q,
      answers: q.answers.map((ans, i) => ({ ...ans, is_correct: i === index })),
    }));
  };

  const removeLastAnswer = () => {
    setDraft((d) => {
      const next = { ...d, answers: d.answers.slice(0, -1) };
      if (next.answers.length && !next.answers.some((a) => a.is_correct)) {
        next.answers[0] = { ...next.answers[0], is_correct: true };
      }
      return next;
    });
  };

  const pendingMarks = useMemo(
    () => pending.reduce((s, q) => s + (Number(q.marks) || 0), 0),
    [pending],
  );

  const remainingQuestions = Math.max(
    0,
    (Number(questionsCount) || 0) -
      (Number(existingQuestionsCount) || 0) -
      pending.length,
  );

  const remainingMarks = Math.max(
    0,
    (Number(totalMarks) || 0) - (Number(existingMarksSum) || 0) - pendingMarks,
  );

  return (
    <div className="space-y-6">
      {/* Current question form */}
      <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-(--brand)">
        <p>
          إجمالي درجات الامتحان: <strong>{totalMarks}</strong> • المستخدم:{" "}
          <strong>{existingMarksSum + pendingMarks}</strong> • المتبقي:{" "}
          <strong>{remainingMarks}</strong> درجة
        </p>
        <p>
          إجمالي عدد أسئلة الامتحان: <strong>{questionsCount}</strong> •
          الموجودة: <strong>{existingQuestionsCount}</strong> • المضافة الآن
          (دفعة): <strong>{pending.length}</strong> • المتبقي:{" "}
          <strong>{remainingQuestions}</strong> سؤال
        </p>
        <h2 className="text-lg font-bold text-gray-800 my-4">إضافة سؤال</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-4 space-y-4">
            {/* Question text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص السؤال *
              </label>
              <textarea
                rows={3}
                value={draft.question_text}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, question_text: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="اكتب نص السؤال..."
              />
            </div>

            {/* Marks + image */}
            <div className="flex w-full justify-start items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الدرجات *
                </label>
                <input
                  type="number"
                  min={1}
                  value={draft.marks ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      marks: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full min-w-62.5 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex w-full justify-start items-center gap-4">
                <div className="h-17 flex items-center justify-center">
                  <label
                    htmlFor="question-img"
                    className="bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2.5 text-sm rounded-lg hover:from-orange-600 w-fit self-end hover:to-orange-700 transition-all block"
                  >
                    اضافة صورة
                  </label>
                  <input
                    id="question-img"
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                      setDraft((d) => ({
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
                {draft.image && (
                  <div className="mt-2">
                    <img
                      src={
                        draft.image instanceof File
                          ? URL.createObjectURL(draft.image)
                          : draft.image
                      }
                      alt="preview"
                      className="w-40 h-28 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Answers */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  الإجابات *
                </label>
                <span className="text-xs text-gray-500">
                  الصحيحة المختارة: {correctCount}
                </span>
              </div>

              <div className="space-y-3 w-full">
                {draft.answers.map((a, idx) => (
                  <div
                    key={idx}
                    className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 flex flex-col md:flex-row gap-3"
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
                          placeholder={`الخيار ${idx + 1}`}
                        />
                        <div className="flex flex-col items-center justify-start gap-2">
                          <div>
                            <label
                              htmlFor={`answer_${idx}`}
                              className="bg-linear-to-r from-(--brand) to-(--brand-light) text-white px-4 py-2 text-sm rounded-lg hover:from-(--brand-light) hover:to-(--brand) transition-all block"
                            >
                              اضافة صورة
                            </label>
                            <input
                              id={`answer_${idx}`}
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null;
                                setAnswer(idx, { image: file });
                                e.currentTarget.value = "";
                              }}
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
                    setDraft((d) => ({
                      ...d,
                      answers: [...d.answers, emptyAnswer()],
                    }))
                  }
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus size={14} /> إضافة خيار
                </button>

                {draft.answers.length > 1 && (
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
        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={onAddToBatch}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus size={16} /> إضافة سؤال آخر (للدفعة)
          </button>

          <button
            type="button"
            onClick={onSubmitAll}
            className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <Save size={16} />
            {pending.length
              ? `حفظ الدفعة (${pending.length + 1})`
              : "حفظ السؤال"}
          </button>
        </div>
      </div>

      {/* Pending preview */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-(--brand) p-4">
          <h3 className="font-bold text-gray-800 mb-3">الأسئلة في الدفعة</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {pending.map((q, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium text-gray-800 line-clamp-2">
                    {i + 1}. {q.question_text}
                  </div>
                  <button
                    onClick={() => removePending(i)}
                    className="text-red-600 hover:bg-red-50 rounded px-2 py-1 text-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {q.marks} درجة •{" "}
                  {q.answers.filter((a) => a.is_correct).length} صحيحة
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddQuestionsForm;
