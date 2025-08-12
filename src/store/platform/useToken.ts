import { create } from "zustand";

interface TokenState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setTokens: (access: string) => void;
  clearTokens: () => void;
}

// Read token from localStorage once during store initialization
const initialAccessToken = localStorage.getItem("platform_auth_tokens");

const useTokenStore = create<TokenState>((set) => ({
  accessToken: initialAccessToken,
  isLoggedIn: !!initialAccessToken,

  setTokens: (access) => {
    localStorage.setItem("platform_auth_tokens", access);
    set({
      accessToken: access,
      isLoggedIn: true,
    });
  },

  clearTokens: () => {
    localStorage.removeItem("platform_auth_tokens");
    set({
      accessToken: null,
      isLoggedIn: false,
    });
  },
}));

export default useTokenStore;

