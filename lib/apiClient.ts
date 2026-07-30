// lib/apiClient.ts
// Wrapper quanh fetch() dùng cho MỌI request cần đăng nhập (địa chỉ, đơn hàng,
// profile...). Lý do cần file này: trước đây mỗi trang tự gọi fetch() riêng,
// nên khi token hết hạn, mỗi nơi xử lý lỗi 401 một kiểu khác nhau (hoặc không
// xử lý gì cả) -> user bị kẹt với lỗi mà không biết vì sao, phải tự đăng xuất
// rồi đăng nhập lại mới thanh toán được.
//
// apiFetch() giải quyết việc đó ở MỘT chỗ duy nhất:
// 1. Nếu token trong localStorage đã hết hạn -> chặn lại, không gọi API,
//    dọn session và báo lỗi rõ ràng (SESSION_EXPIRED).
// 2. Nếu server trả 401 (token bị BE từ chối vì bất kỳ lý do gì) -> cũng
//    dọn session và báo lỗi rõ ràng.
// Nơi gọi (Checkout, v.v.) chỉ cần bắt lỗi `err.code === "SESSION_EXPIRED"`
// và điều hướng sang trang login.

import { clearAuthSession, isTokenValid } from "./auth";

export class SessionExpiredError extends Error {
  code = "SESSION_EXPIRED" as const;
  constructor(message = "Phiên đăng nhập đã hết hạn") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

interface ApiFetchOptions extends RequestInit {
  /** Set false nếu muốn tự xử lý lỗi 401 thay vì để apiFetch throw. */
  autoHandleAuthError?: boolean;
}

export async function apiFetch(
  path: string,
  options: ApiFetchOptions = {},
): Promise<Response> {
  const { autoHandleAuthError = true, ...fetchOptions } = options;
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Chặn sớm: token còn trong storage nhưng đã hết hạn -> không gọi API vô ích
  if (token && !isTokenValid(token) && autoHandleAuthError) {
    clearAuthSession("expired");
    throw new SessionExpiredError();
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const res = await fetch(`${baseUrl}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(fetchOptions.headers || {}),
    },
  });

  if (res.status === 401 && autoHandleAuthError) {
    clearAuthSession("expired");
    throw new SessionExpiredError();
  }

  return res;
}
