"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        setLoading(false);
        return;
      }

      // Đăng ký xong -> tự động đăng nhập luôn (backend đã trả token)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Merge giỏ hàng khách (guest) vào tài khoản mới nếu có
      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/merge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId, userId: data.user.id }),
        });
        localStorage.removeItem("guestId");
      }

      window.dispatchEvent(new Event("cart-updated"));

      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const redirectParam = searchParams.get("redirect");
  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng ký</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Họ và tên</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Nhập lại mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <p className="text-sm text-center text-gray-600">
            Đã có tài khoản?{" "}
            <Link href={loginHref} className="text-blue-500 underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
