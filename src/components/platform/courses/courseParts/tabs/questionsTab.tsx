import {
  MessageSquare,
  Plus,
  CheckCircle2,
  ThumbsUp,
  Reply,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLesson } from "@/store/platform/useLesson";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/platform/usePlatformMutation";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import { useParams } from "react-router";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import handleErrorAlerts from "@/utils/showErrorMessages";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
const QuestionsTab = () => {
  const queryClient = useQueryClient();
  const { courseId } = useParams();
  // GET QUESTIONS and comments
  const { data } = useCustomQuery(`/training/students/course/${courseId}/`, [
    "courses",
  ]);
  const questionsData = data?.data?.questions;
  const [courseQuestions, setCourseQuestions] = useState<any>([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  // questions
  const [editingQuetionId, setEditingQuestionId] = useState(null);
  const [questionId, setQuestionId] = useState("");
  const [editQuestionTitle, setEditQuestionTitle] = useState("");
  const [editQuestionContent, setEditQuestionContent] = useState("");

  useEffect(() => {
    if (data?.data?.questions) {
      setCourseQuestions(data?.data?.questions);
    }
  }, [data?.data?.questions]);

  //comments
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentId, setcommentId] = useState();
  const [editCommentContent, setEditCommentContent] = useState("");

  const currentLesson = useLesson((state) => state.currentLesson);

  // POST QUESTION
  const { mutateAsync: postQuestions } = useCustomPost(
    "/training/students/questions/",
    ["questions"],
  );

  // POST comments
  const { mutateAsync: postComments } = useCustomPost(
    "/training/students/questions/comments/",
    ["comments"],
  );

  useEffect(() => {
    if (questionsData) {
      setCourseQuestions(questionsData);
    }
  }, [data?.data?.questions]);
  const handleAddQuestion = async () => {
    if (newQuestionTitle.trim() && newQuestionContent.trim()) {
      const question: any = {
        title: newQuestionTitle,
        content: newQuestionContent,
        lesson: currentLesson?.id,
      };
      const response = await postQuestions(question);
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      setCourseQuestions((prev: any) => [response.data, ...prev]);
      setNewQuestionTitle("");
      setNewQuestionContent("");
      setShowAddQuestion(false);
    }
  };
  // POST LIKES
  const { mutateAsync: postLikes } = useCustomPost(
    "/training/students/questions/comments-like/",
    ["likes"],
  );

  // POST APPROVE
  const { mutateAsync: postApprove } = useCustomPost(
    "/training/students/questions/comments-approve/",
    ["approve"],
  );

  const handleLikecomment = async (questionId: string, commentId: string) => {
    const comment_id = {
      comment_id: commentId,
    };
    try {
      await postLikes(comment_id);
      setCourseQuestions((prev: any) => {
        return prev?.map((q: any) => {
          if (q.id === questionId) {
            return {
              ...q,
              comments: q?.comments?.map((a: any) => {
                if (a.id === commentId) {
                  return {
                    ...a,
                    likes: a.is_liked ? a.likes - 1 : a.likes + 1,
                    is_liked: !a.is_liked,
                  };
                }
                return a;
              }),
            };
          }
          return q;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    } catch (error) {
      console.error("Failed to send like:", error);
    }
  };
  const handleApprovecomment = async (questionId: any, commentId: any) => {
    const comment_id = {
      comment_id: commentId,
    };
    try {
      const response = await postApprove(comment_id);
      setCourseQuestions((prev: any) => {
        return prev?.map((q: any) => {
          if (q.id === questionId) {
            return {
              ...q,
              comments: q?.comments?.map((a: any) => {
                if (a.id === commentId) {
                  return {
                    ...a,
                    approve: a.is_approved ? a.likes - 1 : a.approved + 1,
                    is_approved: !a.is_approved,
                  };
                }
                return a;
              }),
            };
          }
          return q;
        });
      });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      if (response.status) {
        toast.success(response?.data);
      } else {
        toast.error(response?.error);
      }
    } catch (error) {
      console.error("Failed to send like:", error);
      handleErrorAlerts("حدث خطأ في اعتماد الإجابة");
    }
    // setCourseQuestions((prev: any) =>
    //   prev?.map((q: any) =>
    //     q.id === questionId
    //       ? {
    //           ...q,
    //           comments: q.comments.map((a: any) =>
    //             a.id === commentId
    //               ? { ...a, isTeacherApproved: !a.isTeacherApproved }
    //               : a
    //           ),
    //           isResolved: true,
    //         }
    //       : q
    //   )
    // );
  };
  const handleAddcomment = async (questionId: any) => {
    if (newComment.trim()) {
      const comment = {
        content: newComment,
        question_id: questionId,
      };
      try {
        const response = await postComments(comment);
        setCourseQuestions((prev: any) =>
          prev.map((q: any) =>
            q.id === questionId
              ? { ...q, comments: [...q?.comments, response?.data] }
              : q,
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      } catch (error) {
        console.log(error);
      }

      setNewComment("");
      setSelectedQuestion(null);
    }
  };

  // EDIT QUESTION
  const { mutateAsync: putQuestion } = useCustomUpdate(
    `/training/students/questions/${questionId}/`,
    ["putQuestions"],
  );
  const handleEditQuestion = async () => {
    if (editQuestionTitle.trim() || editQuestionContent.trim()) {
      const question: any = {
        title: editQuestionTitle,
        content: editQuestionContent,
      };
      try {
        const response = await putQuestion(question);
        setCourseQuestions((prev: any) =>
          prev.map((question: any) =>
            question.id === questionId ? response?.data : question,
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      } catch (error) {
        console.log(error);
        handleErrorAlerts("حدث خطأ في تعديل الأسئلة");
      }

      setEditQuestionTitle("");
      setEditQuestionContent("");
      setEditingQuestionId(null);
    }
  };

  // DELETE QUESTION
  const { mutateAsync: deleteQuestion } = useCustomRemove(
    `/training/students/questions/${questionId}/`,
    ["delQuestions"],
  );
  const handleDeleteQuestion = async (questionId: any) => {
    try {
      await deleteQuestion();
      setCourseQuestions((prev: any) =>
        prev.filter((question: any) => question?.id !== questionId),
      );
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    } catch (error) {
      console.log(error);
      handleErrorAlerts("حدث خطأ في حذف السؤال");
    }
  };

  // EDIT COMMENT
  const { mutateAsync: putComment } = useCustomUpdate(
    `training/students/questions/comments/${commentId}/`,
    ["putComment"],
  );
  const handleEditComment = async (questionId: any, commentId: any) => {
    if (editCommentContent.trim()) {
      const comment: any = {
        content: editCommentContent,
      };
      try {
        const response = await putComment(comment);
        setCourseQuestions((prev: any) =>
          prev.map((question: any) => {
            if (question.id === questionId) {
              return {
                ...question,
                comments: question.comments.map((c: any) =>
                  c.id === commentId ? response.data : c,
                ),
              };
            }
            return question;
          }),
        );
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      } catch (error) {
        console.log(error);
        handleErrorAlerts("حدث خطأ في تعديل الأسئلة");
      }
      setEditCommentContent("");
      setEditingCommentId(null);
    }
  };

  // DELETE COMMENT
  const { mutateAsync: deleteComment } = useCustomRemove(
    `training/students/questions/comments/${commentId}/`,
    ["delComment"],
  );
  const handleDeleteComment = async (questionId: any, commentId: any) => {
    try {
      await deleteComment();
      setCourseQuestions((prev: any) =>
        prev.map((question: any) => {
          if (question.id === questionId) {
            return {
              ...question,
              comments: question.comments.filter(
                (comment: any) => comment.id !== commentId,
              ),
            };
          }
          return question;
        }),
      );
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    } catch (error: any) {
      handleErrorAlerts(
        error?.response?.data?.message || "حدث خطأ في حذف السؤال",
      );
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">الأسئلة</h2>
        <button
          onClick={() => setShowAddQuestion(true)}
          className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white px-4 py-2 rounded-xl font-semibold hover:from-(--brand-secondary-dark) hover:to-(--brand-secondary) cursor-pointer transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>اطرح سؤالاً</span>
        </button>
      </div>

      {/* Add Question Form */}
      {showAddQuestion && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">طرح سؤال جديد</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newQuestionTitle}
              onChange={(e) => setNewQuestionTitle(e.target.value)}
              placeholder="عنوان السؤال"
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300"
            />
            <textarea
              value={newQuestionContent}
              onChange={(e) => setNewQuestionContent(e.target.value)}
              placeholder="تفاصيل السؤال..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 resize-none"
              rows={4}
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              {currentLesson && (
                <span>سيتم ربط السؤال بالدرس: {currentLesson.title}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddQuestion}
                disabled={
                  !newQuestionTitle.trim() || !newQuestionContent.trim()
                }
                className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                نشر السؤال
              </button>
              <button
                onClick={() => {
                  setShowAddQuestion(false);
                  setNewQuestionTitle("");
                  setNewQuestionContent("");
                }}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {courseQuestions?.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد أسئلة بعد</p>
          </div>
        ) : (
          courseQuestions?.map((question: any) => (
            <div
              key={question?.id}
              className="border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="w-full flex justify-between items-center space-x-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {question?.title}
                    </h3>
                    <div className="">
                      <button
                        onClick={() => {
                          setEditQuestionTitle("");
                          setEditQuestionContent("");
                          setEditingQuestionId(
                            editingQuetionId === question?.id
                              ? null
                              : question?.id,
                          );
                          setQuestionId(question?.id);
                        }}
                        className="p-2 text-(--brand-secondary) cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setQuestionId(question?.id);
                          handleDeleteQuestion(question?.id);
                        }}
                        className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* {question.isResolved && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        محلول
                      </span>
                    )} */}
                  </div>
                  <p className="text-gray-700 mb-3">{question?.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>بواسطة: {question?.user}</span>
                    <span>
                      اخر تعديل:{" "}
                      {formatDateTimeSimple(
                        question?.created_at == question?.updated_at
                          ? question?.created_at
                          : question?.updated_at,
                      )}
                    </span>
                    {question.lesson && (
                      <span className="bg-blue-100 text-(--brand-secondary) px-2 py-1 rounded-lg">
                        {question?.lesson}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Edit questions */}
              {editingQuetionId && question?.id == questionId && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    تعديل سؤال{" "}
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editQuestionTitle}
                      onChange={(e) => setEditQuestionTitle(e.target.value)}
                      placeholder="عنوان السؤال"
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300"
                    />
                    <textarea
                      value={editQuestionContent}
                      onChange={(e) => setEditQuestionContent(e.target.value)}
                      placeholder="تفاصيل السؤال..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 resize-none"
                      rows={4}
                    />
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="flex w-full justify-end space-x-3">
                      <button
                        onClick={handleEditQuestion}
                        disabled={
                          !editQuestionTitle.trim() ||
                          !editQuestionContent.trim()
                        }
                        className="bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        تعديل السؤال
                      </button>
                      <button
                        onClick={() => {
                          setEditingQuestionId(null);
                          setEditQuestionTitle("");
                          setEditQuestionContent("");
                        }}
                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* comments */}
              <div className="space-y-4 mb-4 ">
                {question?.comments?.map((comment: any) => (
                  <div key={comment.id}>
                    <div
                      key={comment.id}
                      className={`p-4 rounded-xl border   ${
                        comment.is_approved
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className={`flex items-start justify-between mb-3`}>
                        <div className="flex-1">
                          <p className="text-gray-900 mb-2">
                            {comment?.content}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>بواسطة: {comment?.user}</span>
                            <span>
                              {formatDateTimeSimple(comment?.created_at)}
                            </span>
                            {comment?.is_approved && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>معتمد من الأستاذ</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="">
                          <button
                            onClick={() => {
                              setEditCommentContent("");
                              setEditingCommentId(
                                editingCommentId === comment?.id
                                  ? null
                                  : comment?.id,
                              );
                              setcommentId(comment?.id);
                            }}
                            className="p-2 text-(--brand-secondary) cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setcommentId(comment?.id);
                              handleDeleteComment(question?.id, comment?.id);
                            }}
                            className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-200"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() =>
                            handleLikecomment(question.id, comment.id)
                          }
                          className={`flex items-center space-x-1 text-${
                            comment?.is_liked ? "blue-500" : "gray-500"
                          } hover:text-(--brand-secondary) transition-colors duration-200`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment?.likes}</span>
                        </button>
                        <button
                          onClick={() =>
                            handleApprovecomment(question.id, comment.id)
                          }
                          className={`flex items-center space-x-1 transition-colors duration-200 ${
                            comment?.is_approved
                              ? "text-green-600 hover:text-green-700"
                              : "text-gray-600 hover:text-green-600"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>
                            {comment?.is_approved ? "معتمد" : "اعتماد"}
                          </span>
                        </button>
                      </div>
                    </div>
                    {/* Edit Comment */}
                    <div className=" border-gray-200 pt-4">
                      {editingCommentId && commentId === comment.id && (
                        <div className="space-y-3">
                          <textarea
                            value={editCommentContent}
                            onChange={(e) =>
                              setEditCommentContent(e.target.value)
                            }
                            placeholder="اكتب إجابتك..."
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 resize-none"
                            rows={3}
                          />
                          <div className="flex space-x-3">
                            <button
                              onClick={() =>
                                handleEditComment(question.id, comment.id)
                              }
                              disabled={!editCommentContent.trim()}
                              className="bg-linear-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              تعديل الإجابة
                            </button>
                            <button
                              onClick={() => {
                                setSelectedQuestion(null);
                                setEditingCommentId(null);
                                setNewComment("");
                              }}
                              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div className="border-t border-gray-200 pt-4">
                {selectedQuestion?.id === question.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="اكتب إجابتك..."
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-(--brand) focus:border-(--brand-light) transition-all duration-300 resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAddcomment(question.id)}
                        disabled={!newComment.trim()}
                        className="bg-linear-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إرسال الإجابة
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuestion(null);
                          setNewComment("");
                        }}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedQuestion(question)}
                    className="flex items-center space-x-2 cursor-pointer text-(--brand-secondary) hover:text-blue-700 transition-colors duration-200"
                  >
                    <Reply className="w-4 h-4" />
                    <span>إضافة إجابة</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionsTab;
