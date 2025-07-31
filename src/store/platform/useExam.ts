import { create } from "zustand";
interface LessonState {
  startExam: boolean;
  setStartExam: (id: boolean) => void;
  isExamMode: boolean;
  setIsExamMode: (id: boolean) => void;
}

export const useExam = create<LessonState>((set) => ({
  startExam: false,
  setStartExam: (startExam: boolean) => {
    set({ startExam });
  },
  isExamMode: false,
  setIsExamMode: (isExamMode: boolean) => {
    set({ isExamMode });
  },
}));
