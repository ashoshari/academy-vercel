import { NavigateFunction } from "react-router";

const TOKEN_KEY = "user_tokens";

export function getStoredTokens(): string | null {
  try {
    const tokens = localStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch {
    return null;
  }
}

export async function storeTokens(
  tokens: string,
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void
): Promise<void> {
  await localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));

  setIsAuthenticated && setIsAuthenticated();

  navigate && navigate("/dashboard");
}

export async function removeTokens(
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void
): Promise<void> {
  await localStorage.removeItem(TOKEN_KEY);

  setIsAuthenticated && setIsAuthenticated();

  navigate && navigate("/", { replace: true });
}

export function isAuthenticated(): boolean {
  return !!getStoredTokens();
}
