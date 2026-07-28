// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// interface OrderSummary {
//   _id: string;
//   status: string;
//   totalPrice: number;
//   createdAt: string;
// }

// const formatPrice = (price: number) =>
//   new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//   }).format(price);

// const formatDate = (iso: string) =>
//   new Date(iso).toLocaleDateString("vi-VN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });

// const statusLabel: Record<string, string> = {
//   pending: "Chờ xử lý",
//   paid: "Đã thanh toán",
//   shipped: "Đang giao",
//   completed: "Hoàn tất",
//   cancelled: "Đã hủy",
// };

// export default function OrdersPage() {
//   const router = useRouter();
//   const [orders, setOrders] = useState<OrderSummary[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [cancellingId, setCancellingId] = useState<string | null>(null);

//   const fetchOrders = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login?redirect=/orders");
//       return;
//     }
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
//         headers: { Authorization: `Bearer ${token}` },
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
//       const data = await res.json();
//       setOrders(data);
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   const handleCancel = async (id: string) => {
//     if (!confirm("Hủy đơn hàng này?")) return;
//     setCancellingId(id);
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/cancel`,
//         {
//           method: "PATCH",
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//         },
//       );
//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) throw new Error(data.error || "Không thể hủy đơn hàng");
//       await fetchOrders();
//     } catch (err: unknown) {
//       alert(err instanceof Error ? err.message : "Không thể hủy đơn hàng");
//     } finally {
//       setCancellingId(null);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-600">Đang tải...</div>;
//   }

//   if (error) {
//     return <div className="p-8 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
//       {orders.length === 0 ? (
//         <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
//       ) : (
//         <div className="space-y-4">
//           {orders.map((order) => {
//             const canCancel = ["pending", "paid"].includes(order.status);
//             return (
//               <div
//                 key={order._id}
//                 className="border rounded-lg p-4 flex justify-between items-center"
//               >
//                 <div>
//                   <Link
//                     href={`/order-confirmation?orderId=${order._id}`}
//                     className="font-medium underline"
//                   >
//                     #{order._id}
//                   </Link>
//                   <p className="text-sm text-gray-600">
//                     {formatDate(order.createdAt)} ·{" "}
//                     {statusLabel[order.status] || order.status} ·{" "}
//                     {formatPrice(order.totalPrice)}
//                   </p>
//                 </div>
//                 a
//                 {canCancel && (
//                   <button
//                     onClick={() => handleCancel(order._id)}
//                     disabled={cancellingId === order._id}
//                     className="text-sm text-red-600 disabled:opacity-50"
//                   >
//                     {cancellingId === order._id ? "Đang hủy..." : "Hủy"}
//                   </button>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, PackageSearch } from "lucide-react";

interface OrderSummary {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

// ==================== TOKENS ====================
// Cùng hệ thống thiết kế "hoá đơn giấy" với trang xác nhận & chi tiết đơn
// hàng, giữ trải nghiệm nhất quán xuyên suốt luồng đơn hàng.
const receiptVars: React.CSSProperties = {
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

// Sọc màu bên trái mỗi dòng đơn hàng, đóng vai trò như "cuống xé" thu nhỏ,
// giúp quét trạng thái bằng mắt nhanh hơn khi danh sách dài.
const statusStripeClass: Record<string, string> = {
  pending: "bg-[var(--amber)]",
  paid: "bg-[var(--success)]",
  shipped: "bg-blue-500",
  completed: "bg-[var(--success)]",
  cancelled: "bg-[var(--danger)]",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login?redirect=/orders");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Không thể tải danh sách đơn hàng");
      const data = await res.json();
      setOrders(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancel = async (id: string) => {
    if (!confirm("Hủy đơn hàng này?")) return;
    setCancellingId(id);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Không thể hủy đơn hàng");
      await fetchOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Không thể hủy đơn hàng");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ ...receiptVars, background: "var(--bg)" }}
      >
        <p className="text-sm text-[var(--ink-muted)]">Đang tải đơn hàng…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ ...receiptVars, background: "var(--bg)" }}
      >
        <p className="text-sm text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-10 sm:py-14"
      style={{ ...receiptVars, background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-2xl">
        <h1 className="text-xl font-bold text-[var(--ink)] sm:text-2xl">
          Đơn hàng của tôi
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          {orders.length > 0
            ? `Bạn có ${orders.length} đơn hàng`
            : "Lịch sử mua sắm sẽ hiển thị tại đây"}
        </p>

        {orders.length === 0 ? (
          <div className="mt-8 flex flex-col items-center rounded-2xl border border-[var(--line)] bg-[var(--paper)] px-6 py-14 text-center">
            <PackageSearch className="mb-3 h-8 w-8 text-[var(--ink-muted)]" />
            <p className="text-sm font-medium text-[var(--ink)]">
              Bạn chưa có đơn hàng nào
            </p>
            <Link
              href="/"
              className="mt-4 rounded-full bg-[var(--ink)] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {orders.map((order) => {
              const canCancel = ["pending", "paid"].includes(order.status);
              const isCancelling = cancellingId === order._id;

              return (
                <div
                  key={order._id}
                  className="flex overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] shadow-sm"
                >
                  {/* Sọc trạng thái */}
                  <div
                    className={`w-1.5 flex-shrink-0 ${
                      statusStripeClass[order.status] ?? "bg-gray-300"
                    }`}
                  />

                  <Link
                    href={`/order-confirmation?orderId=${order._id}`}
                    className="flex flex-1 items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-[var(--bg)] sm:px-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-mono text-xs font-medium text-[var(--ink)] sm:text-sm">
                          #{order._id}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                            statusChipClass[order.status] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {statusLabel[order.status] || order.status}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-[var(--ink-muted)] sm:text-sm">
                        {formatDate(order.createdAt)} ·{" "}
                        <span className="font-mono font-medium text-[var(--ink)]">
                          {formatPrice(order.totalPrice)}
                        </span>
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--ink-muted)]" />
                  </Link>

                  {canCancel && (
                    <div className="flex items-center border-l border-[var(--line)] px-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleCancel(order._id);
                        }}
                        disabled={isCancelling}
                        className="text-xs font-semibold text-[var(--danger)] transition-opacity hover:opacity-80 disabled:opacity-50"
                      >
                        {isCancelling ? "Đang hủy…" : "Hủy"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
