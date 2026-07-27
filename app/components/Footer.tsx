"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-black bg-white px-8 py-4 flex justify-between items-center">
      <p className="text-sm text-gray-500">
        © 2025, GNAS WORLDWIDE —{" "}
        <Link href="/privacy-policy" className="underline text-gray-500">
          Privacy policy
        </Link>
      </p>

      <div className="flex flex-col items-end gap-2">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
