declare global {
  interface Window { env: any }
}

export const AUTH_CHANGE_EVENT = "auth-change";

function emitAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  }
}

function getAuthApiBase() {
  if (typeof window !== "undefined" && window.env?.NEXT_PUBLIC_API_URL) {
    return window.env.NEXT_PUBLIC_API_URL;
  }
  return "";
}

export async function login(username: string, password: string): Promise<{ token?: string; error?: string }> {
  const res = await fetch(`${getAuthApiBase()}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (res.ok) {
    const data = await res.json();
    localStorage.setItem("auth_token", data.token);
    emitAuthChange();
    return { token: data.token };
  } else {
    const err = await res.json().catch(() => ({}));
    return { error: err.error || "Login failed" };
  }
}

export function logout() {
  localStorage.removeItem("auth_token");
  emitAuthChange();
}

export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

export async function getMe(): Promise<{ username?: string; error?: string }> {
  const token = getToken();
  if (!token) return { error: "No token" };
  const res = await fetch(`${getAuthApiBase()}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    return await res.json();
  } else {
    return { error: "Not authenticated" };
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
} 