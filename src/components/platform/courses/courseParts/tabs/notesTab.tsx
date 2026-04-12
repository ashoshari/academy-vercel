import {
  Plus,
  StickyNote,
  Clock,
  Trash2,
  Pencil,
  BookOpen,
  SquarePen,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCustomQuery } from "@/hooks/platform/usePlatformQuery";
import {
  useCustomPost,
  useCustomRemove,
  useCustomUpdate,
} from "@/hooks/platform/usePlatformMutation";
import { useParams } from "react-router";
import { useLesson } from "@/store/platform/useLesson";
import { formatDateTimeSimple } from "@/utils/formatDateTime";
import handleErrorAlerts from "@/utils/showErrorMessages";
import { useQueryClient } from "@tanstack/react-query";

const TextNotes = () => {
  const queryClient = useQueryClient();
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");

  const [editingNoteId, setEditingNoteId] = useState(null);

  const [editNote, setEditNote] = useState("");
  const [noteId, setNoteId] = useState();
  const currentLesson = useLesson((state) => state.currentLesson);
  const token = window.localStorage.getItem("platform_auth_tokens");
  const { courseId } = useParams();

  //GET NOTES
  const { data } = useCustomQuery(
    `/training/students/course/${courseId}/`,
    ["courses", courseId],
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const [notes, setNotes] = useState<any>([]);

  useEffect(() => {
    if (data?.data?.notes) {
      setNotes(data?.data?.notes);
    }
  }, [data?.data?.notes]);
  // POST NOTE
  const { mutateAsync: postNote } = useCustomPost("/training/students/notes/", [
    "addNotes",
  ]);
  // DELETE NOTE
  const { mutateAsync: deleteNote } = useCustomRemove(
    `/training/students/notes/${noteId}/`,
    ["delNotes"],
  );

  const handleDeleteNote = async (noteId: any) => {
    try {
      await deleteNote();
      setNotes((prev: any) => prev.filter((note: any) => note.id !== noteId));
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
    } catch (error) {
      console.log(error);
      handleErrorAlerts("حدث خطأ في حذف الملاحظة");
    }
  };
  // PUT NOTE
  const { mutateAsync: putNote } = useCustomUpdate(
    `/training/students/notes/${noteId}/`,
    ["putNotes"],
  );
  const handleEditNote = async () => {
    if (editNote.trim()) {
      const note: any = {
        note: editNote,
      };
      try {
        const response = await putNote(note);
        setNotes((prev: any) =>
          prev.map((note: any) => (note.id === noteId ? response?.data : note)),
        );
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      } catch (error: any) {
        handleErrorAlerts(
          error?.response?.data?.message || "حدث خطاء في تعديل الملاحظة",
        );
      }
      setEditNote("");
      setEditingNoteId(null);
    }
  };
  const handleAddNote = async () => {
    if (newNote.trim()) {
      const note: any = {
        note: newNote,
        lesson: currentLesson?.id,
      };
      try {
        const response = await postNote(note);
        setNotes((prev: any) => [response.data, ...prev]);
        queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      } catch (error: any) {
        console.error("حدث خطأ في إضافة الملاحظة:", error);
      }
      setNewNote("");
      // setAddNote("");
      setShowAddNote(false);
    }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">الملاحظات</h2>
        <button
          onClick={() => setShowAddNote(true)}
          className="cursor-pointer bg-linear-to-r from-(--brand-secondary) to-(--brand-secondary-dark) text-white px-4 py-2 rounded-xl font-semibold hover:from-(--brand-secondary-dark) hover:to-(--brand-secondary) transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة ملاحظة</span>
        </button>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            إضافة ملاحظة جديدة
          </h3>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="اكتب ملاحظتك هنا..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 resize-none"
            rows={4}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              {currentLesson && (
                <span>سيتم ربط الملاحظة بالدرس: {currentLesson?.title}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="cursor-pointer bg-linear-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                حفظ
              </button>
              <button
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote("");
                }}
                className="cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-4">
        {notes?.length === 0 ? (
          <div className="text-center py-12">
            <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد ملاحظات بعد</p>
          </div>
        ) : (
          notes?.map((note: any) => (
            <div
              key={note?.id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-900 leading-relaxed mb-3">
                    {note?.note}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTimeSimple(note?.created_at)}</span>
                      </div>
                      {note?.updated_at !== note?.created_at && (
                        <div className="flex items-center space-x-1">
                          <SquarePen className="w-4 h-4" />
                          <span>{formatDateTimeSimple(note?.updated_at)}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      {note.lesson && (
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{note?.lesson}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{note?.user}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setEditNote("");
                      setEditingNoteId(
                        editingNoteId === note?.id ? null : note?.id,
                      );
                      setNoteId(note?.id);
                    }}
                    className="cursor-pointer p-2 text-(--brand-secondary) hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setNoteId(note?.id);
                      handleDeleteNote(note?.id);
                    }}
                    className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Edit Note */}
              {editingNoteId && note?.id == noteId && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    تعديل الملاحظة
                  </h3>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="قم تعديل الملاحظة هنا ..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 resize-none"
                    rows={4}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="w-full flex justify-end space-x-3">
                      <button
                        onClick={handleEditNote}
                        disabled={!editNote.trim()}
                        className="cursor-pointer bg-linear-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditNote("");
                        }}
                        className="cursor-pointer border border-gray-300 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TextNotes;
