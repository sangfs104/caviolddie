// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";

// interface OrderProductItem {
//   product: { name: string; images?: string[] };
//   variant?: { size?: string; color?: string };
//   quantity: number;
// }

// interface ShippingAddress {
//   fullName: string;
//   phone: string;
//   address: string;
//   city: string;
//   country: string;
// }

// interface OrderDetail {
//   _id: string;
//   status: string;
//   totalPrice: number;
//   paymentMethod: string;
//   products: OrderProductItem[];
//   shippingAddress?: ShippingAddress;
// }

// const formatPrice = (price: number) =>
//   new Intl.NumberFormat("vi-VN", {
//     style: "currency",
//     currency: "VND",
//   }).format(price);

// const statusLabel: Record<string, string> = {
//   pending: "Chờ xử lý",
//   paid: "Đã thanh toán",
//   shipped: "Đang giao",
//   completed: "Hoàn tất",
//   cancelled: "Đã hủy",
// };

// function OrderConfirmationContent() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const orderId = searchParams.get("orderId");

//   const [order, setOrder] = useState<OrderDetail | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [cancelling, setCancelling] = useState(false);

//   const fetchOrder = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/login");
//       return;
//     }
//     if (!orderId) {
//       setError("Không tìm thấy mã đơn hàng");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//         },
//       );
//       if (!res.ok) throw new Error("Không thể tải đơn hàng");
//       const data = await res.json();
//       setOrder(data);
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrder();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [orderId]);

//   const handleCancel = async () => {
//     if (!order) return;
//     if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

//     setCancelling(true);
//     const token = localStorage.getItem("token");
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
//         {
//           method: "PATCH",
//           headers: { Authorization: `Bearer ${token}` },
//           credentials: "include",
//         },
//       );
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Không thể hủy đơn hàng");
//       setOrder(data);
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Lỗi khi hủy đơn hàng");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-gray-600">Đang tải...</div>;
//   }

//   if (error) {
//     return <div className="p-8 text-center text-red-600">{error}</div>;
//   }

//   if (!order) return null;

//   const canCancel = ["pending", "paid"].includes(order.status);

//   return (
//     <div className="max-w-2xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-bold mb-2">
//         {order.status === "cancelled"
//           ? "Đơn hàng đã bị hủy"
//           : "Đặt hàng thành công!"}
//       </h1>
//       <p className="text-gray-600 mb-6">Mã đơn hàng: {order._id}</p>

//       <div className="border rounded-lg p-4 mb-6">
//         <p className="mb-2">
//           Trạng thái:{" "}
//           <span className="font-semibold">
//             {statusLabel[order.status] || order.status}
//           </span>
//         </p>
//         <p className="mb-2">
//           Thanh toán:{" "}
//           <span className="font-semibold">
//             {order.paymentMethod === "cash"
//               ? "Thanh toán khi nhận hàng (COD)"
//               : "Chuyển khoản ngân hàng"}
//           </span>
//         </p>

//         <div className="divide-y">
//           {order.products.map((item, idx) => (
//             <div key={idx} className="py-2 flex justify-between text-sm">
//               <span>
//                 {item.product?.name}
//                 {item.variant &&
//                   ` (${item.variant.size ?? ""}${
//                     item.variant.color ? ", " + item.variant.color : ""
//                   })`}
//               </span>
//               <span>x{item.quantity}</span>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-between font-semibold mt-3 pt-3 border-t">
//           <span>Tổng cộng</span>
//           <span>{formatPrice(order.totalPrice)}</span>
//         </div>

//         {order.shippingAddress && (
//           <p className="text-sm text-gray-600 mt-3">
//             Giao đến: {order.shippingAddress.fullName} -{" "}
//             {order.shippingAddress.phone} - {order.shippingAddress.address},{" "}
//             {order.shippingAddress.city}, {order.shippingAddress.country}
//           </p>
//         )}
//       </div>

//       <div className="flex items-center gap-4">
//         <Link href="/orders" className="underline text-sm">
//           Xem tất cả đơn hàng
//         </Link>
//         {canCancel && (
//           <button
//             onClick={handleCancel}
//             disabled={cancelling}
//             className="ml-auto bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
//           >
//             {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function OrderConfirmationPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="p-8 text-center text-gray-600">Đang tải...</div>
//       }
//     >
//       <OrderConfirmationContent />
//     </Suspense>
//   );
// }
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  ArrowRight,
  Package,
} from "lucide-react";

interface OrderProductItem {
  product: { name: string; images?: string[] };
  variant?: { size?: string; color?: string };
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface OrderDetail {
  _id: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  products: OrderProductItem[];
  shippingAddress?: ShippingAddress;
}

// ==================== TOKENS ====================
// Bảng màu & biến CSS lấy cảm hứng từ hoá đơn/vé giấy — tông sage-off-white
// trung tính, mực đậm gần đen-xanh, điểm nhấn xanh ngọc cho trạng thái
// thành công và đỏ gạch cho trạng thái huỷ.
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
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const statusChipClass: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-[var(--success-soft)] text-[var(--success)]",
  shipped: "bg-blue-50 text-blue-700",
  completed: "bg-[var(--success-soft)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

// Đường viền đứt + 2 lỗ tròn ở hai mép, mô phỏng mí xé của vé/hoá đơn giấy,
// ngăn cách phần "cuống" (trạng thái) với phần thân chi tiết đơn hàng.
function TearLine() {
  return (
    <div className="relative h-0">
      <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-[var(--line)]" />
      <span
        className="absolute -left-[11px] -top-[11px] h-[22px] w-[22px] rounded-full"
        style={{ background: "var(--bg)" }}
      />
      <span
        className="absolute -right-[11px] -top-[11px] h-[22px] w-[22px] rounded-full"
        style={{ background: "var(--bg)" }}
      />
    </div>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!orderId) {
      setError("Không tìm thấy mã đơn hàng");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Không thể tải đơn hàng");
      const data = await res.json();
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    setCancelling(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể hủy đơn hàng");
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi hủy đơn hàng");
    } finally {
      setCancelling(false);
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
        <div className="max-w-sm rounded-xl border border-[var(--line)] bg-[var(--paper)] px-6 py-8 text-center">
          <XCircle className="mx-auto mb-3 h-8 w-8 text-[var(--danger)]" />
          <p className="text-sm font-medium text-[var(--ink)]">{error}</p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm font-semibold text-[var(--ink)] underline underline-offset-4"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const canCancel = ["pending", "paid"].includes(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div
      className="min-h-screen px-4 py-10 sm:py-14"
      style={{ ...receiptVars, background: "var(--bg)" }}
    >
      <div className="mx-auto max-w-md">
        {/* ============ CUỐNG VÉ: trạng thái + mã đơn ============ */}
        <div className="relative overflow-visible rounded-t-2xl border border-b-0 border-[var(--line)] bg-[var(--paper)] px-6 pt-7 pb-6 shadow-sm">
          {/* Con dấu tròn xoay nhẹ — chi tiết nhận diện riêng của trang */}
          <div
            className={`absolute right-5 top-5 flex h-14 w-14 rotate-[-10deg] items-center justify-center rounded-full border-2 border-dashed text-center ${
              isCancelled
                ? "border-[var(--danger)] text-[var(--danger)]"
                : "border-[var(--success)] text-[var(--success)]"
            }`}
          >
            {isCancelled ? (
              <XCircle className="h-6 w-6" />
            ) : (
              <CheckCircle2 className="h-6 w-6" />
            )}
          </div>

          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            Số đơn hàng
          </p>
          <p className="mt-1 max-w-[75%] break-all font-mono text-sm font-medium text-[var(--ink)]">
            #{order._id}
          </p>

          <h1 className="mt-4 max-w-[80%] text-xl font-bold leading-snug text-[var(--ink)] sm:text-2xl">
            {isCancelled ? "Đơn hàng đã bị hủy" : "Đặt hàng thành công!"}
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {isCancelled
              ? "Đơn hàng của bạn đã được hủy theo yêu cầu."
              : "Cảm ơn bạn đã mua sắm. Chúng tôi sẽ xử lý đơn ngay."}
          </p>
        </div>

        <TearLine />

        {/* ============ THÂN VÉ: chi tiết đơn hàng ============ */}
        <div className="rounded-b-2xl border border-t-0 border-[var(--line)] bg-[var(--paper)] px-6 pb-6 pt-5 shadow-sm">
          {/* Trạng thái & thanh toán — kiểu nhãn...giá trị của hoá đơn */}
          <div className="space-y-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[var(--ink-muted)]">
                Trạng thái
              </span>
              <span className="-translate-y-[3px] flex-1 border-b border-dotted border-[var(--line)]" />
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  statusChipClass[order.status] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabel[order.status] || order.status}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-[var(--ink-muted)]">
                Thanh toán
              </span>
              <span className="-translate-y-[3px] flex-1 border-b border-dotted border-[var(--line)]" />
              <span className="text-xs font-semibold text-[var(--ink)]">
                {order.paymentMethod === "cash"
                  ? "COD — nhận hàng trả tiền"
                  : "Chuyển khoản ngân hàng"}
              </span>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="mt-5 border-t border-[var(--line)] pt-4">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
              <Package className="h-3.5 w-3.5" />
              Sản phẩm
            </p>
            <div className="divide-y divide-[var(--line)]">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex items-baseline gap-2 py-2">
                  <span className="text-sm text-[var(--ink)]">
                    {item.product?.name}
                    {item.variant &&
                      ` (${item.variant.size ?? ""}${
                        item.variant.color ? ", " + item.variant.color : ""
                      })`}
                  </span>
                  <span className="-translate-y-[3px] flex-1 border-b border-dotted border-[var(--line)]" />
                  <span className="font-mono text-sm text-[var(--ink-muted)]">
                    ×{item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="mt-1 flex items-center justify-between border-t-2 border-[var(--ink)] pt-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ink)]">
              Tổng cộng
            </span>
            <span className="font-mono text-lg font-bold text-[var(--ink)]">
              {formatPrice(order.totalPrice)}
            </span>
          </div>

          {/* Địa chỉ giao hàng */}
          {order.shippingAddress && (
            <div className="mt-5 flex gap-2 rounded-lg bg-[var(--bg)] px-3 py-3">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--ink-muted)]" />
              <p className="text-xs leading-relaxed text-[var(--ink-muted)]">
                <span className="font-semibold text-[var(--ink)]">
                  {order.shippingAddress.fullName}
                </span>{" "}
                · {order.shippingAddress.phone}
                <br />
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          {/* Hành động */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Link
              href="/orders"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--line)] py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
            >
              Xem đơn hàng
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 rounded-full bg-[var(--danger)] py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center px-4"
          style={{ ...receiptVars, background: "var(--bg)" }}
        >
          <p className="text-sm text-[var(--ink-muted)]">Đang tải…</p>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
