// export interface StoredUser {
//   id?: string;
//   name?: string;
//   email?: string;
// }

// function decodeJwtExp(token: string): number | null {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return typeof payload.exp === "number" ? payload.exp * 1000 : null;
//   } catch {
//     return null;
//   }
// }

// export function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   const token = localStorage.getItem("token");
//   if (!token) return null;

//   const expMs = decodeJwtExp(token);
//   if (expMs && Date.now() >= expMs) {
//     clearAuth();
//     return null;
//   }
//   return token;
// }

// export function getUser(): StoredUser | null {
//   if (typeof window === "undefined") return null;
//   if (!getToken()) return null;
//   try {
//     return JSON.parse(localStorage.getItem("user") || "null");
//   } catch {
//     return null;
//   }
// }

// export function getGuestId(): string {
//   if (typeof window === "undefined") return "";
//   return localStorage.getItem("guestId") || "";
// }

// export function isLoggedIn(): boolean {
//   return !!getToken();
// }

// export function clearAuth() {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// }
// lib/auth.ts
// Tiện ích dùng chung cho việc kiểm tra & xử lý phiên đăng nhập (JWT trong localStorage).
// Mục tiêu: mọi nơi trong app (Header, Checkout, các trang khác...) đều
// dùng CHUNG một nguồn sự thật để biết "user có thực sự đang đăng nhập không",
// thay vì mỗi nơi tự suy đoán một kiểu (gây ra tình trạng Header vẫn hiện tên
// nhưng gọi API lại bị 401).

export interface DecodedToken {
  exp?: number;
  id?: string;
  [key: string]: unknown;
}

/**
 * Giải mã JWT phía client (KHÔNG xác thực chữ ký).
 * Chỉ dùng để đọc claim như `exp`, không dùng cho mục đích bảo mật.
 */
export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join(""),
      ),
    );
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Token có tồn tại VÀ còn hạn hay không.
 * Đây là hàm nên dùng thay cho việc chỉ check `localStorage.getItem("token")`.
 */
export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  const nowInSeconds = Date.now() / 1000;
  return decoded.exp > nowInSeconds;
}

/**
 * Xoá toàn bộ dữ liệu đăng nhập khỏi localStorage và bắn sự kiện
 * "auth:expired" để các component đang mở (Header...) tự cập nhật UI
 * ngay lập tức, không cần reload trang.
 */
export function clearAuthSession(reason?: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new CustomEvent("auth:expired", { detail: { reason } }));
}

/**
 * Kiểm tra token đang lưu trong localStorage.
 * Nếu token hết hạn/không hợp lệ -> tự dọn dẹp session và trả về false.
 * Gọi hàm này ở Header (và bất kỳ đâu cần biết trạng thái đăng nhập thật)
 * thay vì chỉ đọc key "user".
 */
export function validateStoredSession(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  if (!isTokenValid(token)) {
    if (token) clearAuthSession("expired");
    return false;
  }
  return true;
}