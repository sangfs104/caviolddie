"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrderSummary {
  _id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

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
    return <div className="p-8 text-center text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const canCancel = ["pending", "paid"].includes(order.status);
            return (
              <div
                key={order._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <Link
                    href={`/order-confirmation?orderId=${order._id}`}
                    className="font-medium underline"
                  >
                    #{order._id}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.createdAt)} ·{" "}
                    {statusLabel[order.status] || order.status} ·{" "}
                    {formatPrice(order.totalPrice)}
                  </p>
                </div>
                a
                {canCancel && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    disabled={cancellingId === order._id}
                    className="text-sm text-red-600 disabled:opacity-50"
                  >
                    {cancellingId === order._id ? "Đang hủy..." : "Hủy"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
