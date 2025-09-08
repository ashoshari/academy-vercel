import { useLesson } from "@/store/platform/useLesson";
import { useParams } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import CoreExam from "@/components/platform/exams/coreExam";
const Exam = ({ markLessonComplete }: any) => {
  // const setStartExam = useExam((state) => state.setStartExam);
  const { courseId } = useParams();
  const currentLesson = useLesson((state) => state.currentLesson);
  // GET EXAM
  const { data, error } = useCustomQuery(
    `/training/students/course/exam/${currentLesson?.exam}/${courseId}/`,
    ["exams", courseId]
  );
  const examData = data?.data;
  console.log('examData', examData);
  // POST SUBMIT EXAM
  const { mutateAsync: postExam } = useCustomPost(
    `/training/students/course/exam/${currentLesson?.exam}/${courseId}/submit/`,
    ["postExam"]
  );

  if (!examData) return null;
  return (
    <>
      <CoreExam
        examData={examData}
        examError={error}
        postExam={postExam}
        course={true}
        markLessonComplete={markLessonComplete}
        currentLesson={currentLesson}
      />
    </>
  );
};

export default Exam;
