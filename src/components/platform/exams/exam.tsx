// import { useLesson } from "@/store/platform/useLesson";
import { useParams } from "react-router";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { useCustomPost } from "@/hooks/platform/usePlatformMutation";
import CoreExam from "./coreExam";

const Exam = () => {
  // const setStartExam = useExam((state) => state.setStartExam);
  const { examId } = useParams();

  // GET EXAM
  const { data, error } = useCustomQuery(
    `/training/students/course/exam/${examId}/`,
    ["exams", examId]
  );
  const examData = data?.data;
  // POST SUBMIT EXAM
  const { mutateAsync: postExam } = useCustomPost(
    `/training/students/course/exam/${examData?.id}/submit/`,
    ["postExam"]
  );

  if (!examData && !error) return null;
  return <CoreExam examData={examData} examError={error} postExam={postExam} />;
};

export default Exam;
