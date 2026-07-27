"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
    return <div className="p-8 text-center text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!order) return null;

  const canCancel = ["pending", "paid"].includes(order.status);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">
        {order.status === "cancelled"
          ? "Đơn hàng đã bị hủy"
          : "Đặt hàng thành công!"}
      </h1>
      <p className="text-gray-600 mb-6">Mã đơn hàng: {order._id}</p>

      <div className="border rounded-lg p-4 mb-6">
        <p className="mb-2">
          Trạng thái:{" "}
          <span className="font-semibold">
            {statusLabel[order.status] || order.status}
          </span>
        </p>
        <p className="mb-2">
          Thanh toán:{" "}
          <span className="font-semibold">
            {order.paymentMethod === "cash"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Chuyển khoản ngân hàng"}
          </span>
        </p>

        <div className="divide-y">
          {order.products.map((item, idx) => (
            <div key={idx} className="py-2 flex justify-between text-sm">
              <span>
                {item.product?.name}
                {item.variant &&
                  ` (${item.variant.size ?? ""}${
                    item.variant.color ? ", " + item.variant.color : ""
                  })`}
              </span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-semibold mt-3 pt-3 border-t">
          <span>Tổng cộng</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>

        {order.shippingAddress && (
          <p className="text-sm text-gray-600 mt-3">
            Giao đến: {order.shippingAddress.fullName} -{" "}
            {order.shippingAddress.phone} - {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/orders" className="underline text-sm">
          Xem tất cả đơn hàng
        </Link>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-gray-600">Đang tải...</div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
