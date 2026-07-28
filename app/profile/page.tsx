// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const ProfileUser = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<{
//     id: string;
//     name: string;
//     email: string;
//   } | null>(null);

//   // Load user từ localStorage
//   useEffect(() => {
//     const storedUser =
//       typeof window !== "undefined" ? localStorage.getItem("user") : null;
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     // Xóa user khỏi localStorage
//     localStorage.removeItem("user");
//     setUser(null);

//     // Redirect về login
//     router.push("/login");
//   };

//   if (!user) {
//     return (
//       <div className="text-center p-4">
//         Không tìm thấy thông tin người dùng.
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">
//           Thông tin cá nhân
//         </h1>
//         <div className="space-y-4">
//           <div>
//             <label className="block mb-1 font-medium">ID:</label>
//             <p className="border border-gray-300 p-2 rounded">{user.id}</p>
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Tên:</label>
//             <p className="border border-gray-300 p-2 rounded">{user.name}</p>
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Email:</label>
//             <p className="border border-gray-300 p-2 rounded">{user.email}</p>
//           </div>
//         </div>

//         {/* Nút đăng xuất */}
//         <button
//           onClick={handleLogout}
//           className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
//         >
//           Đăng xuất
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfileUser;
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  MapPin,
  Package,
  ChevronRight,
  PackageSearch,
  Mail,
  BadgeCheck,
} from "lucide-react";

// ==================== TYPES ====================

interface User {
  id: string;
  name: string;
  email: string;
}

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

interface OrderSummary {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

// ==================== TOKENS ====================
// Cùng hệ thống thiết kế "hoá đơn giấy" với luồng giỏ hàng/đơn hàng, để
// trang cá nhân không bị lạc tông khi người dùng di chuyển qua lại.
const pageVars: React.CSSProperties = {
  ["--bg" as string]: "#EEF1EC",
  ["--paper" as string]: "#FFFFFF",
  ["--ink" as string]: "#1B2420",
  ["--ink-muted" as string]: "#67716C",
  ["--line" as string]: "#D7DDD3",
  ["--success" as string]: "#0E7C5A",
  ["--success-soft" as string]: "#E4F3EC",
  ["--danger" as string]: "#C23B3B",
  ["--danger-soft" as string]: "#FBEAEA",
  ["--amber-soft" as string]: "#FDF3E3",
  ["--amber" as string]: "#B8791B",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const statusChipClass: Record<string, string> = {
  pending: "bg-[var(--amber-soft)] text-[var(--amber)]",
  paid: "bg-[var(--success-soft)] text-[var(--success)]",
  shipped: "bg-blue-50 text-blue-700",
  completed: "bg-[var(--success-soft)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

// Số đơn hàng gần nhất hiển thị ngay trên trang cá nhân; xem đầy đủ ở /orders
const RECENT_ORDERS_LIMIT = 3;

const ProfileUser = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressesError, setAddressesError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Load user từ localStorage
  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  const fetchAddresses = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAddressesLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/address`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Không thể tải địa chỉ");
      const data: Address[] = await res.json();
      setAddresses(data);
    } catch (err: unknown) {
      setAddressesError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải địa chỉ",
      );
    } finally {
      setAddressesLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrdersLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không thể tải đơn hàng");
      const data: OrderSummary[] = await res.json();
      setOrders(
        [...data]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, RECENT_ORDERS_LIMIT),
      );
    } catch (err: unknown) {
      setOrdersError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải đơn hàng",
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
    fetchOrders();
  }, [user, fetchAddresses, fetchOrders]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  if (!user) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ ...pageVars, background: "var(--bg)" }}
      >
        <div className="max-w-sm rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-10 text-center">
          <p className="text-sm text-[var(--ink-muted)]">
            Không tìm thấy thông tin người dùng.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-full bg-[var(--ink)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    ?.split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="min-h-screen px-4 py-10 sm:py-14"
      style={{ ...pageVars, background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-2xl space-y-5">
        {/* ============ THẺ NGƯỜI DÙNG ============ */}
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-8 text-center shadow-sm sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-lg font-bold text-white">
            {initials || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold text-[var(--ink)] sm:text-xl">
              {user.name}
            </h1>
            <p className="mt-0.5 flex items-center justify-center gap-1.5 text-sm text-[var(--ink-muted)] sm:justify-start">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
            <p className="mt-1 font-mono text-[11px] text-[var(--ink-muted)]">
              ID: {user.id}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--danger)] transition-colors hover:border-[var(--danger)] hover:bg-[var(--danger-soft)]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </button>
        </div>

        {/* ============ ĐỊA CHỈ ============ */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-6 shadow-sm">
          <div className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            <MapPin className="h-3.5 w-3.5" />
            Địa chỉ giao hàng
          </div>

          {addressesLoading ? (
            <p className="text-sm text-[var(--ink-muted)]">Đang tải…</p>
          ) : addressesError ? (
            <p className="text-sm text-[var(--danger)]">{addressesError}</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-[var(--ink-muted)]">
              Bạn chưa lưu địa chỉ nào. Địa chỉ sẽ được thêm khi bạn đặt hàng ở
              trang thanh toán.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="rounded-lg border border-[var(--line)] bg-[var(--bg)] px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {addr.fullName}
                    </p>
                    {addr.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--success-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--success)]">
                        <BadgeCheck className="h-3 w-3" />
                        Mặc định
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                    {addr.address}, {addr.city}, {addr.country}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--ink-muted)]">
                    SĐT: {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============ ĐƠN HÀNG GẦN ĐÂY ============ */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              <Package className="h-3.5 w-3.5" />
              Đơn hàng gần đây
            </div>
            <Link
              href="/orders"
              className="flex items-center gap-1 text-xs font-semibold text-[var(--ink)] hover:underline"
            >
              Xem tất cả
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {ordersLoading ? (
            <p className="text-sm text-[var(--ink-muted)]">Đang tải…</p>
          ) : ordersError ? (
            <p className="text-sm text-[var(--danger)]">{ordersError}</p>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <PackageSearch className="mb-2 h-7 w-7 text-[var(--ink-muted)]" />
              <p className="text-sm text-[var(--ink-muted)]">
                Bạn chưa có đơn hàng nào
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/order-confirmation?orderId=${order._id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] px-4 py-3 transition-colors hover:bg-[var(--bg)]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-mono text-xs font-medium text-[var(--ink)]">
                        #{order._id}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          statusChipClass[order.status] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusLabel[order.status] || order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--ink-muted)]">
                      {formatDate(order.createdAt)} ·{" "}
                      <span className="font-mono font-medium text-[var(--ink)]">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--ink-muted)]" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
