import React, { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useCustomQuery } from "@/hooks/useQuery";
import { Exam } from "../ExamsPage";
import QuestionsList from "@/components/dashboard/admin/questions/QuestionsList";
import AddQuestionsForm from "@/components/dashboard/admin/questions/AddQuestionsForm";
import QuestionPreview from "@/components/dashboard/admin/questions/QuestionPreview";
import QuestionEditForm from "@/components/dashboard/admin/questions/QuestionEditForm";

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

const ExamQuestionsPage: React.FC<Props> = ({ exam, onBack }) => {
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<ExamQuestion | null>(null);

  const questionsData = useCustomQuery(
    `/training/admin/exams/${exam.id}/questions/`,
    ["exam-questions", exam.id]
  );

  const questions: ExamQuestion[] = questionsData?.data?.data ?? [];

  const toDraft = (q: ExamQuestion): DraftQuestion => ({
    id: q.id,
    question_text: q.question_text,
    image: q.image,
    marks: q.marks,
    answers: (q.answers || []).map((a) => ({
      id: a.id,
      answer_text: a.answer_text,
      image: a.image,
      is_correct: a.is_correct,
      explanation: a.explanation,
    })),
  });

  const selectedDraft: DraftQuestion | null = useMemo(
    () => (selected ? toDraft(selected) : null),
    [selected]
  );

  const existingQuestionsCount = questions.length;
  const existingMarksSum = questions.reduce(
    (sum, q) => sum + (Number(q.marks) || 0),
    0
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
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {view === "list"
              ? "إدارة أسئلة الامتحان"
              : view === "add"
              ? "اضافة سؤال جديد"
              : view === "edit"
              ? "تعديل السؤال"
              : view === "preview"
              ? "تفاصيل السؤال"
              : ""}
          </h1>
          <p className="text-gray-600 text-sm">{exam.title}</p>
        </div>
      </div>

      {view === "list" && (
        <QuestionsList
          questions={questions}
          onAdd={() => setView("add")}
          onPreview={(q) => {
            setSelected(q);
            setView("preview");
          }}
          onEdit={(q) => {
            setSelected(q);
            setView("edit");
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
              className="px-5 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
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
