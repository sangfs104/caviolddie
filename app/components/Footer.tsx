"use client";

import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Gửi thất bại");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại",
      );
    }
  };

  return (
    <footer className="border-t border-black bg-white px-6 sm:px-8 py-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* ==================== BẢN QUYỀN ==================== */}
        <div className="md:max-w-xs">
          <p className="text-sm text-gray-500">
            © 2026, CAVIOLDDIE —{" "}
            <Link href="/privacy-policy" className="underline text-gray-500">
              Privacy policy
            </Link>
          </p>
        </div>

        {/* ==================== ĐĂNG KÝ NHẬN TIN ==================== */}
        <div className="md:max-w-sm md:flex-1">
          <span className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
            Đăng ký nhận tin
          </span>
          <form
            onSubmit={handleSubscribe}
            className="flex items-stretch border border-black"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Nhập email của bạn"
              aria-label="Email"
              className="flex-1 min-w-0 px-3 py-2 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wide bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Đang gửi..." : "Gửi"}
            </button>
          </form>
          <div className="mt-1.5 h-4">
            {status === "success" && (
              <p className="text-xs text-green-600">
                Đăng ký thành công, cảm ơn bạn!
              </p>
            )}
            {status === "error" && (
              <p className="text-xs text-red-600">{errorMessage}</p>
            )}
          </div>
        </div>

        {/* ==================== MẠNG XÃ HỘI ==================== */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
            Find us on
          </span>
          <div className="flex gap-2">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877F2] hover:opacity-85 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex items-center justify-center w-9 h-9 rounded-full hover:opacity-85 transition-opacity"
              style={{
                background:
                  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-black hover:opacity-85 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M16.5 2h-3.2v13.6c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5c.3 0 .6.05.9.14V9.9c-.3-.04-.6-.06-.9-.06-3 0-5.4 2.4-5.4 5.4S8.3 20.7 11.3 20.7s5.4-2.4 5.4-5.4V8.4c1.1.8 2.4 1.3 3.9 1.3V6.5c-1.9 0-3.5-1.4-3.9-3.2-.1-.4-.2-.9-.2-1.3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
