import React, { useMemo, useState } from "react";
import { ArrowRight, Edit } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { Exam } from "../ExamsPage";
import QuestionsList from "@/components/dashboard/admin/questions/QuestionsList";
import AddQuestionsForm from "@/components/dashboard/admin/questions/AddQuestionsForm";
import QuestionPreview from "@/components/dashboard/admin/questions/QuestionPreview";
import QuestionEditForm from "@/components/dashboard/admin/questions/QuestionEditForm";
import { useCustomRemove } from "@/hooks/useMutation";
import toast from "react-hot-toast";
import handleErrorAlerts from "@/utils/showErrorMessages";

export interface Answers {
  id: string;
  answer_text: string;
  image: string | null | File;
  is_correct: boolean;
  explanation: string | null;
}

export interface ExamQuestion {
  id: string;
  question_text: string;
  image: string | null | File;
  marks: number;
  answers: Answers[];
}

export interface DraftAnswer extends Omit<Answers, "id"> {
  id?: string;
}

export interface DraftQuestion extends Omit<ExamQuestion, "id" | "answers"> {
  id?: string;
  answers: DraftAnswer[];
}

interface Props {
  exam: Exam;
  onBack: () => void;
}

type View = "list" | "add" | "preview" | "edit";

type SelectedQuestion = ExamQuestion & { index: number };

const ExamQuestionsPage: React.FC<Props> = ({ exam, onBack }) => {
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<SelectedQuestion | null>(null);

  const questionsData = useCustomQuery(
    `/training/admin/exams/${exam.id}/questions/`,
    ["exam-questions", exam.id],
  );

  const deleteQuestion = useCustomRemove(
    `/training/admin/exams-questions/${selected?.id}/`,
    ["exam-questions", exam.id],
  );
  const handleDelete = async () => {
    await deleteQuestion
      .mutateAsync()
      .then((res) => {
        if (res.status) {
          toast.success(res.message ?? "تم الحذف");
        } else toast.error(res.message ?? "فشل الحذف");
      })
      .catch((e) => handleErrorAlerts(e?.response?.data?.error));
  };

  const questions: ExamQuestion[] = questionsData?.data?.data ?? [];

  const toDraft = (q: SelectedQuestion): DraftQuestion & { index: number } => ({
    id: q.id,
    question_text: q.question_text,
    image: q.image,
    marks: q.marks,
    index: q.index,
    answers: (q.answers || []).map((a) => ({
      id: a.id,
      answer_text: a.answer_text,
      image: a.image,
      is_correct: a.is_correct,
      explanation: a.explanation,
    })),
  });

  const selectedDraft: (DraftQuestion & { index: number }) | null = useMemo(
    () => (selected ? toDraft(selected) : null),
    [selected],
  );

  const existingQuestionsCount = questions.length;
  const existingMarksSum = questions.reduce(
    (sum, q) => sum + (Number(q.marks) || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            if (view === "list") {
              onBack();
            } else {
              setView("list");
            }
          }}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight size={20} />
        </button>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {view === "list"
                ? "إدارة أسئلة الامتحان"
                : view === "add"
                  ? "اضافة سؤال جديد"
                  : view === "edit"
                    ? "تعديل السؤال"
                    : view === "preview"
                      ? "معاينة السؤال"
                      : ""}
            </h1>
            <p className="text-gray-600 text-sm">
              {view === "list"
                ? exam.title
                : `السؤال رقم ${(selected?.index as number) + 1} - ${
                    exam.title
                  }`}
            </p>
          </div>
          {view === "preview" && (
            <button
              onClick={() => {
                setView("edit");
              }}
              className="btn-brand-slide px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <Edit size={16} />
              تعديل السؤال
            </button>
          )}
        </div>
      </div>

      {view === "list" && (
        <QuestionsList
          questions={questions}
          onAdd={() => setView("add")}
          onPreview={(q: ExamQuestion, idx: number) => {
            setSelected({ ...q, index: idx });
            setView("preview");
          }}
          onEdit={(q: ExamQuestion, idx: number) => {
            setSelected({ ...q, index: idx });
            setView("edit");
          }}
          onDelete={(q: ExamQuestion, idx: number) => {
            setSelected({ ...q, index: idx });
            handleDelete();
          }}
        />
      )}

      {view === "add" && (
        <AddQuestionsForm
          examId={exam.id}
          questionsCount={exam.number_of_questions}
          totalMarks={exam.total_marks}
          existingQuestionsCount={existingQuestionsCount}
          existingMarksSum={existingMarksSum}
          onCancel={() => setView("list")}
          onSuccess={() => setView("list")}
        />
      )}

      {view === "preview" && selectedDraft && (
        <div className="space-y-4">
          <QuestionPreview question={selectedDraft} />
          <div className="flex items-center justify-end">
            <button
              onClick={() => setView("list")}
              className="cursor-pointer px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {view === "edit" && selectedDraft && (
        <QuestionEditForm
          examId={exam.id}
          question={selectedDraft}
          onCancel={() => setView("list")}
          onSuccess={() => setView("list")}
        />
      )}
    </div>
  );
};

export default ExamQuestionsPage;
