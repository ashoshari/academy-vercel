import { DraftQuestion } from "@/pages/dashboard/admin/exams/questions/QuestionsPage";

export function buildQuestionsFormData(
  examId: string | number,
  questions: DraftQuestion[]
): FormData {
  const fd = new FormData();
  fd.append("exam", String(examId));

  questions.forEach((q, qi) => {
    if (q.id) fd.append(`questions[${qi}][id]`, q.id);
    fd.append(`questions[${qi}][question_text]`, q.question_text ?? "");
    fd.append(`questions[${qi}][marks]`, String(q.marks ?? 0));
    if (q.image) fd.append(`questions[${qi}][image]`, q.image);

    q.answers.forEach((a, ai) => {
      if (a.id) fd.append(`questions[${qi}][answers][${ai}][id]`, a.id);
      fd.append(
        `questions[${qi}][answers][${ai}][answer_text]`,
        a.answer_text ?? ""
      );
      fd.append(
        `questions[${qi}][answers][${ai}][is_correct]`,
        String(!!a.is_correct)
      );
      if (a.explanation != null && a.explanation !== "") {
        fd.append(
          `questions[${qi}][answers][${ai}][explanation]`,
          a.explanation
        );
      }
      if (a.image) {
        fd.append(`questions[${qi}][answers][${ai}][image]`, a.image);
      }
    });
  });

  return fd;
}

export function buildSingleQuestionFormData(question: DraftQuestion): FormData {
  const fd = new FormData();
  if (question.id) fd.append("id", question.id);
  fd.append("question_text", question.question_text ?? "");
  fd.append("marks", String(question.marks ?? 0));
  if (question.image) fd.append("image", question.image);

  question.answers.forEach((a, i) => {
    if (a.id) fd.append(`answers[${i}][id]`, a.id);
    fd.append(`answers[${i}][answer_text]`, a.answer_text ?? "");
    fd.append(`answers[${i}][is_correct]`, String(!!a.is_correct));
    if (a.explanation != null && a.explanation !== "") {
      fd.append(`answers[${i}][explanation]`, a.explanation);
    }
    if (a.image) fd.append(`answers[${i}][image]`, a.image);
  });

  return fd;
}
