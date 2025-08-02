import { create } from "zustand";
interface LessonState {
  id: string;
  setId: (id: string) => void;
}

export const useLesson = create<LessonState>((set) => ({
  id: "",
  setId: (id: string) => {
    set({ id });
  },
}));
