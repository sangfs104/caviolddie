"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export interface CartToastItem {
  name: string;
  price: number;
  image: string;
}

interface CartToastProps {
  item: CartToastItem | null;
  onClose: () => void;
  durationMs?: number;
}

const formatPrice = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

export default function CartToast({
  item,
  onClose,
  durationMs = 4000,
}: CartToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!item) {
      setVisible(false);
      return;
    }
    setVisible(false);
    const showTimer = setTimeout(() => setVisible(true), 10);
    const hideTimer = setTimeout(onClose, durationMs);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [item, durationMs, onClose]);

  if (!item) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[60] w-72 bg-white border border-gray-200 shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700"
        aria-label="Đóng thông báo"
      >
        <X size={13} />
      </button>

      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900">
          Đã thêm vào giỏ hàng thành công!
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="relative w-14 h-14 shrink-0 bg-gray-50 overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-900 truncate">{item.name}</p>
            <p className="text-sm text-gray-900 underline">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
