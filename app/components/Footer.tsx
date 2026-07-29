"use client";

import Link from "next/link";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState;
  "idle" | "loading" | "success" | ("error" > "idle");
  const [newsletterError, setNewsletterError] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setNewsletterStatus("loading");
    setNewsletterError("");

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

      setNewsletterStatus("success");
      setEmail("");
    } catch (err: unknown) {
      setNewsletterStatus("error");
      setNewsletterError(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại",
      );
    }
  };

  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState;
  "idle" | "loading" | "success" | ("error" > "idle");
  const [contactError, setContactError] = useState("");

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (contactStatus !== "idle") setContactStatus("idle");
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    )
      return;

    setContactStatus("loading");
    setContactError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Gửi thất bại");
      }

      setContactStatus("success");
      setContactForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: unknown) {
      setContactStatus("error");
      setContactError(
        err instanceof Error ? err.message : "Có lỗi xảy ra, vui lòng thử lại",
      );
    }
  };

  return (
    <footer className="border-t border-black bg-white px-6 sm:px-8 py-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="md:max-w-xs">
          <p className="text-sm text-gray-500">
            {"\u00A9"} 2026, CAVIOLDDIE {"\u2014"}{" "}
            <Link href="/privacy-policy" className="underline text-gray-500">
              Privacy policy
            </Link>
          </p>
        </div>

        <div className="md:max-w-sm md:flex-1">
          <span className="block text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-2">
            Dang ky nhan tin
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
                if (newsletterStatus !== "idle") setNewsletterStatus("idle");
              }}
              placeholder="Nhap email cua ban"
              aria-label="Email"
              className="flex-1 min-w-0 px-3 py-2 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={newsletterStatus === "loading"}
              className="shrink-0 px-4 py-2 text-xs font-semibold uppercase tracking-wide bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {newsletterStatus === "loading" ? "Dang gui..." : "Gui"}
            </button>
          </form>

          <div className="mt-1.5 h-4">
            {newsletterStatus === "success" && (
              <p className="text-xs text-green-600">
                Dang ky thanh cong, cam on ban!
              </p>
            )}
            {newsletterStatus === "error" && (
              <p className="text-xs text-red-600">{newsletterError}</p>
            )}
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowContactForm((prev) => !prev)}
              className="text-[11px] font-medium tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors underline"
            >
              {showContactForm ? "Dong lien he" : "Lien he / Hoi dap"}
            </button>

            {showContactForm && (
              <form
                onSubmit={handleContactSubmit}
                className="mt-3 space-y-2 border border-gray-200 p-4"
              >
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ho ten"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="So dien thoai (khong bat buoc)"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black placeholder:text-gray-400"
                />
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="Noi dung can hoi..."
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black resize-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  disabled={contactStatus === "loading"}
                  className="w-full bg-black text-white py-2 text-xs font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {contactStatus === "loading" ? "Dang gui..." : "Gui lien he"}
                </button>

                {contactStatus === "success" && (
                  <p className="text-xs text-green-600">
                    Gui thanh cong! Chung toi se phan hoi som nhat.
                  </p>
                )}
                {contactStatus === "error" && (
                  <p className="text-xs text-red-600">{contactError}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-[11px] font-medium tracking-widest uppercase text-gray-400">
            Find us on
          </span>
          <div className="flex gap-2">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877F2] hover:opacity-85 transition-opacity"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </Link>
            <Link
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
            </Link>
            <Link
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-black hover:opacity-85 transition-opacity"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M16.5 2h-3.2v13.6c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5c.3 0 .6.05.9.14V9.9c-.3-.04-.6-.06-.9-.06-3 0-5.4 2.4-5.4 5.4S8.3 20.7 11.3 20.7s5.4-2.4 5.4-5.4V8.4c1.1.8 2.4 1.3 3.9 1.3V6.5c-1.9 0-3.5-1.4-3.9-3.2-.1-.4-.2-.9-.2-1.3z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
