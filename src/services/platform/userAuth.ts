import { NavigateFunction } from "react-router";

const TOKEN_KEY = ["user_tokens", "admin_tokens"];

export function getStoredTokens(): string | null {
  try {
    const tokens = localStorage.getItem(TOKEN_KEY[0]);
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
  await localStorage.setItem(TOKEN_KEY[0], JSON.stringify(tokens));

  setIsAuthenticated && setIsAuthenticated();

  navigate && navigate("/dashboard");
}

export async function removeTokens(
  navigate?: NavigateFunction,
  setIsAuthenticated?: () => void
): Promise<void> {
  await localStorage.removeItem(TOKEN_KEY[0]);
  await localStorage.removeItem("company_domian");

  setIsAuthenticated && setIsAuthenticated();

  navigate && navigate("/", { replace: true });
}

export function isAuthenticated(): boolean {
  return !!getStoredTokens();
}
