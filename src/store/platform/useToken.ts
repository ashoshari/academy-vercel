import { create } from "zustand";

interface TokenState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setTokens: (access: string) => void;
  clearTokens: () => void;
}

// Read token from localStorage once during store initialization
const initialAccessToken = localStorage.getItem("accessToken");

const useTokenStore = create<TokenState>((set) => ({
  accessToken: initialAccessToken,
  isLoggedIn: !!initialAccessToken,

  setTokens: (access) => {
    localStorage.setItem("accessToken", access);
    set({
      accessToken: access,
      isLoggedIn: true,
    });
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken");
    set({
      accessToken: null,
      isLoggedIn: false,
    });
  },
}));

export default useTokenStore;

