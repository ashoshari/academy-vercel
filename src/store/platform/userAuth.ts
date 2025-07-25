import { create } from "zustand";

interface UserAuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
}
const useUserAuthStore = create<UserAuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
}));

export default useUserAuthStore;
