export interface StoredUser {
  id?: string;
  name?: string;
  email?: string;
}

function decodeJwtExp(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  const expMs = decodeJwtExp(token);
  if (expMs && Date.now() >= expMs) {
    clearAuth();
    return null;
  }
  return token;
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  if (!getToken()) return null;
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function getGuestId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("guestId") || "";
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}