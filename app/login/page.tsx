"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login thất bại");
        setLoading(false);
        return;
      }

      // Lưu token và user vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Nếu có guestId thì merge giỏ hàng guest vào user
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

      // Đăng nhập thành công → quay lại trang trước đó (nếu có), mặc định về trang chủ
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block mb-1 font-medium">Mật khẩu :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
